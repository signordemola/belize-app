import { getFormattedDateTime } from "@/lib/utils";
import React from "react";

interface HeaderProps {
  firstName: string;
  balance: number;
  pending: number;
}

const CustomerHeader = ({ firstName, balance, pending }: HeaderProps) => {
  const { date, time } = getFormattedDateTime();

  return (
    <header
      id="header"
      className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white rounded-md mb-8 relative overflow-hidden scroll-smooth scroll-mt-30"
    >
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full bg-white/20 blur-3xl transform rotate-12"></div>
        <div className="absolute -left-20 -bottom-20 w-96 h-96 rounded-full bg-white/20 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-white/10 blur-2xl"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.1),transparent)]"></div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-6 lg:space-y-0">
          <div className="flex items-start space-x-5">
            <div className="relative">
              <div className="w-16 h-16 rounded-md bg-white/10 backdrop-blur-sm flex items-center justify-center transform transition-all duration-300 hover:scale-110 hover:rotate-12 group">
                <span className="text-3xl transform transition-transform duration-300 group-hover:scale-110">
                  👋
                </span>
                <div className="absolute inset-0 bg-white/5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-400 border-2 border-white flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <p className="text-sm text-white/70">{date}</p>
                <span className="w-1 h-1 rounded-full bg-white/40"></span>
                <p className="text-sm text-white/70">{time}</p>
              </div>
              <h1 className="text-3xl font-semibold text-white">
                Welcome, {firstName}
              </h1>
            </div>
          </div>
          <div className="w-full lg:w-auto grid grid-cols-1 sm:grid-cols-3 lg:flex lg:items-center gap-4 lg:space-x-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-md p-4 lg:min-w-[200px]">
              <p className="text-sm text-white/70 mb-1">Available Balance</p>
              <p className="text-2xl font-semibold text-white">
                ${balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </p>
              <div className="flex items-center mt-2">
                <div className="w-full bg-white/20 h-1 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full"
                    style={{ width: "75%" }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-md p-4 lg:min-w-[200px]">
              <p className="text-sm text-white/70 mb-1">
                0 Pending Transactions
              </p>
              <p className="text-2xl font-semibold text-white">
                ${pending.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </p>
              <div className="flex items-center mt-2">
                <div className="w-full bg-white/20 h-1 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-500 rounded-full"
                    style={{ width: "5%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default CustomerHeader;
