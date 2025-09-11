"use server";

import { prisma } from "@/lib/db";
import { verifyPassword } from "@/lib/password";
import { getUserSession } from "@/lib/session";
import { TransferToBelizeSchema } from "@/schemas";
import { TransactionStatus, TransactionType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import z from "zod";

export const transferToBelizeUser = async (
  values: z.infer<typeof TransferToBelizeSchema>
) => {
  const { success, error, data } = TransferToBelizeSchema.safeParse(values);
  if (!success) {
    return {
      error: "Invalid fields!",
      issues: error.issues,
    };
  }

  const session = await getUserSession();
  if (!session) return null;

  const { fromAccount, recipientAccount, amount, reference, pin } = data;

  const formattedAmount = Number(amount);

  console.log(formattedAmount);

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        transactionPin: true,
        isTransferBlocked: true,
      },
    });

    if (!user) return { error: "User not found." };
    if (user.isTransferBlocked) return { error: "Transfers blocked" };
    if (!user.transactionPin) return { error: "Transaction PIN not set!" };

    const isValidPin = await verifyPassword(pin, user.transactionPin);
    if (!isValidPin) return { error: "Invalid transaction PIN!" };

    const fromAcct = await prisma.account.findUnique({
      where: { id: fromAccount },
      select: {
        id: true,
        userId: true,
        balance: true,
        accountNumber: true,
        type: true,
      },
    });

    if (!fromAcct || fromAcct.userId !== user.id) {
      return { error: "Source account not found!" };
    }

    if (fromAcct.balance < formattedAmount) {
      return { error: "Insufficient balance" };
    }

    const recipientAcct = await prisma.account.findUnique({
      where: { accountNumber: recipientAccount },
      include: { user: true },
    });

    console.log("Recipient Input: ", recipientAccount);
    console.log("Recipient account: ", recipientAcct);

    if (!recipientAcct) {
      return { error: "Recipient account not found!" };
    }

    if (recipientAcct.id === fromAcct.id || recipientAcct.userId === user.id) {
      return { error: "Cannot transfer to the same account!" };
    }

    const debitDescription = `Payment to ${recipientAcct.user.firstName} ${recipientAcct.user.lastName} (Belize Bank)`;
    const creditDescription = `Deposit from ${user.firstName} ${user.lastName} (Belize Bank)`;

    await prisma.$transaction([
      prisma.transaction.create({
        data: {
          accountId: fromAcct.id,
          userId: user.id,
          amount: formattedAmount,
          type: TransactionType.TRANSFER_BELIZE,
          description: debitDescription,
          reference,
          status: TransactionStatus.COMPLETED,
          date: new Date(),
          category: "Transfer",
          recipientBank: "Belize Bank Inc.",
        },
      }),

      prisma.transaction.create({
        data: {
          accountId: recipientAcct.id,
          userId: recipientAcct.user.id,
          amount: formattedAmount,
          type: TransactionType.DEPOSIT,
          description: creditDescription,
          reference,
          status: TransactionStatus.COMPLETED,
          date: new Date(),
          category: "Incoming Transfer",
          recipientBank: fromAccount,
        },
      }),

      prisma.account.update({
        where: { id: fromAcct.id },
        data: {
          balance: { decrement: formattedAmount },
          updatedAt: new Date(),
        },
      }),

      prisma.account.update({
        where: { id: recipientAcct.id },
        data: {
          balance: { increment: formattedAmount },
          updatedAt: new Date(),
        },
      }),

      prisma.notification.create({
        data: {
          userId: recipientAcct.user.id,
          type: "INCOMING TRANSFER",
          message: `${formattedAmount.toFixed(
            2
          )} has been deposited into your account.`,
          priority: "HIGH",
        },
      }),

      prisma.notification.create({
        data: {
          userId: user.id,
          type: "OUTGOING TRANSFER",
          message: `You made a transfer of ${formattedAmount.toFixed(2)}`,
          priority: "HIGH",
        },
      }),
    ]);

    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.log(error);
  }
};

export const transferInternational = async ({
  fromAccountId,
  recipientName,
  bankName,
  swiftCode,
  accountNumber,
  iban,
  country,
  currency,
  amount,
  reference,
  pin,
}: {
  fromAccountId: string;
  recipientName: string;
  bankName: string;
  swiftCode: string;
  accountNumber: string;
  iban: string | null;
  country: string;
  currency: string;
  amount: number;
  reference: string;
  pin: string;
}) => {
  const session = await getUserSession();
  if (!session) return { error: "No active session." };

  const amountRegex = /^\d+(\.\d{1,2})?$/;
  const referenceRegex = /^[a-zA-Z0-9\s]{0,50}$/;
  const swiftCodeRegex = /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/;
  const ibanRegex = /^[A-Z]{2}[0-9]{2}[A-Z0-9]{1,30}$/;
  const nameRegex = /^[a-zA-Z\s]{2,100}$/;
  const bankNameRegex = /^[a-zA-Z0-9\s&-]{2,100}$/;
  const pinRegex = /^\d{4}$/;

  if (!pinRegex.test(pin)) {
    return { error: "PIN must be exactly 4 digits." };
  }

  if (!amountRegex.test(amount.toString())) {
    return {
      error: "Amount must be a positive number with up to 2 decimal places.",
    };
  }
  if (!referenceRegex.test(reference)) {
    return { error: "Reference must be alphanumeric and up to 50 characters." };
  }
  if (!nameRegex.test(recipientName)) {
    return {
      error:
        "Recipient name must be 2-100 characters, letters and spaces only.",
    };
  }
  if (!bankNameRegex.test(bankName)) {
    return {
      error:
        "Bank name must be 2-100 characters, alphanumeric, spaces, & or -.",
    };
  }
  if (!swiftCodeRegex.test(swiftCode)) {
    return {
      error:
        "SWIFT/BIC code must be 8 or 11 characters (e.g., ABCDEF12 or ABCDEF12GHI).",
    };
  }
  if (!accountNumber) {
    return { error: "Account number is required." };
  }
  if (iban && !ibanRegex.test(iban)) {
    return { error: "IBAN must be valid (e.g., DE89370400440532013000)." };
  }
  if (amount <= 0) {
    return { error: "Amount must be greater than 0." };
  }
  if (!country) {
    return { error: "Country is required." };
  }
  if (!currency) {
    return { error: "Currency is required." };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { id: true, transactionPin: true, isTransferBlocked: true },
    });

    if (!user) {
      return { error: "User not found." };
    }

    if (user.isTransferBlocked) {
      return { error: "Transfers are currently blocked for this account." };
    }

    if (!user.transactionPin) {
      return { error: "Transaction PIN not set." };
    }

    const isValidPin = await verifyPassword(pin, user.transactionPin);
    if (!isValidPin) {
      return { error: "Invalid transaction PIN." };
    }

    const fromAccount = (await prisma.account.findUnique({
      where: { id: fromAccountId, userId: user.id },
      select: { id: true, balance: true, type: true, accountNumber: true },
    })) as {
      id: string;
      balance: number;
      type: string;
      accountNumber: string;
    } | null;

    if (!fromAccount) {
      return { error: "Source account not found." };
    }

    if (fromAccount.balance < amount) {
      return { error: "Insufficient balance in the source account." };
    }

    const currentDate = new Date();

    await prisma.$transaction([
      prisma.transaction.create({
        data: {
          userId: user.id,
          accountId: fromAccountId,
          amount,
          type: "TRANSFER_INTERNATIONAL",
          description: `International transfer to ${recipientName} at ${bankName}: ${
            reference || "International transfer"
          }`,
          reference: reference || null,
          status: "PENDING",
          date: currentDate,
          recipientAccount: accountNumber,
          recipientBank: bankName,
          swiftCode: swiftCode,
          pinVerified: true,
          category: "Transfer",
          isFraudSuspected: false,
          createdAt: currentDate,
          updatedAt: currentDate,
        },
      }),
      prisma.account.update({
        where: { id: fromAccountId },
        data: { balance: fromAccount.balance - amount, updatedAt: currentDate },
      }),
    ]);

    return { success: "International transfer initiated successfully!" };
  } catch (error) {
    console.error("Transfer error:", error);
    return { error: "Something went wrong while processing the transfer." };
  }
};

export const transferToUSBank = async ({
  fromAccountId,
  bankName,
  accountNumber,
  accountHolderName,
  amount,
  reference,
  pin,
}: {
  fromAccountId: string;
  bankName: string;
  accountNumber: string;
  accountHolderName: string;
  amount: number;
  reference: string;
  pin: string;
}) => {
  const session = await getUserSession();
  if (!session) return { error: "No active session." };

  const amountRegex = /^\d+(\.\d{1,2})?$/;
  const referenceRegex = /^[a-zA-Z0-9\s]{0,50}$/;
  const accountNumberRegex = /^\d{8,17}$/;
  const nameRegex = /^[a-zA-Z\s]{2,100}$/;
  const bankNameRegex = /^[a-zA-Z0-9\s&-]{2,100}$/;
  const pinRegex = /^\d{4}$/;

  if (!pinRegex.test(pin)) {
    return { error: "PIN must be exactly 4 digits." };
  }

  if (!amountRegex.test(amount.toString())) {
    return {
      error: "Amount must be a positive number with up to 2 decimal places.",
    };
  }
  if (!referenceRegex.test(reference)) {
    return { error: "Reference must be alphanumeric and up to 50 characters." };
  }
  if (!accountNumberRegex.test(accountNumber)) {
    return { error: "Account number must be 8-17 digits." };
  }
  if (!nameRegex.test(accountHolderName)) {
    return {
      error:
        "Account holder name must be 2-100 characters, letters and spaces only.",
    };
  }
  if (!bankNameRegex.test(bankName)) {
    return {
      error:
        "Bank name must be 2-100 characters, alphanumeric, spaces, & or -.",
    };
  }
  if (amount <= 0) {
    return { error: "Amount must be greater than 0." };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { id: true, transactionPin: true, isTransferBlocked: true },
    });

    if (!user) {
      return { error: "User not found." };
    }

    if (user.isTransferBlocked) {
      return { error: "Transfers are currently blocked for this account." };
    }

    if (!user.transactionPin) {
      return { error: "Transaction PIN not set." };
    }

    const isValidPin = await verifyPassword(pin, user.transactionPin);
    if (!isValidPin) {
      return { error: "Invalid transaction PIN." };
    }

    const fromAccount = (await prisma.account.findUnique({
      where: { id: fromAccountId, userId: user.id },
      select: { id: true, balance: true, type: true, accountNumber: true },
    })) as {
      id: string;
      balance: number;
      type: string;
      accountNumber: string;
    } | null;

    if (!fromAccount) {
      return { error: "Source account not found." };
    }

    if (fromAccount.balance < amount) {
      return { error: "Insufficient balance in the source account." };
    }

    const currentDate = new Date();

    await prisma.$transaction([
      prisma.transaction.create({
        data: {
          userId: user.id,
          accountId: fromAccountId,
          amount,
          type: "TRANSFER_US_BANK",
          description: `Transfer to ${accountHolderName} at ${bankName}: ${
            reference || "US Bank transfer"
          }`,
          reference: reference || null,
          status: "PENDING",
          date: currentDate,
          recipientAccount: accountNumber,
          recipientBank: bankName,
          pinVerified: true,
          category: "Transfer",
          isFraudSuspected: false,
          createdAt: currentDate,
          updatedAt: currentDate,
        },
      }),
      prisma.account.update({
        where: { id: fromAccountId },
        data: { balance: fromAccount.balance - amount, updatedAt: currentDate },
      }),
    ]);

    return { success: "US Bank transfer initiated successfully!" };
  } catch (error) {
    console.error("Transfer error:", error);
    return { error: "Something went wrong while processing the transfer." };
  }
};
