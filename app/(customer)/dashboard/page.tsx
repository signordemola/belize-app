import { getUserSession } from "@/lib/session";
import React from "react";

// components
import CustomerNavBar from "@/components/customer/customer-navbar";
import {
  getAllAccountDetails,
  getAllAccounts,
  getMonthlySummary,
  getNotifications,
  getRecentTransactions,
  getUserBeneficiaries,
  getUserProfile,
} from "@/lib/customer/dal";
import { AccountType } from "@prisma/client";

const DashboardPage = async () => {
  const session = await getUserSession();
  if (!session) return null;

  const [
    profile,
    // recentTransactions,
    // allAccountDetails,
    // allAccounts,
    // notifications,
    // beneficiariesResult,
    // monthlySummary,
  ] = await Promise.all([
    getUserProfile(),
    // getRecentTransactions(),
    // getAllAccountDetails(),
    // getAllAccounts(),
    // getNotifications(),
    // getUserBeneficiaries(),
    // getMonthlySummary(),
  ]);

  if (!profile) return null;

  console.log("Profile:", profile);

  const hasPin = !!profile.transactionPin;

  // const beneficiaries = beneficiariesResult?.beneficiaries || [];

  // const checkingAccount = allAccountDetails?.find(
  //   (account) => account.type === AccountType.CHECKING
  // );

  // const checkingBalance = checkingAccount ? checkingAccount.balance : 0;

  return (
    <section>
      {/* <CustomerNavBar
        profile={profile}
        initialNotifications={notifications}
        userBeneficiaries={beneficiaries}
        
      /> */}
      <h1>Customer Dashboard Page</h1>
      <CustomerNavBar
        profile={profile}
        hasPin={hasPin}
        initialNotifications={[]}
        userBeneficiaries={[]}
      />
    </section>
  );
};

export default DashboardPage;
