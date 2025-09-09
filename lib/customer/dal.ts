"use server";

import { cache } from "react";
import { getUserSession } from "../session";
import { prisma } from "../db";
import { endOfMonth, startOfMonth } from "date-fns";
import {
  TransactionStatus,
  TransactionType,
  UserRoleEnum,
} from "@prisma/client";

export const verifyActiveCustomer = async (): Promise<boolean> => {
  try {
    const session = await getUserSession();
    if (!session) return false;

    const userId = session.userId;

    if (session.role !== UserRoleEnum.CUSTOMER) {
      return false;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, isActive: true, role: true },
    });

    if (!user || user.role !== UserRoleEnum.CUSTOMER || !user.isActive) {
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error verifying active customer:", error);
    return false;
  }
};

export const getUserProfile = cache(async () => {
  const session = await getUserSession();
  if (!session) return null;

  const userId = session.userId;

  try {
    const profile = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        email: true,
        firstName: true,
        lastName: true,
        username: true,
        transactionPin: true,
        imageUrl: true,
      },
    });
    return profile;
  } catch (error: unknown) {
    console.log(error);
    return null;
  }
});

export const getRecentTransactions = cache(async () => {
  const session = await getUserSession();
  if (!session) return null;

  const userId = session.userId;

  try {
    const transactions = await prisma.transaction.findMany({
      where: { userId },
      select: {
        id: true,
        amount: true,
        type: true,
        description: true,
        date: true,
      },
      orderBy: { date: "desc" },
      take: 15,
    });

    return transactions.map((txn) => ({
      id: txn.id,
      description: txn.description,
      date: txn.date.toLocaleString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
      amount:
        (txn.type === TransactionType.DEPOSIT ||
        txn.type === TransactionType.MOBILE_DEPOSIT
          ? "+"
          : "-") +
        `$${txn.amount.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
      icon:
        txn.type === TransactionType.DEPOSIT ||
        txn.type === TransactionType.MOBILE_DEPOSIT
          ? "📱"
          : txn.type === TransactionType.TRANSFER_US_BANK ||
            txn.type === TransactionType.TRANSFER_INTERNATIONAL ||
            txn.type === TransactionType.TRANSFER_BELIZE 
          ? "↔️"
          : "💳",
    }));
  } catch (error: unknown) {
    console.log(error);
    return null;
  }
});

export const getUserAccount = cache(async () => {
  const session = await getUserSession();
  if (!session) return null;

  const userId = session.userId;

  try {
    const account = await prisma.account.findUnique({
      where: { userId, status: "ACTIVE" },
      select: {
        id: true,
        balance: true,
        accountNumber: true,
        routingNumber: true,
        type: true,
        status: true,
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!account) return null;

    return {
      id: account.id,
      balance: account.balance,
      accountNumber: account.accountNumber,
      routingNumber: account.routingNumber,
      holder: `${account.user.firstName} ${account.user.lastName}`,
      type: account.type,
      status: account.status,
    };
  } catch (error: unknown) {
    console.log(error);
    return null;
  }
});

export const getNotifications = async () => {
  const session = await getUserSession();
  if (!session) return [];

  const userId = session.userId;

  try {
    const notifications = await prisma.notification.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
      select: {
        id: true,
        type: true,
        message: true,
        read: true,
        createdAt: true,
        priority: true,
      },
    });

    return notifications;
  } catch (error: unknown) {
    console.error("Error fetching notifications:", error);
    return [];
  }
};

export const getUserBeneficiaries = cache(async () => {
  const session = await getUserSession();
  if (!session) return null;

  const userId = session.userId;

  try {
    const beneficiaries = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        beneficiaries: {
          select: {
            id: true,
            name: true,
            type: true,
            accountNumber: true,
            utilityId: true,
          },
        },
      },
    });
    return beneficiaries;
  } catch (error: unknown) {
    console.log(error);
    return null;
  }
});

export const getMonthlySummary = cache(async () => {
  const session = await getUserSession();
  if (!session)
    return { income: 0, incomeCount: 0, outgoing: 0, outgoingCount: 0 };

  const userId = session.userId;
  const start = startOfMonth(new Date());
  const end = endOfMonth(new Date());

  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
        status: TransactionStatus.COMPLETED,
        date: { gte: start, lte: end },
      },
      select: {
        amount: true,
        type: true,
      },
    });

    const income = transactions
      .filter(
        (txn) =>
          txn.type === TransactionType.DEPOSIT ||
          txn.type === TransactionType.MOBILE_DEPOSIT
      )
      .reduce((sum, txn) => sum + txn.amount, 0);
    const incomeCount = transactions.filter(
      (txn) =>
        txn.type === TransactionType.DEPOSIT ||
        txn.type === TransactionType.MOBILE_DEPOSIT
    ).length;

    const outgoing = transactions
      .filter(
        (txn) =>
          txn.type === TransactionType.BILL_PAYMENT ||
          txn.type === TransactionType.WITHDRAWAL ||
          txn.type === TransactionType.TRANSFER_US_BANK ||
          txn.type === TransactionType.TRANSFER_INTERNATIONAL ||
          txn.type === TransactionType.TRANSFER_BELIZE
      )
      .reduce((sum, txn) => sum + txn.amount, 0);
    const outgoingCount = transactions.filter(
      (txn) =>
        txn.type === TransactionType.BILL_PAYMENT ||
        txn.type === TransactionType.WITHDRAWAL ||
        txn.type === TransactionType.TRANSFER_US_BANK ||
        txn.type === TransactionType.TRANSFER_INTERNATIONAL ||
        txn.type === TransactionType.TRANSFER_BELIZE
    ).length;

    return {
      income,
      incomeCount,
      outgoing,
      outgoingCount,
    };
  } catch (error: unknown) {
    console.error("Error fetching monthly summary:", error);
    return { income: 0, incomeCount: 0, outgoing: 0, outgoingCount: 0 };
  }
});
