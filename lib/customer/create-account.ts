import { faker } from "@faker-js/faker";
import { AccountType } from "@prisma/client";
import { prisma } from "../db";

const generateAccountNumber = (accountType: AccountType): string => {
  const base = faker.string.numeric(8);
  switch (accountType) {
    case AccountType.CHECKING:
      return "01" + base;
    case AccountType.SAVINGS:
      return "02" + base;
    case AccountType.FIXED_DEPOSIT:
      return "03" + base;
    case AccountType.PRESTIGE:
      return "88" + base;
    case AccountType.BUSINESS:
      return "77" + base;
    case AccountType.INVESTMENT:
      return "99" + base;
    default:
      return faker.finance.accountNumber(10);
  }
};

const generateRoutingNumber = (): string => {
  return faker.finance.routingNumber();
};

export async function generateUniqueAccountNumber(
  accountType: AccountType
): Promise<string> {
  let accountNumber: string;
  let attempts = 0;
  const maxAttempts = 10;

  do {
    if (attempts >= maxAttempts) {
      throw new Error(
        "Failed to generate unique account number after multiple attempts"
      );
    }

    accountNumber = generateAccountNumber(accountType);
    const existing = await prisma.account.findUnique({
      where: { accountNumber },
      select: { id: true },
    });

    if (!existing) {
      break;
    }

    attempts++;
  } while (attempts < maxAttempts);

  return accountNumber;
}

export function generateAccountData(
  accountType: AccountType,
  accountNumber: string
) {
  const now = new Date();
  return {
    accountNumber,
    routingNumber: generateRoutingNumber(),
    type: accountType,
    balance: 0,
    status: "ACTIVE" as const,
    interestRate: null,
    openedAt: now,
    createdAt: now,
    updatedAt: now,
  };
}
