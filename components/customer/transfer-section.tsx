"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from ".././ui/tabs";
import USBankForm from ".././transaction-form/usbank-form";
import InternationalForm from ".././transaction-form/international-form";
import BelizeUerForm from "../transaction-form/belize-user";

import { AccountType } from "@prisma/client";

// 🔑 helper to normalize enum into readable string
const formatAccountType = (type: AccountType | string): string => {
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
      return type
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (c) => c.toUpperCase());
  }
};

interface UserAccount {
  id: string;
  balance: number;
  accountNumber: string;
  routingNumber: string;
  holder: string;
  type: string;
  status: string;
}

interface TransferSectionProps {
  userAccount: UserAccount | null;
}

const TransferSection = ({ userAccount }: TransferSectionProps) => {
  const formattedAccount = userAccount
    ? {
        ...userAccount,
        type: formatAccountType(userAccount.type),
      }
    : null;

  return (
    <div id="transfer-section" className="mb-8 scroll-smooth scroll-mt-30">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
            <svg
              className="w-5 h-5 text-primary-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Transfer Money
            </h2>
            <p className="text-sm text-gray-500">
              Send money securely to accounts and other users
            </p>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-md shadow-sm overflow-hidden">
        <div className="w-full max-w-4xl mx-auto space-y-8">
          <div className="text-center mt-6">
            <h2 className="text-2xl font-playfair font-bold text-gray-900">
              Transfer Money
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Choose a transfer type to get started
            </p>
          </div>
          <div className="bg-white rounded-md shadow-xl mb-12 overflow-hidden">
            <Tabs
              defaultValue="belize-user"
              className="w-full rounded-md shadow-card"
            >
              <TabsList className="grid grid-cols-1 sm:grid-cols-3 mb-16 w-full">
                <TabsTrigger
                  value="belize-user"
                  className="relative flex flex-col items-center justify-center p-4 sm:p-6 transition-all duration-200 bg-white hover:cursor-pointer hover:bg-primary-50 data-[state=active]:bg-primary-50 data-[state=active]:text-primary-900 data-[state=active]:border-b-primary-900"
                >
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-transparent data-[state=active]:bg-primary-600"></div>
                  <div className="p-3 rounded-xl mb-2 text-primary-600 bg-gray-50 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-600 data-[state=active]:bg-gray-100 data-[state=active]:text-gray-600">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-primary-600 hover:text-primary-900 data-[state=active]:text-primary-900">
                    To Belize User
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value="us-bank"
                  className="relative flex flex-col items-center justify-center p-4 sm:p-6 transition-all duration-200 bg-white hover:cursor-pointer hover:bg-primary-50 data-[state=active]:bg-primary-50 data-[state=active]:text-primary-900 data-[state=active]:border-b-primary-900"
                >
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-transparent data-[state=active]:bg-primary-600"></div>
                  <div className="p-3 rounded-xl mb-2 text-primary-600 bg-gray-50 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-600 data-[state=active]:bg-gray-100 data-[state=active]:text-gray-600">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-primary-600 hover:text-primary-900 data-[state=active]:text-primary-900">
                    To US Bank
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value="international"
                  className="relative flex flex-col items-center justify-center p-4 sm:p-6 transition-all duration-200 bg-white hover:cursor-pointer hover:bg-primary-50 data-[state=active]:bg-primary-50 data-[state=active]:text-primary-900 data-[state=active]:border-b-primary-900"
                >
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-transparent data-[state=active]:bg-primary-600"></div>
                  <div className="p-3 rounded-xl mb-2 text-primary-600 bg-gray-50 transition-colors duration-200 hover:bg-primary-100 data-[state=active]:bg-gray-100 data-[state=active]:text-gray-600">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-primary-600 hover:text-primary-900 data-[state=active]:text-primary-900">
                    International
                  </span>
                </TabsTrigger>
              </TabsList>
              <div className="mt-56 sm:mt-6">
                <div className="border-b border-primary-600 sm:border-none"></div>
                <TabsContent value="belize-user" className="max-w-4xl mx-auto">
                  <BelizeUerForm userAccount={formattedAccount} />
                </TabsContent>
                <TabsContent value="us-bank" className="max-w-4xl mx-auto">
                  <USBankForm userAccount={formattedAccount} />
                </TabsContent>
                <TabsContent
                  value="international"
                  className="max-w-4xl mx-auto"
                >
                  <InternationalForm userAccount={formattedAccount} />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransferSection;
