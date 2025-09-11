"use server";

import * as z from "zod";
import { prisma } from "@/lib/db";
import { AddBalanceSchema } from "@/schemas";
import { TransactionStatus, TransactionType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { sendTransactionReceipt } from "@/lib/email";

export const addBalanceToUser = async (
  values: z.infer<typeof AddBalanceSchema>,
  userId: string
) => {
  const parsed = AddBalanceSchema.safeParse(values);
  if (!parsed.success) {
    return {
      error: "Invalid fields!",
      issues: parsed.error.issues,
    };
  }

  const { amount, fromAccount, type, date } = parsed.data;
  const numericAmount = Number(amount);

  const mapCreditDebitToTransactionType = (type: string): TransactionType => {
    if (type === "CREDIT") return TransactionType.DEPOSIT;
    if (type === "DEBIT") return TransactionType.WITHDRAWAL;
    throw new Error("Invalid transaction type");
  };

  const normalizedType = mapCreditDebitToTransactionType(values.type);

  try {
    const result = await prisma.$transaction(async (tx) => {
      const account = await tx.account.findUnique({
        where: { userId },
        include: { user: true },
      });

      if (!account || !account.user) {
        throw new Error("Account not found!");
      }

      // Check if debit amount exceeds balance
      if (type === "DEBIT" && numericAmount > account.balance) {
        throw new Error("Insufficient funds!");
      }

      // Update balance and get new balance
      const updatedAccount = await tx.account.update({
        where: { id: account.id },
        data: {
          balance:
            type === "CREDIT"
              ? { increment: numericAmount }
              : { decrement: numericAmount },
        },
      });

      const reference = `BALANCE_${type}_${Date.now()}`;
      const transactionDate = new Date(date);
      const description =
        type === "CREDIT"
          ? `Deposit from ${fromAccount}`
          : `Payment to ${fromAccount}`;

      await tx.transaction.create({
        data: {
          accountId: account.id,
          userId,
          amount: numericAmount,
          type: normalizedType,
          description: description,

          reference,
          status: TransactionStatus.COMPLETED,
          date: transactionDate,
          category:
            type === "CREDIT"
              ? "Admin Balance Addition"
              : "Admin Balance Deduction",
          recipientBank: fromAccount,
        },
      });

      await tx.notification.create({
        data: {
          userId,
          type: type === "CREDIT" ? "INCOMING TRANSFER" : "OUTGOING TRANSFER",
          message: `$${numericAmount.toFixed(2)} has been ${
            type === "CREDIT" ? "credited to" : "debited from"
          } your account.`,
          priority: "HIGH",
        },
      });

      return {
        fullName: `${account.user.firstName} ${account.user.lastName}`,
        email: account.user.email,
        newBalance: updatedAccount.balance,
        reference,
        transactionDate,
      };
    });

    try {
      await sendTransactionReceipt(
        result.email,
        result.fullName,
        result.transactionDate,
        numericAmount,
        normalizedType
      );
    } catch (emailError) {
      console.error("Transaction receipt email send error:", emailError);
    }

    revalidatePath("/admin-panel");

    return { success: true };
  } catch (err) {
    console.error("Balance update error:", err);
    return { error: "Something went wrong!" };
  }
};
