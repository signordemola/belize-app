"use server";

import { prisma } from "@/lib/db";
import { verifyPassword } from "@/lib/password";
import { getUserSession } from "@/lib/session";

export const transferBetweenAccounts = async ({
  fromAccountId,
  toAccountId,
  amount,
  reference,
  pin,
}: {
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  reference: string;
  pin: string;
}) => {
  const session = await getUserSession();
  if (!session) return { error: "No active session." };

  const amountRegex = /^\d+(\.\d{1,2})?$/;
  const referenceRegex = /^[a-zA-Z0-9\s]{0,50}$/;
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
  if (fromAccountId === toAccountId) {
    return { error: "Cannot transfer to the same account." };
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

    const accounts = (await prisma.account.findMany({
      where: { userId: user.id, id: { in: [fromAccountId, toAccountId] } },
      select: { id: true, balance: true, type: true, accountNumber: true },
    })) as {
      id: string;
      balance: number;
      type: string;
      accountNumber: string;
    }[];

    const fromAccount = accounts.find((acc) => acc.id === fromAccountId);
    const toAccount = accounts.find((acc) => acc.id === toAccountId);

    if (!fromAccount || !toAccount) {
      return { error: "One or both accounts not found." };
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
          type: "TRANSFER_INTERNAL",
          description: `Transfer to ${toAccount.type} account: ${
            reference || "Internal transfer"
          }`,
          reference: reference || null,
          status: "COMPLETED",
          date: currentDate,
          recipientAccount: toAccount.accountNumber,
          recipientBank: "Belize Bank Inc.",
          pinVerified: true,
          category: "Transfer",
          isFraudSuspected: false,
          createdAt: currentDate,
          updatedAt: currentDate,
        },
      }),
      prisma.transaction.create({
        data: {
          userId: user.id,
          accountId: toAccountId,
          amount,
          type: "DEPOSIT",
          description: `Transfer from ${fromAccount.type} account: ${
            reference || "Internal transfer"
          }`,
          reference: reference || null,
          status: "COMPLETED",
          date: currentDate,
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
      prisma.account.update({
        where: { id: toAccountId },
        data: { balance: toAccount.balance + amount, updatedAt: currentDate },
      }),
    ]);

    return { success: "Transfer completed successfully!" };
  } catch (error) {
    console.error("Transfer error:", error);
    return { error: `Transfer failed` };
  }
};

export const transferToBelizeUser = async ({
  fromAccountId,
  recipientEmail,
  amount,
  reference,
  pin,
}: {
  fromAccountId: string;
  recipientEmail: string;
  amount: number;
  reference: string;
  pin: string;
}) => {
  const session = await getUserSession();
  if (!session) return { error: "No active session." };

  const amountRegex = /^\d+(\.\d{1,2})?$/;
  const referenceRegex = /^[a-zA-Z0-9\s]{0,50}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
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
  if (!emailRegex.test(recipientEmail)) {
    return { error: "Please enter a valid email address." };
  }
  if (amount <= 0) {
    return { error: "Amount must be greater than 0." };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        email: true,
        transactionPin: true,
        isTransferBlocked: true,
      },
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

    if (user.email === recipientEmail) {
      return { error: "Cannot transfer to your own account." };
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

    const recipient = await prisma.user.findUnique({
      where: { email: recipientEmail },
      select: { id: true },
    });

    if (!recipient) {
      return { error: "Recipient user not found." };
    }

    const recipientAccount = (await prisma.account.findFirst({
      where: { userId: recipient.id, type: "CHECKING" },
      select: { id: true, accountNumber: true, type: true, balance: true },
    })) as {
      id: string;
      balance: number;
      type: string;
      accountNumber: string;
    } | null;

    if (!recipientAccount) {
      return { error: "Recipient does not have a checking account." };
    }

    const currentDate = new Date();

    await prisma.$transaction([
      prisma.transaction.create({
        data: {
          userId: user.id,
          accountId: fromAccountId,
          amount,
          type: "TRANSFER_BELIZE",
          description: `Transfer to Belize user ${recipientEmail}: ${
            reference || "Belize transfer"
          }`,
          reference: reference || null,
          status: "COMPLETED",
          date: currentDate,
          recipientAccount: recipientAccount.accountNumber,
          recipientBank: "Belize Bank Inc.",
          pinVerified: true,
          category: "Transfer",
          isFraudSuspected: false,
          createdAt: currentDate,
          updatedAt: currentDate,
        },
      }),
      prisma.transaction.create({
        data: {
          userId: recipient.id,
          accountId: recipientAccount.id,
          amount,
          type: "DEPOSIT",
          description: `Transfer from ${fromAccount.type} account: ${
            reference || "Belize transfer"
          }`,
          reference: reference || null,
          status: "COMPLETED",
          date: currentDate,
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
      prisma.account.update({
        where: { id: recipientAccount.id },
        data: {
          balance: recipientAccount.balance + amount,
          updatedAt: currentDate,
        },
      }),
    ]);

    return { success: "Transfer completed successfully!" };
  } catch (error) {
    console.error("Transfer error:", error);
    return { error: "Something went wrong while processing the transfer." };
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
