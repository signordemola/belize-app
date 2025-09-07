"use client";

import { FC } from "react";

interface Transaction {
  id: string;
  description: string;
  date: string;
  amount: string;
  icon: string;
}

interface RecentTransactionsProps {
  recentTransactions: Transaction[] | null;
}

const RecentTransactions: FC<RecentTransactionsProps> = ({
  recentTransactions,
}) => {
  return (
    <div className="max-w-full">
      <div className="bg-white rounded-2xl shadow-sm">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Transactions
            </h2>
          </div>
        </div>
        <div>
          {recentTransactions === null || recentTransactions.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No transactions found
            </div>
          ) : (
            recentTransactions.map((txn) => (
              <div
                key={txn.id}
                className="p-4 hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                      <span className="text-lg">{txn.icon}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {txn.description}
                      </p>
                      <p className="text-sm text-gray-500">{txn.date}</p>
                    </div>
                  </div>
                  <p
                    className={`font-medium ${
                      txn.amount.startsWith("+")
                        ? "text-green-600"
                        : "text-primary-600"
                    }`}
                  >
                    {txn.amount}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default RecentTransactions;
