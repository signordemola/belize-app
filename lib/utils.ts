import { Prisma } from "@prisma/client";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import pino from "pino";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function getFormattedDateTime(input?: Date | string) {
  const dateObj =
    input instanceof Date ? input : input ? new Date(input) : new Date();

  const date = dateObj.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const time = dateObj.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return { date, time };
}

export const formatAccountNumber = (accountNumber: string): string => {
  if (!accountNumber) return "";
  const cleanedNumber = accountNumber.replace(/\D/g, "");

  if (cleanedNumber.length === 10) {
    return `${cleanedNumber.slice(0, 3)} ${cleanedNumber.slice(
      3,
      6
    )} ${cleanedNumber.slice(6)}`;
  }

  return cleanedNumber.replace(/(\d{3})(?=\d)/g, "$1 ");
};

export const logger = pino({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
});

export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        (error.code === "P1001" ||
          error.message.includes("Transaction not found")) &&
        i < maxRetries - 1
      ) {
        logger.warn(`Retrying after error: ${error.message}`);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        continue;
      }
      throw error;
    }
  }
  throw new Error("Max retries reached");
}

export const handlePrismaError = (error: unknown): Error => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P1001") {
      logger.error({ err: error }, "Database connection error");
      return new Error("Server is currently down. Please try again later.");
    }
    if (error.message.includes("invalid input value for enum")) {
      logger.error({ err: error }, "Invalid enum value");
      return new Error("Invalid data provided for account creation.");
    }
    if (error.message.includes("Transaction not found")) {
      logger.error({ err: error }, "Transaction error");
      return new Error("Database transaction failed. Please try again.");
    }
    logger.error({ err: error }, `Prisma error ${error.code}`);
    return new Error("An error occurred while accessing the database.");
  } else if (error instanceof Error) {
    logger.error({ err: error }, "Unexpected error");
    return error;
  } else {
    logger.error({ err: error }, "Unknown error occurred");
    return new Error("An unexpected error occurred.");
  }
};
