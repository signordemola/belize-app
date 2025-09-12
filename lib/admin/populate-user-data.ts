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
  subMonths,
  subDays,
  startOfMonth,
  endOfMonth,
} from "date-fns";
import { logger, withRetry } from "../utils";

interface PopulationConfig {
  numTransactionsPerAccount: number;
  numCardsPerAccount: number;
  numBillPaymentsPerUser: number;
  numNotificationsPerUser: number;
  // Distribution of transactions across time periods
  recentTransactionsPercent: number; // Last 30 days
  currentMonthPercent: number; // Current month
  lastQuarterPercent: number; // Last 3 months
  // Rest distributed over the full year
}

const config: PopulationConfig = {
  numTransactionsPerAccount: 60, // Increased for more data
  numCardsPerAccount: 1,
  numBillPaymentsPerUser: 5,
  numNotificationsPerUser: 15, // Increased for year-long notifications
  recentTransactionsPercent: 0.15, // 15% in last 30 days
  currentMonthPercent: 0.1, // 10% in current month
  lastQuarterPercent: 0.25, // 25% in last quarter
  // Remaining 50% distributed over the full year
};

const now = new Date();
const minDate = subYears(now, 1);
const maxDate = subDays(now, 14);

// Generate dates distributed over the past year
const getRandomDateLastYear = (): Date => {
  return faker.date.between({
    from: subYears(now, 1), // 1 year ago from now
    to: maxDate, // Current date
  });
};

// Generate dates for the current month (for recent activity)

const getCurrentMonthDate = (): Date => {
  const from = startOfMonth(subMonths(maxDate, 0));
  const to = maxDate;
  if (from.getTime() > to.getTime()) {
    const prevMonth = subMonths(maxDate, 1);
    return faker.date.between({
      from: startOfMonth(prevMonth),
      to: endOfMonth(prevMonth),
    });
  }
  return faker.date.between({ from, to });
};

// Generate dates for recent activity (last 30 days)
const getRecentDate = (): Date => {
  return faker.date.between({
    from: subDays(maxDate, 30), // 30 days ago
    to: maxDate, // Current date
  });
};

// Generate dates for specific period
const getDateInMonth = (monthsBack: number): Date => {
  const targetMonth = subMonths(maxDate, monthsBack);
  const fromRaw = startOfMonth(targetMonth);
  const to = monthsBack === 0 ? maxDate : endOfMonth(targetMonth);
  const from = fromRaw.getTime() > minDate.getTime() ? fromRaw : minDate;
  return faker.date.between({ from, to });
};

const getRandomAmount = (min: number, max: number): number => {
  return faker.number.float({ min, max, fractionDigits: 2 });
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

// Helper functions for realistic data generation
const getTransactionTypesForAccount = (
  accountType: AccountType
): TransactionType[] => {
  const baseTypes = [
    TransactionType.DEPOSIT,
    TransactionType.BILL_PAYMENT,
    TransactionType.WITHDRAWAL,
  ];

  switch (accountType) {
    case AccountType.CHECKING:
      return [
        ...baseTypes,
        TransactionType.TRANSFER_US_BANK,
        TransactionType.MOBILE_DEPOSIT,
      ];
    case AccountType.BUSINESS:
      return [
        ...baseTypes,
        TransactionType.TRANSFER_US_BANK,
        TransactionType.TRANSFER_BELIZE,
      ];
    case AccountType.INVESTMENT:
    case AccountType.PRESTIGE:
      return [
        ...baseTypes,
        TransactionType.TRANSFER_US_BANK,
        TransactionType.TRANSFER_INTERNATIONAL,
        TransactionType.TRANSFER_BELIZE,
      ];
    default:
      return baseTypes;
  }
};

const generateRealisticDescription = (accountType: AccountType): string => {
  const commonDescriptions = [
    "ATM Withdrawal",
    "Online Purchase",
    "Grocery Store Payment",
    "Gas Station Payment",
    "Restaurant Payment",
  ];

  const businessDescriptions = [
    "Vendor Payment",
    "Office Supplies",
    "Business Insurance",
    "Software Subscription",
    "Equipment Purchase",
  ];

  const luxuryDescriptions = [
    "Fine Dining Experience",
    "Luxury Hotel Stay",
    "Private Event Catering",
    "Art Gallery Purchase",
    "Jewelry Store Payment",
  ];

  switch (accountType) {
    case AccountType.BUSINESS:
      return faker.helpers.arrayElement([
        ...commonDescriptions,
        ...businessDescriptions,
      ]);
    case AccountType.PRESTIGE:
    case AccountType.INVESTMENT:
      return faker.helpers.arrayElement([
        ...commonDescriptions,
        ...luxuryDescriptions,
      ]);
    default:
      return faker.helpers.arrayElement(commonDescriptions);
  }
};

const getAmountRangeForDescription = (
  description: string,
  accountType: AccountType
): { min: number; max: number } => {
  const baseRanges: Record<string, { min: number; max: number }> = {
    "ATM Withdrawal": { min: 1000, max: 10000 },
    "Online Purchase": { min: 5000, max: 50000 },
    "Grocery Store Payment": { min: 50, max: 5000 },
    "Gas Station Payment": { min: 20, max: 1000 },
    "Restaurant Payment": { min: 300, max: 20000 },
    "Vendor Payment": { min: 1000, max: 100000 },
    "Office Supplies": { min: 1000, max: 10000 },
    "Business Insurance": { min: 5000, max: 50000 },
    "Software Subscription": { min: 1000, max: 10000 },
    "Equipment Purchase": { min: 500, max: 5000 },
    "Fine Dining Experience": { min: 500, max: 20000 },
    "Luxury Hotel Stay": { min: 5000, max: 50000 },
    "Private Event Catering": { min: 10000, max: 100000 },
    "Art Gallery Purchase": { min: 10000, max: 500000 },
    "Jewelry Store Payment": { min: 5000, max: 100000 },
  };

  let scale = 1;
  switch (accountType) {
    case AccountType.BUSINESS:
      scale = 5;
      break;
    case AccountType.INVESTMENT:
      scale = 10;
      break;
    case AccountType.PRESTIGE:
      scale = 20;
      break;
  }

  const commonKeys = [
    "ATM Withdrawal",
    "Online Purchase",
    "Grocery Store Payment",
    "Gas Station Payment",
    "Restaurant Payment",
  ];
  const isCommon = commonKeys.includes(description);

  // For common descriptions, apply minimal scaling to keep realistic (e.g., gas station max $200 even for prestige)
  if (isCommon) {
    scale = Math.min(scale, 2); // Slight increase for high earners
  }

  const baseRange = baseRanges[description] || { min: 100, max: 1000 };
  return {
    min: baseRange.min * scale,
    max: baseRange.max * scale,
  };
};

const addSeasonalVariation = (
  amount: number,
  date: Date,
  type: TransactionType
): number => {
  // Add seasonal variation for certain transaction types
  if (type === TransactionType.BILL_PAYMENT) {
    const month = date.getMonth();
    // Higher utility bills in summer (AC) and winter (heating)
    if (month >= 5 && month <= 8) {
      // Summer months
      return faker.number.float({
        min: amount * 1.1,
        max: amount * 1.4,
        fractionDigits: 2,
      });
    } else if (month >= 11 || month <= 2) {
      // Winter months
      return faker.number.float({
        min: amount * 1.2,
        max: amount * 1.5,
        fractionDigits: 2,
      });
    }
  }

  return amount;
};

const categorizeTransaction = (
  type: TransactionType,
  description: string
): string => {
  if (type === TransactionType.BILL_PAYMENT) return "Bills & Utilities";
  if (type === TransactionType.DEPOSIT) return "Income";
  if (type === TransactionType.WITHDRAWAL) return "Cash Withdrawal";
  if (type.toString().includes("TRANSFER")) return "Transfers";

  // Categorize by description keywords
  if (description.toLowerCase().includes("grocery")) return "Groceries";
  if (description.toLowerCase().includes("gas")) return "Transportation";
  if (description.toLowerCase().includes("restaurant")) return "Dining";
  if (description.toLowerCase().includes("hotel")) return "Travel";

  return "Other";
};

const generateRealisticNotificationMessage = (type: string): string => {
  const messages = {
    "Security Alert": [
      "Login detected from new device",
      "Password changed successfully",
      "Two-factor authentication enabled",
      "Unusual account access attempted",
    ],
    "Account Activity": [
      "Large transaction processed",
      "Direct deposit received",
      "Monthly statement available",
      "Account balance threshold reached",
    ],
    "Payment Reminder": [
      "Upcoming bill payment due",
      "Recurring payment scheduled",
      "Payment confirmation required",
      "Automatic payment failed",
    ],
    "Transaction Confirmation": [
      "Wire transfer completed",
      "Check deposit processed",
      "Card transaction authorized",
      "International transfer confirmed",
    ],
    "New Feature": [
      "Introducing our new mobile banking app",
      "New security features added to your account",
      "Explore our updated investment tools",
      "New bill pay options now available",
    ],
    "Promotional Offer": [
      "Limited time cashback offer on purchases",
      "Special interest rate for new deposits",
      "Earn bonus rewards on travel spending",
      "Exclusive discount for premium members",
    ],
    "High Balance Alert": [
      "Your account balance has exceeded your set threshold",
      "High balance notification: consider investment options",
      "Account balance alert triggered",
      "Monitor your growing balance with our tools",
    ],
    "Card Transaction Alert": [
      "Recent card transaction at merchant",
      "Card used for online purchase",
      "International card transaction detected",
      "Card transaction confirmation",
    ],
    "Account Statement Available": [
      "Your monthly account statement is ready",
      "Quarterly statement now available for download",
      "Annual summary statement prepared",
      "View your latest account activity statement",
    ],
    "Interest Payment Posted": [
      "Interest has been credited to your account",
      "Monthly interest payment applied",
      "Quarterly interest earnings posted",
      "Annual interest compounded and added",
    ],
  };

  const typeMessages = messages[type as keyof typeof messages];
  return typeMessages
    ? faker.helpers.arrayElement(typeMessages)
    : "General account update: please check your account for details.";
};

// Account type specific configurations
const getAccountConfig = (accountType: AccountType) => {
  switch (accountType) {
    case AccountType.CHECKING:
      return {
        targetBalance: 719720,
        interestRate: null,
        transactionAmountRange: { min: 1000, max: 50000 },
        cardType: "DEBIT",
        creditLimit: null,
        availableCredit: null,
        dailyLimit: getRandomAmount(10000, 50000),
      };
    case AccountType.SAVINGS:
      return {
        targetBalance: 2500000,
        interestRate: faker.number.float({
          min: 0.01,
          max: 0.05,
          fractionDigits: 3,
        }),
        transactionAmountRange: { min: 5000, max: 200000 },
        cardType: "CREDIT",
        creditLimit: 100000,
        availableCredit: 75000,
        dailyLimit: getRandomAmount(20000, 75000),
      };
    case AccountType.BUSINESS:
      return {
        targetBalance: 5000000,
        interestRate: faker.number.float({
          min: 0.005,
          max: 0.03,
          fractionDigits: 3,
        }),
        transactionAmountRange: { min: 10000, max: 500000 },
        cardType: "CREDIT",
        creditLimit: 500000,
        availableCredit: 400000,
        dailyLimit: getRandomAmount(50000, 150000),
      };
    case AccountType.INVESTMENT:
      return {
        targetBalance: 5000000, // Capped at 5M
        interestRate: faker.number.float({
          min: 0.02,
          max: 0.08,
          fractionDigits: 3,
        }),
        transactionAmountRange: { min: 50000, max: 1000000 },
        cardType: "CREDIT",
        creditLimit: 1000000,
        availableCredit: 800000,
        dailyLimit: getRandomAmount(100000, 300000),
      };
    case AccountType.PRESTIGE:
      return {
        targetBalance: 5000000, // Capped at 5M
        interestRate: faker.number.float({
          min: 0.03,
          max: 0.1,
          fractionDigits: 3,
        }),
        transactionAmountRange: { min: 100000, max: 2000000 },
        cardType: "CREDIT",
        creditLimit: 2000000,
        availableCredit: 1500000,
        dailyLimit: getRandomAmount(200000, 500000),
      };
    case AccountType.FIXED_DEPOSIT:
      return {
        targetBalance: 1000000,
        interestRate: faker.number.float({
          min: 0.04,
          max: 0.07,
          fractionDigits: 3,
        }),
        transactionAmountRange: { min: 5000, max: 100000 },
        cardType: "DEBIT",
        creditLimit: null,
        availableCredit: null,
        dailyLimit: getRandomAmount(5000, 25000),
      };
    default:
      return {
        targetBalance: 100000,
        interestRate: null,
        transactionAmountRange: { min: 1000, max: 10000 },
        cardType: "DEBIT",
        creditLimit: null,
        availableCredit: null,
        dailyLimit: getRandomAmount(5000, 15000),
      };
  }
};

// Account type specific transactions
const getSpecificTransactions = (accountType: AccountType) => {
  const baseTransactions = [
    {
      type: TransactionType.DEPOSIT,
      description: "Salary/Business income deposit",
      amount: 100000, // Adjusted for realism
    },
    {
      type: TransactionType.BILL_PAYMENT,
      description: "Utility bill payment",
      amount: 2500,
    },
  ];

  switch (accountType) {
    case AccountType.CHECKING:
      return [
        ...baseTransactions,
        {
          type: TransactionType.BILL_PAYMENT,
          description: "Grocery shopping",
          amount: 1500,
        },
        {
          type: TransactionType.TRANSFER_US_BANK,
          description: "Transfer to savings account",
          amount: 25000,
        },
      ];
    case AccountType.SAVINGS:
      return [
        ...baseTransactions,
        {
          type: TransactionType.DEPOSIT,
          description: "Investment dividend payment",
          amount: 150000,
        },
        {
          type: TransactionType.TRANSFER_US_BANK,
          description: "Investment transfer",
          amount: 500000,
        },
      ];
    case AccountType.BUSINESS:
      return [
        {
          type: TransactionType.DEPOSIT,
          description: "Business revenue deposit",
          amount: 750000,
        },
        {
          type: TransactionType.BILL_PAYMENT,
          description: "Office rent payment",
          amount: 25000,
        },
        {
          type: TransactionType.TRANSFER_US_BANK,
          description: "Vendor payment",
          amount: 100000,
        },
        {
          type: TransactionType.BILL_PAYMENT,
          description: "Business insurance premium",
          amount: 15000,
        },
      ];
    case AccountType.INVESTMENT:
      return [
        {
          type: TransactionType.DEPOSIT,
          description: "Portfolio dividend payment",
          amount: 2000000, // Adjusted
        },
        {
          type: TransactionType.TRANSFER_US_BANK,
          description: "Investment purchase - Blue chip stocks",
          amount: 1500000, // Adjusted
        },
        {
          type: TransactionType.TRANSFER_INTERNATIONAL,
          description: "International investment transfer",
          amount: 800000, // Adjusted
        },
      ];
    case AccountType.PRESTIGE:
      return [
        {
          type: TransactionType.DEPOSIT,
          description: "Private equity distribution",
          amount: 2000000, // Adjusted for cap
        },
        {
          type: TransactionType.BILL_PAYMENT,
          description: "Private jet charter via NetJets",
          amount: 75000,
        },
        {
          type: TransactionType.BILL_PAYMENT,
          description: "Purchase at Sotheby's auction house",
          amount: 250000,
        },
        {
          type: TransactionType.TRANSFER_US_BANK,
          description: "Yacht maintenance service",
          amount: 100000,
        },
      ];
    case AccountType.FIXED_DEPOSIT:
      return [
        {
          type: TransactionType.DEPOSIT,
          description: "Fixed deposit maturity",
          amount: 500000,
        },
        {
          type: TransactionType.DEPOSIT,
          description: "Interest payment",
          amount: 25000,
        },
      ];
    default:
      return baseTransactions;
  }
};

type SpecificTransaction = {
  type: TransactionType;
  description: string;
  amount: number;
  date?: Date;
};

export async function populateUserData(
  identifier: string
): Promise<{ message: string; userId?: string }> {
  const prisma = new PrismaClient({
    log: ["query", "info", "warn"],
    transactionOptions: { timeout: 30000 },
  });

  try {
    logger.info(`Starting data population for user: ${identifier}`);

    // Find user with their existing account
    const user = await withRetry(() =>
      prisma.user.findFirst({
        where: {
          OR: [{ id: identifier }, { email: identifier.toLowerCase() }],
        },
        include: {
          account: true, // Include the existing account
        },
      })
    );

    if (!user) {
      throw new Error(`User with ID or email '${identifier}' not found.`);
    }

    if (!user.account) {
      throw new Error(`User ${user.id} does not have an account.`);
    }

    logger.info(
      `Found user: ${user.email} (ID: ${user.id}) with ${user.account.type} account`
    );

    // Check if user already has populated data
    const existingTransactions = await prisma.transaction.count({
      where: { userId: user.id },
    });

    if (existingTransactions > 0) {
      logger.info(
        `User ${user.id} already has transactions, skipping population.`
      );
      return {
        message: `User ${user.id} data already populated`,
        userId: user.id,
      };
    }

    const account = user.account;
    const accountConfig = getAccountConfig(account.type);
    let specificTransactions: SpecificTransaction[] = getSpecificTransactions(
      account.type
    );

    // Add custom debit transactions
    const customDebits: SpecificTransaction[] = [
      {
        type: TransactionType.BILL_PAYMENT,
        description: "Payment to Ceylon Master Gems",
        amount: 1297889.0,
      },
      {
        type: TransactionType.BILL_PAYMENT,
        description: "Payment to Mukhlis Gemstone Gemstore",
        amount: 732379.0,
      },
      {
        type: TransactionType.BILL_PAYMENT,
        description: "Payment to Ananda Miners Private Ltd",
        amount: 2037000.0,
      },
      {
        type: TransactionType.BILL_PAYMENT,
        description: "Payment to Beruwalage Moonstone Mine",
        amount: 390800.0,
      },
      {
        type: TransactionType.BILL_PAYMENT,
        description: "Payment to The Gem World Holdings (pvt) Ltd",
        amount: 476333.0,
      },
    ];

    // Add custom credit transactions
    const customCredits: SpecificTransaction[] = [
      {
        type: TransactionType.DEPOSIT,
        description: "Deposit from Chic Jewelry Wholesalers and Importers",
        amount: 483000.0,
      },
      {
        type: TransactionType.DEPOSIT,
        description: "Deposit from A&A Jewelry Manufacturing LLC",
        amount: 76891.0,
      },
      {
        type: TransactionType.DEPOSIT,
        description: "Deposit from The Italian Jewelery company",
        amount: 108980.23,
      },
      {
        type: TransactionType.DEPOSIT,
        description: "Deposit from Goldenet Australia",
        amount: 1327000.0,
      },
      {
        type: TransactionType.DEPOSIT,
        description: "Deposit from Simon West Fine Jewellery",
        amount: 920080.0,
      },
    ];

    // Add monthly service fees (one per month, with specific dates)
    const serviceFees: SpecificTransaction[] = [];
    for (let m = 0; m < 12; m++) {
      serviceFees.push({
        type: TransactionType.BILL_PAYMENT,
        description: "Monthly account service fee",
        amount: faker.number.float({ min: 400, max: 600, fractionDigits: 2 }),
        date: getDateInMonth(m),
      });
    }

    // Add higher monthly income deposits (one per month, with specific dates)
    const monthlyIncomes: SpecificTransaction[] = [];
    for (let m = 0; m < 12; m++) {
      monthlyIncomes.push({
        type: TransactionType.DEPOSIT,
        description: "Monthly business income",
        amount: faker.number.float({
          min: 100000,
          max: 500000,
          fractionDigits: 2,
        }), // Adjusted for realism
        date: getDateInMonth(m),
      });
    }

    // Combine all specific/custom transactions
    specificTransactions = [
      ...specificTransactions,
      ...customDebits,
      ...customCredits,
      ...serviceFees,
      ...monthlyIncomes,
    ];

    const billIds: string[] = [];
    let transactions: Prisma.TransactionCreateManyInput[] = [];
    const cards: Prisma.CardCreateManyInput[] = [];
    const notifications: Prisma.NotificationCreateManyInput[] = [];

    await prisma.$transaction(async (tx) => {
      // Create bills with realistic recurring patterns
      const currentDate = now;
      const billPayments = [];

      if (
        account.type === AccountType.CHECKING ||
        account.type === AccountType.BUSINESS
      ) {
        // Full list of providers
        const allProviders = [
          {
            provider: "PG&E Electric",
            baseAmount: 800,
            variation: 300,
          },
          {
            provider: "City Water",
            baseAmount: 250,
            variation: 50,
          },
          {
            provider: "Xfinity",
            baseAmount: 450,
            variation: 100,
          },
          {
            provider: "T-Mobile",
            baseAmount: 350,
            variation: 50,
          },
          {
            provider: "State Farm",
            baseAmount: 1200,
            variation: 200,
          },
          {
            provider: "Netflix",
            baseAmount: 150,
            variation: 20,
          },
        ];

        // Pick 4 random providers and assign consistent account numbers
        const monthlyBills = faker.helpers
          .arrayElements(allProviders, 4)
          .map((bill) => ({
            ...bill,
            accountNumber: validateAccountNumber(
              faker.finance.accountNumber(8)
            ),
          }));

        // Generate one bill per provider for the past year (12 months back)
        for (const bill of monthlyBills) {
          const billMonth = subMonths(currentDate, 12);
          const dueDate = new Date(
            billMonth.getFullYear(),
            billMonth.getMonth(),
            15
          );
          const paymentDate = faker.date.between({
            from: dueDate,
            to: addDays(dueDate, 10),
          });

          // Historical bill (PAID)
          billPayments.push({
            accountId: account.id,
            userId: user.id,
            provider: bill.provider,
            accountNumber: bill.accountNumber,
            amount:
              bill.baseAmount +
              faker.number.int({
                min: -bill.variation,
                max: bill.variation,
              }),
            dueDate,
            status: faker.helpers.arrayElement([
              "PAID",
              "PAID",
              "PAID",
              "OVERDUE",
            ]),
            paymentDate: Math.random() > 0.1 ? paymentDate : null,
            confirmationNo: Math.random() > 0.1 ? faker.string.uuid() : null,
            isRecurring: true,
            recurringFreq: "MONTHLY",
            recurringEndDate: addMonths(currentDate, 12),
            createdAt: subDays(dueDate, 30),
            updatedAt: paymentDate || dueDate,
          });

          // Upcoming bill (PENDING) - exactly 12 months from the paid bill
          const upcomingDueDate = addMonths(dueDate, 12);
          billPayments.push({
            accountId: account.id,
            userId: user.id,
            provider: bill.provider,
            accountNumber: bill.accountNumber,
            amount:
              bill.baseAmount +
              faker.number.int({
                min: -bill.variation,
                max: bill.variation,
              }),
            dueDate: upcomingDueDate,
            status: "PENDING",
            paymentDate: null,
            confirmationNo: null,
            isRecurring: true,
            recurringFreq: "MONTHLY",
            recurringEndDate: addMonths(currentDate, 24),
            createdAt: subDays(upcomingDueDate, 30),
            updatedAt: upcomingDueDate,
          });
        }
      }

      // Add premium bills for high-tier accounts (quarterly/annual)
      if (
        account.type === AccountType.PRESTIGE ||
        account.type === AccountType.INVESTMENT
      ) {
        // Annual premium services
        const annualBills = [
          { provider: "Country Club Membership", amount: 25000, month: 1 },
          { provider: "Private Banking Advisory Fee", amount: 50000, month: 1 },
          { provider: "Yacht Club Membership", amount: 15000, month: 3 },
        ];

        for (const bill of annualBills) {
          const billDate = new Date(
            currentDate.getFullYear(),
            bill.month - 1,
            1
          );
          if (billDate <= currentDate) {
            billPayments.push({
              accountId: account.id,
              userId: user.id,
              provider: bill.provider,
              accountNumber: validateAccountNumber(
                faker.finance.accountNumber(8)
              ),
              amount:
                bill.amount +
                faker.number.int({
                  min: -bill.amount * 0.1,
                  max: bill.amount * 0.1,
                }),
              dueDate: billDate,
              status: "PAID",
              paymentDate: addDays(
                billDate,
                faker.number.int({ min: 1, max: 15 })
              ),
              confirmationNo: faker.string.uuid(),
              isRecurring: true,
              recurringFreq: "YEARLY",
              recurringEndDate: addYears(currentDate, 5),
              createdAt: subDays(billDate, 60),
              updatedAt: billDate,
            });
          }
        }

        // Quarterly luxury services
        const quarterlyServices = [
          "NetJets Private Aviation",
          "Sotheby's Art Advisory",
          "Private Chef Services",
        ];

        for (let quarter = 0; quarter < 4; quarter++) {
          const quarterDate = subMonths(currentDate, quarter * 3);
          if (
            quarterDate.getFullYear() === currentDate.getFullYear() ||
            quarter === 0
          ) {
            billPayments.push({
              accountId: account.id,
              userId: user.id,
              provider: faker.helpers.arrayElement(quarterlyServices),
              accountNumber: validateAccountNumber(
                faker.finance.accountNumber(8)
              ),
              amount: getRandomAmount(25000, 100000), // Adjusted
              dueDate: quarterDate,
              status: "PAID",
              paymentDate: addDays(
                quarterDate,
                faker.number.int({ min: 1, max: 20 })
              ),
              confirmationNo: faker.string.uuid(),
              isRecurring: false,
              createdAt: subDays(quarterDate, 30),
              updatedAt: quarterDate,
            });
          }
        }
      }

      if (billPayments.length > 0) {
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

      // Generate transactions with realistic time distribution
      const usedReferences = new Set<string>();

      const generateUniqueReference = (): string => {
        let ref: string;
        do {
          ref = faker.string.uuid();
        } while (usedReferences.has(ref));
        usedReferences.add(ref);
        return ref;
      };

      // Calculate transaction distribution
      const totalTransactions = config.numTransactionsPerAccount;
      const recentCount = Math.floor(
        totalTransactions * config.recentTransactionsPercent
      );
      const currentMonthCount = Math.floor(
        totalTransactions * config.currentMonthPercent
      );
      const lastQuarterCount = Math.floor(
        totalTransactions * config.lastQuarterPercent
      );
      const yearlyCount =
        totalTransactions - recentCount - currentMonthCount - lastQuarterCount;

      // Add specific transactions for different time periods
      const transactionBatches = [
        { count: recentCount, dateFunction: getRecentDate, priority: "high" },
        {
          count: currentMonthCount,
          dateFunction: getCurrentMonthDate,
          priority: "high",
        },
        {
          count: lastQuarterCount,
          dateFunction: () =>
            getDateInMonth(faker.number.int({ min: 1, max: 3 })),
          priority: "medium",
        },
        {
          count: yearlyCount,
          dateFunction: getRandomDateLastYear,
          priority: "low",
        },
      ];

      let transactionIndex = 0;
      transactions = []; // Reset to build list
      for (const batch of transactionBatches) {
        for (let i = 0; i < batch.count; i++) {
          const isSpecific = transactionIndex < specificTransactions.length;
          let txn: SpecificTransaction;
          const transactionDate = isSpecific
            ? specificTransactions[transactionIndex].date ??
              batch.dateFunction()
            : batch.dateFunction();

          if (isSpecific) {
            txn = specificTransactions[transactionIndex];
          } else {
            // Generate realistic transaction patterns based on account type
            const transactionTypes = getTransactionTypesForAccount(
              account.type
            );
            const description = generateRealisticDescription(account.type);
            const amountRange = getAmountRangeForDescription(
              description,
              account.type
            );
            txn = {
              type: faker.helpers.arrayElement(transactionTypes),
              description,
              amount: getRandomAmount(amountRange.min, amountRange.max),
            };
          }

          const amount = faker.number.float({
            min: txn.amount * 0.8,
            max: txn.amount * 1.2,
            fractionDigits: 2,
          });

          // Add seasonal variation for certain transaction types
          const seasonalAmount = addSeasonalVariation(
            amount,
            transactionDate,
            txn.type
          );

          // Determine transaction status based on recency
          let status: TransactionStatus;
          if (batch.priority === "high") {
            status = faker.helpers.arrayElement([
              TransactionStatus.COMPLETED,
              TransactionStatus.COMPLETED,
              TransactionStatus.COMPLETED,
              TransactionStatus.PENDING,
            ]);
          } else if (batch.priority === "medium") {
            status = faker.helpers.arrayElement([
              TransactionStatus.COMPLETED,
              TransactionStatus.COMPLETED,
              TransactionStatus.PROCESSING,
            ]);
          } else {
            status = TransactionStatus.COMPLETED; // All historical transactions are completed
          }

          transactions.push({
            userId: user.id,
            accountId: account.id,
            amount: seasonalAmount,
            type: txn.type,
            description: txn.description,
            reference: generateUniqueReference(),
            status,
            date: transactionDate,
            recipientAccount: txn.type.toString().includes("TRANSFER")
              ? validateAccountNumber(faker.finance.accountNumber(10))
              : null,
            recipientBank: txn.type.toString().includes("TRANSFER")
              ? faker.company.name()
              : null,
            swiftCode:
              txn.type === TransactionType.TRANSFER_INTERNATIONAL
                ? faker.finance.iban()
                : null,
            pinVerified:
              batch.priority === "high" ? true : faker.datatype.boolean(),
            category: categorizeTransaction(txn.type, txn.description),
            isFraudSuspected: faker.datatype.boolean({ probability: 0.02 }), // Lower fraud rate for realistic data
            createdAt: transactionDate,
            updatedAt: transactionDate,
            billId:
              txn.type === TransactionType.BILL_PAYMENT && billIds.length > 0
                ? faker.helpers.arrayElement(billIds)
                : null,
          });

          transactionIndex++;
        }
      }

      // Sort transactions by date ascending for realistic balance calculation
      transactions.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      // Calculate balance by simulating transactions from initial 0, skipping outflows that would make negative
      let currentBalance = 0;
      const adjustedTransactions: Prisma.TransactionCreateManyInput[] = [];
      for (const txn of transactions) {
        const isDeposit =
          txn.type === TransactionType.DEPOSIT ||
          txn.type === TransactionType.MOBILE_DEPOSIT;
        const amount = txn.amount;
        if (!isDeposit && currentBalance - amount < 0) {
          continue; // Skip outflow to avoid negative balance
        }
        adjustedTransactions.push(txn);
        currentBalance += isDeposit ? amount : -amount;
      }

      // Create transactions
      await tx.transaction.createMany({ data: adjustedTransactions });
      logger.debug(
        `Created ${adjustedTransactions.length} transactions for account ${account.accountNumber}`
      );

      // Update account with computed balance and interest rate
      await tx.account.update({
        where: { id: account.id },
        data: {
          balance: currentBalance,
          interestRate: accountConfig.interestRate,
          updatedAt: new Date(),
        },
      });

      logger.debug(
        `Updated ${account.type} account balance to ${currentBalance}`
      );

      // Create card based on account type
      const currentDate2 = now;
      const cardData = {
        userId: user.id,
        accountId: account.id,
        cardNumber: validateCardNumber(faker.finance.creditCardNumber()),
        status: "ACTIVE",
        cvv: faker.finance.creditCardCVV(),
        pinHash: faker.string.alphanumeric(64),
        dailyLimit: accountConfig.dailyLimit,
        token: faker.string.uuid(),
        createdAt: getRandomDateLastYear(),
        updatedAt: getRandomDateLastYear(),
        type: accountConfig.cardType,
        expiryDate: addYears(
          currentDate2,
          accountConfig.cardType === "CREDIT" ? 3 : 2
        ),
        creditLimit: accountConfig.creditLimit,
        availableCredit: accountConfig.availableCredit,
        rewardsPoints:
          accountConfig.cardType === "CREDIT"
            ? getRandomAmount(1000, 10000)
            : null,
        merchantCategoryLimits:
          accountConfig.cardType === "CREDIT"
            ? { retail: 50000, travel: 75000 }
            : {},
      };

      cards.push(cardData);
      await tx.card.createMany({ data: cards, skipDuplicates: true });
      logger.debug(`Created ${cards.length} cards for user`);

      // Create notifications distributed over the year
      const notificationTypes = [
        "Security Alert",
        "Account Activity",
        "Payment Reminder",
        "New Feature",
        "Promotional Offer",
        "High Balance Alert",
        "Transaction Confirmation",
        "Card Transaction Alert",
        "Account Statement Available",
        "Interest Payment Posted",
      ];

      // Generate notifications for each month with varying frequency
      for (let monthsBack = 0; monthsBack < 12; monthsBack++) {
        const notificationsThisMonth =
          monthsBack === 0
            ? faker.number.int({ min: 3, max: 8 }) // More notifications this month
            : faker.number.int({ min: 1, max: 3 }); // Fewer for older months

        for (let i = 0; i < notificationsThisMonth; i++) {
          const notificationDate = getDateInMonth(monthsBack);
          const notifType = faker.helpers.arrayElement(notificationTypes);

          notifications.push({
            userId: user.id,
            type: notifType,
            message: generateRealisticNotificationMessage(notifType),
            read:
              monthsBack === 0
                ? faker.datatype.boolean({ probability: 0.3 })
                : true, // Recent ones might be unread
            priority: faker.helpers.arrayElement(["LOW", "MEDIUM", "HIGH"]),
            createdAt: notificationDate,
          });
        }
      }

      await tx.notification.createMany({ data: notifications });
      logger.debug(`Created ${notifications.length} notifications`);
    });

    logger.info(
      `Data population completed for user ${user.email} (ID: ${user.id}) with ${account.type} account`
    );
    return {
      message: `User ${user.id} data populated successfully for ${account.type} account`,
      userId: user.id,
    };
  } catch (error: unknown) {
    throw new Error(`Data population failed: ${error}`);
  } finally {
    await prisma.$disconnect();
  }
}
