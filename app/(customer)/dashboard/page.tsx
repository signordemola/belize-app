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
  verifyActiveCustomer,
} from "@/lib/customer/dal";
import CustomerHeader from "@/components/customer/customer-header";
import MonthlySummary from "@/components/customer/monthly-sumarry";
import AccountOverview from "@/components/customer/account-overview";
import TransferSection from "@/components/customer/transfer-section";
import QuickActions from "@/components/customer/quick-actions";
import RecentTransactions from "@/components/customer/recent-transactions";
import DeactivatedScreen from "@/components/deactivated-screen";

const DashboardPage = async () => {
  const isActiveCustomer = await verifyActiveCustomer();

  if (!isActiveCustomer) {
    return <DeactivatedScreen />;
  }

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
      <AccountOverview userAccount={userAccount} imageUrl={profile?.imageUrl} />
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
