-- CreateEnum
CREATE TYPE "public"."TransactionStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'CANCELLED', 'REVERSED', 'PROCESSING');

-- CreateEnum
CREATE TYPE "public"."TransactionType" AS ENUM ('TRANSFER_INTERNAL', 'TRANSFER_FINTRUST', 'TRANSFER_US_BANK', 'TRANSFER_INTERNATIONAL', 'BILL_PAYMENT', 'MOBILE_DEPOSIT', 'DEPOSIT', 'WITHDRAWAL');

-- CreateEnum
CREATE TYPE "public"."AccountType" AS ENUM ('CHECKING', 'SAVINGS', 'FIXED_DEPOSIT', 'PRESTIGE', 'BUSINESS', 'INVESTMENT');

-- CreateEnum
CREATE TYPE "public"."CheckDepositStatus" AS ENUM ('PENDING', 'CLEARED', 'REJECTED', 'REVERSED');

-- CreateEnum
CREATE TYPE "public"."ExternalAccountType" AS ENUM ('ACH', 'WIRE', 'SWIFT', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."UserRoleEnum" AS ENUM ('CUSTOMER', 'ADMIN');

-- CreateEnum
CREATE TYPE "public"."BeneficiaryType" AS ENUM ('BANK_ACCOUNT', 'UTILITY');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "date_of_birth" TIMESTAMP(3) NOT NULL,
    "address" TEXT NOT NULL,
    "cityState" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "username" TEXT,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "role" "public"."UserRoleEnum" NOT NULL DEFAULT 'CUSTOMER',
    "isSubscribed" BOOLEAN NOT NULL DEFAULT false,
    "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
    "transactionPin" TEXT,
    "isTransferBlocked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "public"."AccountType" NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "routingNumber" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "interestRate" DOUBLE PRECISION,
    "openedAt" TIMESTAMP(3) NOT NULL,
    "closedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Beneficiary" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "public"."BeneficiaryType" NOT NULL,
    "accountNumber" TEXT,
    "utilityId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Beneficiary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Transaction" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "type" "public"."TransactionType" NOT NULL,
    "description" TEXT NOT NULL,
    "reference" TEXT,
    "status" "public"."TransactionStatus" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "recipientAccount" TEXT,
    "recipientBank" TEXT,
    "swiftCode" TEXT,
    "pinVerified" BOOLEAN NOT NULL DEFAULT false,
    "category" TEXT,
    "isFraudSuspected" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "billId" TEXT,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Bill" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,
    "paymentDate" TIMESTAMP(3),
    "confirmationNo" TEXT,
    "isRecurring" BOOLEAN NOT NULL DEFAULT false,
    "recurringFreq" TEXT,
    "recurringEndDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Card" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "cardNumber" TEXT NOT NULL,
    "expiryDate" TIMESTAMP(3) NOT NULL,
    "cvv" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "creditLimit" DOUBLE PRECISION,
    "availableCredit" DOUBLE PRECISION,
    "rewardsPoints" DOUBLE PRECISION,
    "pinHash" TEXT,
    "dailyLimit" DOUBLE PRECISION,
    "token" TEXT,
    "merchantCategoryLimits" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Card_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MobileDeposit" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "frontImage" TEXT NOT NULL,
    "backImage" TEXT NOT NULL,
    "status" "public"."CheckDepositStatus" NOT NULL,
    "checkNumber" TEXT,
    "depositDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MobileDeposit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Statement" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "generatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Statement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Session" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "lastUsedAt" TIMESTAMP(3),
    "deviceInfo" TEXT,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "priority" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AuditLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "entityType" TEXT,
    "entityId" TEXT,
    "details" JSONB,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Account_accountNumber_key" ON "public"."Account"("accountNumber");

-- CreateIndex
CREATE INDEX "Account_accountNumber_idx" ON "public"."Account"("accountNumber");

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "public"."Account"("userId");

-- CreateIndex
CREATE INDEX "Beneficiary_userId_idx" ON "public"."Beneficiary"("userId");

-- CreateIndex
CREATE INDEX "Transaction_accountId_idx" ON "public"."Transaction"("accountId");

-- CreateIndex
CREATE INDEX "Transaction_userId_idx" ON "public"."Transaction"("userId");

-- CreateIndex
CREATE INDEX "Transaction_reference_idx" ON "public"."Transaction"("reference");

-- CreateIndex
CREATE INDEX "Transaction_date_idx" ON "public"."Transaction"("date");

-- CreateIndex
CREATE INDEX "Transaction_accountId_date_idx" ON "public"."Transaction"("accountId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "Bill_confirmationNo_key" ON "public"."Bill"("confirmationNo");

-- CreateIndex
CREATE INDEX "Bill_accountId_idx" ON "public"."Bill"("accountId");

-- CreateIndex
CREATE INDEX "Bill_userId_idx" ON "public"."Bill"("userId");

-- CreateIndex
CREATE INDEX "Bill_confirmationNo_idx" ON "public"."Bill"("confirmationNo");

-- CreateIndex
CREATE INDEX "Bill_dueDate_idx" ON "public"."Bill"("dueDate");

-- CreateIndex
CREATE UNIQUE INDEX "Card_cardNumber_key" ON "public"."Card"("cardNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Card_token_key" ON "public"."Card"("token");

-- CreateIndex
CREATE INDEX "Card_cardNumber_idx" ON "public"."Card"("cardNumber");

-- CreateIndex
CREATE INDEX "Card_accountId_idx" ON "public"."Card"("accountId");

-- CreateIndex
CREATE INDEX "Card_userId_idx" ON "public"."Card"("userId");

-- CreateIndex
CREATE INDEX "Card_token_idx" ON "public"."Card"("token");

-- CreateIndex
CREATE INDEX "MobileDeposit_accountId_idx" ON "public"."MobileDeposit"("accountId");

-- CreateIndex
CREATE INDEX "MobileDeposit_userId_idx" ON "public"."MobileDeposit"("userId");

-- CreateIndex
CREATE INDEX "MobileDeposit_depositDate_idx" ON "public"."MobileDeposit"("depositDate");

-- CreateIndex
CREATE INDEX "Statement_accountId_idx" ON "public"."Statement"("accountId");

-- CreateIndex
CREATE INDEX "Statement_userId_idx" ON "public"."Statement"("userId");

-- CreateIndex
CREATE INDEX "Statement_period_idx" ON "public"."Statement"("period");

-- CreateIndex
CREATE UNIQUE INDEX "Session_token_key" ON "public"."Session"("token");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "public"."Session"("userId");

-- CreateIndex
CREATE INDEX "Session_token_idx" ON "public"."Session"("token");

-- CreateIndex
CREATE INDEX "Notification_userId_idx" ON "public"."Notification"("userId");

-- CreateIndex
CREATE INDEX "Notification_createdAt_idx" ON "public"."Notification"("createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_userId_idx" ON "public"."AuditLog"("userId");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "public"."AuditLog"("createdAt");

-- AddForeignKey
ALTER TABLE "public"."Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Beneficiary" ADD CONSTRAINT "Beneficiary_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Transaction" ADD CONSTRAINT "Transaction_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "public"."Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Transaction" ADD CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Transaction" ADD CONSTRAINT "Transaction_billId_fkey" FOREIGN KEY ("billId") REFERENCES "public"."Bill"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Bill" ADD CONSTRAINT "Bill_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "public"."Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Bill" ADD CONSTRAINT "Bill_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Card" ADD CONSTRAINT "Card_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "public"."Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Card" ADD CONSTRAINT "Card_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MobileDeposit" ADD CONSTRAINT "MobileDeposit_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "public"."Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MobileDeposit" ADD CONSTRAINT "MobileDeposit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Statement" ADD CONSTRAINT "Statement_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "public"."Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Statement" ADD CONSTRAINT "Statement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
