"use server";

import { faker } from "@faker-js/faker";
import {
  PrismaClient,
  Prisma,
  TransactionStatus,
  TransactionType,
  AccountType,
} from "@prisma/client";
import {
  addDays,
  addMonths,
  addYears,
  subYears,
  startOfMonth,
  endOfMonth,
} from "date-fns";
import { logger, withRetry } from "@/utils/admin-utils";

interface PopulationConfig {
  numAccountsPerUser: number;
  numTransactionsPerAccount: number;
  numCardsPerAccount: number;
  numBillPaymentsPerUser: number;
  numNotificationsPerUser: number;
}

const config: PopulationConfig = {
  numAccountsPerUser: 2,
  numTransactionsPerAccount: 25,
  numCardsPerAccount: 1,
  numBillPaymentsPerUser: 5,
  numNotificationsPerUser: 10,
};

// Updated to use current date
const getRandomDate = (): Date => {
  const now = new Date();
  return faker.date.between({
    from: subYears(now, 1), // 1 year ago from now
    to: now, // Current date
  });
};

// Updated to use current month
const getCurrentMonthDate = (): Date => {
  const now = new Date();
  return faker.date.between({
    from: startOfMonth(now), // Start of current month
    to: endOfMonth(now), // End of current month
  });
};

const getRandomAmount = (min: number, max: number): number => {
  return faker.number.int({ min, max });
};

const validateAccountNumber = (accountNumber: string): string => {
  if (!/^\d{10}$/.test(accountNumber)) {
    return faker.finance.accountNumber(10);
  }
  return accountNumber;
};

const validateCardNumber = (cardNumber: string): string => {
  const cardTypes = [
    { type: "visa", pattern: /^\d{16}$/ },
    { type: "mastercard", pattern: /^\d{16}$/ },
    { type: "amex", pattern: /^\d{15}$/ },
  ];
  const selectedType = faker.helpers.arrayElement(cardTypes);
  if (!selectedType.pattern.test(cardNumber)) {
    return faker.finance.creditCardNumber({ issuer: selectedType.type });
  }
  return cardNumber;
};

const specificTransactions = [
  {
    type: TransactionType.TRANSFER_US_BANK,
    description: "Investment transfer to Morgan Stanley",
    amount: 500000,
  },
  {
    type: TransactionType.TRANSFER_US_BANK,
    description: "Payment to Sotheby's for art auction",
    amount: 250000,
  },
  {
    type: TransactionType.BILL_PAYMENT,
    description: "Private jet charter via NetJets",
    amount: 75000,
  },
  {
    type: TransactionType.BILL_PAYMENT,
    description: "Purchase at Tiffany & Co.",
    amount: 15000,
  },
  {
    type: TransactionType.BILL_PAYMENT,
    description: "Utility bill for Miami penthouse",
    amount: 2500,
  },
  {
    type: TransactionType.BILL_PAYMENT,
    description: "Yacht maintenance service",
    amount: 30000,
  },
  {
    type: TransactionType.BILL_PAYMENT,
    description: "Membership at Soho House",
    amount: 5000,
  },
  {
    type: TransactionType.BILL_PAYMENT,
    description: "Private chef service for event",
    amount: 10000,
  },
  {
    type: TransactionType.BILL_PAYMENT,
    description: "Luxury car lease (Rolls-Royce)",
    amount: 20000,
  },
  {
    type: TransactionType.BILL_PAYMENT,
    description: "Charity gala sponsorship",
    amount: 50000,
  },
  {
    type: TransactionType.DEPOSIT,
    description: "Dividend payment from investment portfolio",
    amount: 1000000,
  },
];

interface PopulateDataOptions {
  accountTypes?: string[];
}

export async function populateUserData(
  identifier: string,
  options?: PopulateDataOptions
): Promise<{ message: string; userId?: string }> {
  const prisma = new PrismaClient({
    log: ["query", "info", "warn"],
    transactionOptions: { timeout: 30000 },
  });

  const selectedAccountTypes = options?.accountTypes || ["CHECKING", "SAVINGS"];

  try {
    logger.info(`Starting data population for user: ${identifier}`);

    const user = await withRetry(() =>
      prisma.user.findFirst({
        where: {
          OR: [{ id: identifier }, { email: identifier.toLowerCase() }],
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          createdAt: true,
        },
      })
    );

    if (!user) {
      throw new Error(`User with ID or email '${identifier}' not found.`);
    }

    logger.info(`Found user: ${user.email} (ID: ${user.id})`);

    const existingAccounts = await prisma.account.findMany({
      where: { userId: user.id },
    });

    if (existingAccounts.length > 0) {
      logger.info(`User ${user.id} already has accounts, skipping population.`);
      return {
        message: `User ${user.id} data already populated`,
        userId: user.id,
      };
    }

    const userAccounts: {
      id: string;
      type: AccountType;
      accountNumber: string;
      balance: number;
    }[] = [];

    const accountTypeConfigs = selectedAccountTypes.map((type) => {
      switch (type) {
        case "CHECKING":
          return { type: AccountType.CHECKING, targetBalance: 719720 };
        case "SAVINGS":
          return { type: AccountType.SAVINGS, targetBalance: 2500000 };
        case "COMPANY":
          return { type: AccountType.COMPANY, targetBalance: 2500000 };
        default:
          throw new Error(`Invalid account type: ${type}`);
      }
    });

    const billIds: string[] = [];
    const transactions: Prisma.TransactionCreateManyInput[] = [];
    const cards: Prisma.CardCreateManyInput[] = [];
    const notifications: Prisma.NotificationCreateManyInput[] = [];

    await prisma.$transaction(async (tx) => {
      for (const acc of accountTypeConfigs) {
        console.log("Account Type:", acc);
        const account = await tx.account.create({
          data: {
            userId: user.id,
            type: acc.type,
            accountNumber: validateAccountNumber(
              faker.finance.accountNumber(10)
            ),
            routingNumber: faker.finance.routingNumber(),
            balance: acc.targetBalance,
            status: "ACTIVE",
            interestRate:
              acc.type === AccountType.SAVINGS
                ? faker.number.float({
                    min: 0.01,
                    max: 0.05,
                    fractionDigits: 3,
                  })
                : acc.type === AccountType.COMPANY
                ? faker.number.float({
                    min: 0.005,
                    max: 0.03,
                    fractionDigits: 3,
                  })
                : null,
            openedAt: getRandomDate(),
            createdAt: getRandomDate(),
            updatedAt: getRandomDate(),
          },
        });
        userAccounts.push({
          id: account.id,
          type: account.type,
          accountNumber: account.accountNumber,
          balance: account.balance,
        });
        logger.debug(
          `Created ${account.type} account: ${
            account.accountNumber
          } with balance ${account.balance.toFixed(0)}`
        );
      }

      const checkingAccount = userAccounts.find(
        (a) => a.type === AccountType.CHECKING
      );
      if (checkingAccount) {
        const currentDate = new Date();
        const billPayments = [
          {
            accountId: checkingAccount.id,
            userId: user.id,
            provider: "Florida Power & Light (FPL)",
            accountNumber: validateAccountNumber(
              faker.finance.accountNumber(8)
            ),
            amount: getRandomAmount(500, 1500),
            dueDate: addDays(getCurrentMonthDate(), 5),
            status: "PAID",
            paymentDate: getCurrentMonthDate(),
            confirmationNo: faker.string.uuid(),
            isRecurring: true,
            recurringFreq: "MONTHLY",
            recurringEndDate: addMonths(currentDate, 12), // 12 months from now
            createdAt: getCurrentMonthDate(),
            updatedAt: getCurrentMonthDate(),
          },
          {
            accountId: checkingAccount.id,
            userId: user.id,
            provider: "T-Mobile Wireless",
            accountNumber: validateAccountNumber(
              faker.finance.accountNumber(8)
            ),
            amount: getRandomAmount(200, 500),
            dueDate: addDays(getCurrentMonthDate(), 5),
            status: "PAID",
            paymentDate: getCurrentMonthDate(),
            confirmationNo: faker.string.uuid(),
            isRecurring: true,
            recurringFreq: "MONTHLY",
            recurringEndDate: addMonths(currentDate, 12), // 12 months from now
            createdAt: getCurrentMonthDate(),
            updatedAt: getCurrentMonthDate(),
          },
          {
            accountId: checkingAccount.id,
            userId: user.id,
            provider: "Comcast Xfinity",
            accountNumber: validateAccountNumber(
              faker.finance.accountNumber(8)
            ),
            amount: getRandomAmount(300, 600),
            dueDate: addDays(getCurrentMonthDate(), 5),
            status: "PAID",
            paymentDate: getCurrentMonthDate(),
            confirmationNo: faker.string.uuid(),
            isRecurring: true,
            recurringFreq: "MONTHLY",
            recurringEndDate: addMonths(currentDate, 12), // 12 months from now
            createdAt: getCurrentMonthDate(),
            updatedAt: getCurrentMonthDate(),
          },
          {
            accountId: checkingAccount.id,
            userId: user.id,
            provider: "Saks Fifth Avenue",
            accountNumber: validateAccountNumber(
              faker.finance.accountNumber(8)
            ),
            amount: getRandomAmount(5000, 20000),
            dueDate: addDays(getCurrentMonthDate(), 5),
            status: "PAID",
            paymentDate: getCurrentMonthDate(),
            confirmationNo: faker.string.uuid(),
            isRecurring: false,
            createdAt: getCurrentMonthDate(),
            updatedAt: getCurrentMonthDate(),
          },
          {
            accountId: checkingAccount.id,
            userId: user.id,
            provider: "NetJets Private Aviation",
            accountNumber: validateAccountNumber(
              faker.finance.accountNumber(8)
            ),
            amount: getRandomAmount(50000, 150000),
            dueDate: addDays(getCurrentMonthDate(), 5),
            status: "PAID",
            paymentDate: getCurrentMonthDate(),
            confirmationNo: faker.string.uuid(),
            isRecurring: false,
            createdAt: getCurrentMonthDate(),
            updatedAt: getCurrentMonthDate(),
          },
        ];

        await tx.bill.createMany({ data: billPayments, skipDuplicates: true });
        billIds.push(
          ...(
            await tx.bill.findMany({
              where: { userId: user.id },
              select: { id: true },
            })
          ).map((b) => b.id)
        );
        logger.debug(`Created ${billIds.length} bill payments`);
      }

      for (const account of userAccounts) {
        const isChecking = account.type === AccountType.CHECKING;
        const targetBalance = isChecking ? 719725 : 5704583;
        let currentBalance = account.balance;
        const usedReferences = new Set<string>(); // Reset per account

        const generateUniqueReference = (): string => {
          let ref: string;
          do {
            ref = faker.string.uuid();
          } while (usedReferences.has(ref));
          usedReferences.add(ref);
          return ref;
        };

        transactions.length = 0; // Clear transactions array for each account

        transactions.push({
          userId: user.id,
          accountId: account.id,
          amount: getRandomAmount(50000, 200000),
          type: TransactionType.DEPOSIT,
          description: "Business income deposit",
          reference: generateUniqueReference(),
          status: TransactionStatus.COMPLETED,
          date: getCurrentMonthDate(),
          pinVerified: true,
          category: "Income",
          isFraudSuspected: false,
          createdAt: getCurrentMonthDate(),
          updatedAt: getCurrentMonthDate(),
        });
        currentBalance += transactions[transactions.length - 1].amount;

        for (let i = 0; i < config.numTransactionsPerAccount - 1; i++) {
          const isSpecific = i < specificTransactions.length;
          const txn = isSpecific
            ? specificTransactions[i]
            : {
                type: faker.helpers.arrayElement([
                  TransactionType.DEPOSIT,
                  TransactionType.BILL_PAYMENT,
                  TransactionType.TRANSFER_US_BANK,
                  TransactionType.TRANSFER_INTERNATIONAL,
                  TransactionType.WITHDRAWAL,
                  TransactionType.MOBILE_DEPOSIT,
                  TransactionType.TRANSFER_FINTRUST,
                ]),
                description: faker.finance.transactionDescription(),
                amount: getRandomAmount(
                  isChecking ? 1000 : 5000,
                  isChecking ? 50000 : 200000
                ),
              };
          const isDeposit =
            txn.type === TransactionType.DEPOSIT ||
            txn.type === TransactionType.MOBILE_DEPOSIT;
          const status =
            i < 4
              ? TransactionStatus.COMPLETED
              : faker.helpers.arrayElement([
                  TransactionStatus.COMPLETED,
                  TransactionStatus.PENDING,
                  TransactionStatus.FAILED,
                  TransactionStatus.CANCELLED,
                  TransactionStatus.REVERSED,
                  TransactionStatus.PROCESSING,
                ]);
          const amount =
            isDeposit && isSpecific
              ? getRandomAmount(txn.amount * 0.8, txn.amount * 1.2)
              : txn.amount;

          if (!isDeposit && currentBalance - amount < 0) {
            continue;
          }

          currentBalance = isDeposit
            ? currentBalance + amount
            : currentBalance - amount;

          transactions.push({
            userId: user.id,
            accountId: account.id,
            amount,
            type: txn.type,
            description: txn.description,
            reference: generateUniqueReference(),
            status,
            date: i < 4 ? getCurrentMonthDate() : getRandomDate(),
            recipientAccount:
              txn.type === TransactionType.TRANSFER_US_BANK ||
              txn.type === TransactionType.TRANSFER_INTERNATIONAL ||
              txn.type === TransactionType.TRANSFER_FINTRUST
                ? validateAccountNumber(faker.finance.accountNumber(10))
                : null,
            recipientBank:
              txn.type === TransactionType.TRANSFER_US_BANK ||
              txn.type === TransactionType.TRANSFER_INTERNATIONAL ||
              txn.type === TransactionType.TRANSFER_FINTRUST
                ? faker.company.name()
                : null,
            swiftCode:
              txn.type === TransactionType.TRANSFER_INTERNATIONAL
                ? faker.finance.iban()
                : null,
            pinVerified: faker.datatype.boolean(),
            category: txn.description.includes("bill")
              ? "Utilities"
              : faker.finance.transactionType(),
            isFraudSuspected: faker.datatype.boolean({ probability: 0.1 }),
            createdAt: i < 4 ? getCurrentMonthDate() : getRandomDate(),
            updatedAt: i < 4 ? getCurrentMonthDate() : getRandomDate(),
            billId:
              txn.type === TransactionType.BILL_PAYMENT && billIds.length > 0
                ? faker.helpers.arrayElement(billIds)
                : null,
          });
        }

        if (Math.abs(currentBalance - targetBalance) > 100) {
          const adjustment = targetBalance - currentBalance;
          transactions.push({
            userId: user.id,
            accountId: account.id,
            type:
              adjustment > 0
                ? TransactionType.DEPOSIT
                : TransactionType.BILL_PAYMENT,
            status: TransactionStatus.COMPLETED,
            amount: Math.abs(adjustment),
            description:
              adjustment > 0
                ? "Balance Adjustment Deposit"
                : "Balance Adjustment Payment",
            reference: generateUniqueReference(),
            date: getCurrentMonthDate(),
            pinVerified: true,
            category: "Adjustment",
            isFraudSuspected: false,
            createdAt: getCurrentMonthDate(),
            updatedAt: getCurrentMonthDate(),
            billId:
              adjustment > 0
                ? null
                : billIds.length > 0
                ? faker.helpers.arrayElement(billIds)
                : null,
          });
          currentBalance = targetBalance;
        }

        await tx.transaction.createMany({ data: transactions });
        logger.debug(
          `Created ${transactions.length} transactions for account ${account.accountNumber}`
        );

        await tx.account.update({
          where: { id: account.id },
          data: { balance: currentBalance, updatedAt: getRandomDate() },
        });

        transactions.length = 0; // Clear transactions after creation
      }

      for (const account of userAccounts) {
        const currentDate = new Date();
        const cardData = {
          userId: user.id,
          accountId: account.id,
          cardNumber: validateCardNumber(faker.finance.creditCardNumber()),
          status: "ACTIVE",
          cvv: faker.finance.creditCardCVV(),
          pinHash: faker.string.alphanumeric(64),
          dailyLimit: getRandomAmount(10000, 50000),
          token: faker.string.uuid(),
          merchantCategoryLimits: {},
          createdAt: getRandomDate(),
          updatedAt: getRandomDate(),
        };

        if (account.type === AccountType.CHECKING) {
          cards.push({
            ...cardData,
            type: "DEBIT",
            expiryDate: addYears(new Date(), 2),
            merchantCategoryLimits: {},
          });
        } else if (account.type === AccountType.SAVINGS) {
          cards.push({
            ...cardData,
            type: "CREDIT",
            expiryDate: addYears(currentDate, 3), // 3 years from now
            creditLimit: 100000,
            availableCredit: 75000,
            rewardsPoints: getRandomAmount(1000, 5000),
            merchantCategoryLimits: { retail: 20000, travel: 30000 },
          });
        } else if (account.type === AccountType.COMPANY) {
          cards.push({
            ...cardData,
            type: "CREDIT",
            expiryDate: addYears(currentDate, 3), // 3 years from now
            creditLimit: 500000,
            availableCredit: 400000,
            rewardsPoints: getRandomAmount(5000, 10000),
            merchantCategoryLimits: { business: 100000, travel: 75000 },
          });
        }
      }

      await tx.card.createMany({ data: cards, skipDuplicates: true });
      logger.debug(`Created ${cards.length} cards for user`);

      const notificationTypes = [
        "Security Alert",
        "Account Activity",
        "Payment Reminder",
        "New Feature",
        "Promotional Offer",
        "High Balance Alert",
        "Fraud Detection Notice",
        "Bill Payment Confirmation",
        "Card Transaction Alert",
        "Account Statement Available",
      ];
      for (let i = 0; i < config.numNotificationsPerUser; i++) {
        notifications.push({
          userId: user.id,
          type: faker.helpers.arrayElement(notificationTypes),
          message: faker.lorem.sentence({ min: 5, max: 15 }),
          read: faker.datatype.boolean(),
          priority: faker.helpers.arrayElement(["LOW", "MEDIUM", "HIGH"]),
          createdAt: getCurrentMonthDate(),
        });
      }

      await tx.notification.createMany({ data: notifications });
      logger.debug(`Created ${notifications.length} notifications`);
    });

    logger.info(
      `Data population completed for user ${user.email} (ID: ${user.id})`
    );
    return {
      message: `User ${user.id} data populated successfully`,
      userId: user.id,
    };
  } catch (error: unknown) {
    throw new Error(`Data population failed: ${error}`);
  } finally {
    await prisma.$disconnect();
  }
}
