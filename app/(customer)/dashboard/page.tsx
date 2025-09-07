import { getUserSession } from "@/lib/session";
import React from "react";

// components
import CustomerNavBar from "@/components/customer/customer-navbar";
import {
  getUserAccount,
  getMonthlySummary,
  getNotifications,
  getRecentTransactions,
  getUserBeneficiaries,
  getUserProfile,
} from "@/lib/customer/dal";
import { AccountType } from "@prisma/client";
import CustomerHeader from "@/components/customer/customer-header";
import MonthlySummary from "@/components/customer/monthly-sumarry";
import AccountOverview from "@/components/customer/account-overview";
import { userAgent } from "next/server";
import TransferSection from "@/components/customer/transfer-section";
import QuickActions from "@/components/customer/quick-actions";
import RecentTransactions from "@/components/customer/recent-transactions";

const DashboardPage = async () => {
  const session = await getUserSession();
  if (!session) return null;

  const [
    profile,
    notifications,
    beneficiariesResult,
    userAccount,
    monthlySummary,
     recentTransactions,
  ] = await Promise.all([
    getUserProfile(),
    getNotifications(),
    getUserBeneficiaries(),
    getUserAccount(),
    getMonthlySummary(),
    getRecentTransactions(),
  ]);

  if (!profile) return null;

  const pending = 0.0;

  console.log("Account details:", userAccount);

  const hasPin = !!profile.transactionPin;

  const beneficiaries = beneficiariesResult?.beneficiaries || [];

  return (
    <section>
      <CustomerNavBar
        profile={profile}
        hasPin={hasPin}
        initialNotifications={notifications}
        userBeneficiaries={beneficiaries}
      />
      <CustomerHeader
        firstName={profile?.firstName}
        balance={userAccount?.balance || 0}
        pending={pending}
      />
      <AccountOverview userAccount={userAccount} />
      <MonthlySummary
        income={monthlySummary.income}
        incomeCount={monthlySummary.incomeCount}
        outgoing={monthlySummary.outgoing}
        outgoingCount={monthlySummary.outgoingCount}
      />
      <TransferSection userAccount={userAccount} />
      <QuickActions />
      <RecentTransactions recentTransactions={recentTransactions} />
    </section>
  );
};

export default DashboardPage;
