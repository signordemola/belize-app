"use client";

import { formatAccountNumber } from "@/lib/utils";
import { FC } from "react";
import { toast } from "sonner";
import { AccountType } from "@prisma/client";
import Image from "next/image";

interface Account {
  id: string;
  balance: number;
  accountNumber: string;
  routingNumber: string;
  holder: string;
  type: AccountType;
  status: string;
}

interface AccountOverviewProps {
  userAccount: Account | null;
  imageUrl: string;
}

const AccountOverview: FC<AccountOverviewProps> = ({
  userAccount,
  imageUrl,
}) => {
  const copyText = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => toast("Copied to clipboard!"));
  };

  const account = userAccount ?? {
    id: "",
    balance: 0,
    accountNumber: "N/A",
    routingNumber: "N/A",
    holder: "Unknown",
    type: AccountType.CHECKING,
    status: "Inactive",
  };

  const getAccountDisplayName = (type: AccountType): string => {
    switch (type) {
      case AccountType.CHECKING:
        return "Checking Account";
      case AccountType.SAVINGS:
        return "Savings Account";
      case AccountType.FIXED_DEPOSIT:
        return "Fixed Deposit Account";
      case AccountType.PRESTIGE:
        return "Prestige Account";
      case AccountType.BUSINESS:
        return "Business Account";
      case AccountType.INVESTMENT:
        return "Investment Account";
      default:
        return "Unknown Account";
    }
  };

  return (
    <div className="mb-8">
      <div className="bg-white rounded-md p-8 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-md bg-primary-50 flex items-center justify-center">
              <span className="text-2xl">💳</span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {getAccountDisplayName(account.type)}
              </h2>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-md p-6">
              <p className="text-sm font-medium text-primary-600 mb-1">
                Available Balance
              </p>
              <p className="text-3xl font-semibold text-gray-900">
                $
                {account.balance.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </p>
              <div className="mt-4 flex items-center">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                  {getAccountDisplayName(account.type)}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-gradient-to-r from-primary-50 to-primary-100/50 rounded-md p-4">
                <p className="text-sm text-gray-900 mb-1">Account Number</p>
                <div className="flex items-center justify-between">
                  <p className="font-mono text-lg text-gray-900">
                    {formatAccountNumber(account.accountNumber)}
                  </p>
                  <button
                    className="p-2 cursor-pointer rounded-full hover:bg-primary-100 transition-colors duration-200"
                    title="Copy account number"
                    onClick={() => copyText(account.accountNumber)}
                    disabled={account.accountNumber === "N/A"}
                  >
                    <span
                      className={`${
                        account.accountNumber === "N/A"
                          ? "text-gray-300"
                          : "text-gray-400 hover:text-gray-600"
                      }`}
                    >
                      📋
                    </span>
                  </button>
                </div>
              </div>
              <div className="bg-gradient-to-r from-primary-50 to-primary-100/50 rounded-md p-4">
                <p className="text-sm text-gray-900 mb-1">Routing Number</p>
                <div className="flex items-center justify-between">
                  <p className="font-mono text-lg text-gray-900">
                    {account.routingNumber}
                  </p>
                  <button
                    className="p-2 cursor-pointer rounded-full hover:bg-primary-100 transition-colors duration-200"
                    title="Copy routing number"
                    onClick={() => copyText(account.routingNumber)}
                    disabled={account.routingNumber === "N/A"}
                  >
                    <span
                      className={`${
                        account.routingNumber === "N/A"
                          ? "text-gray-300"
                          : "text-gray-400 hover:text-gray-600"
                      }`}
                    >
                      📋
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-primary-50 to-primary-100/50 rounded-md p-6">
            <h3 className="text-lg font-medium text-primary-600 mb-6">
              Account Information
            </h3>

            <div className="flex flex-col md:flex-row items-start gap-4">
              <div className="flex-1">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-900">Account Holder</p>
                    <p className="text-base font-medium text-gray-900">
                      {account.holder}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-900">Account Type</p>
                    <p className="text-base font-medium text-gray-900">
                      {getAccountDisplayName(account.type)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-900">Account Status</p>
                    <div className="flex items-center mt-1">
                      <div
                        className={`w-2 h-2 rounded-full mr-2 ${
                          account.status === "ACTIVE"
                            ? "bg-green-500"
                            : "bg-gradient-to-r from-primary-50 to-primary-100/500"
                        }`}
                      ></div>
                      <p className="text-base font-medium text-gray-900">
                        {account.status}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-1 flex justify-center">
                <div className="w-48 h-48 relative">
                  <Image
                    src={imageUrl}
                    alt="Account Illustration"
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountOverview;
