"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { formatDistanceToNow } from "date-fns";
import { getUserAccount, getUserBills } from "@/lib/customer/dal";
import { AccountType } from "@prisma/client";

interface Account {
  id: string;
  type: AccountType;
  balance: number;
}

interface Bill {
  id: string;
  provider: string;
  accountNumber: string;
  amount: number;
  dueDate: Date;
  status: string;
  paymentDate: Date | null;
  confirmationNo: string | null;
}

interface BillPayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BillPayModal = ({ isOpen, onClose }: BillPayModalProps) => {
  const [account, setAccount] = useState<Account | null>(null);
  const [upcomingBills, setUpcomingBills] = useState<Bill[]>([]);
  const [paymentHistory, setPaymentHistory] = useState<Bill[]>([]);
  const [selectedProvider, setSelectedProvider] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const providerIcons: { [key: string]: string } = {
    "Pacific Gas & Electric": "⚡",
    "Municipal Water Services": "💧",
    "Comcast Internet": "🌐",
    Xfinity: "🌐",
    "T-Mobile": "📱",
    "State Farm": "🛡️",
    Netflix: "🎬",
    "PG&E Electric": "⚡",
    "City Water": "💧",
  };

  const commonProviders = [
    { icon: "⚡", name: "PG&E Electric" },
    { icon: "💧", name: "City Water" },
    { icon: "🌐", name: "Xfinity" },
    { icon: "📱", name: "T-Mobile" },
    { icon: "🛡️", name: "State Farm" },
    { icon: "🎬", name: "Netflix" },
  ];

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

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [accountData, billsData] = await Promise.all([
        getUserAccount(),
        getUserBills(),
      ]);
      setAccount(accountData);
      console.log(accountData);
      const upcoming = billsData.filter(
        (bill: Bill) =>
          bill.status === "PENDING" && new Date(bill.dueDate) > new Date()
      );
      const history = billsData.filter((bill: Bill) => bill.status === "PAID");
      console.log(history);
      setUpcomingBills(upcoming);
      setPaymentHistory(history);
    } catch (err) {
      console.error("Failed to fetch data", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    fetchData();
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg sm:max-w-6xl overflow-y-auto max-h-[80vh]">
        <div className="bg-gray-50/10 rounded-md p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-900 mb-4">
              Bill Pay
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    From Account
                  </label>
                  <select className="w-full p-2 border border-gray-300 rounded focus:ring-primary-500 focus:border-primary-500">
                    <option value="">Select account</option>
                    {isLoading ? (
                      <option disabled>Loading...</option>
                    ) : account ? (
                      <option value={account.id}>
                        {getAccountDisplayName(account.type)} - $
                        {account.balance.toLocaleString()}
                      </option>
                    ) : (
                      <option disabled>No account found</option>
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Common Providers
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {commonProviders.map((provider) => (
                      <button
                        key={provider.name}
                        type="button"
                        onClick={() => setSelectedProvider(provider.name)}
                        className="p-3 rounded-md text-sm font-medium transition-all duration-200 flex flex-col items-center justify-center bg-gray-50 text-gray-700 hover:bg-emerald-50"
                      >
                        <span className="text-xl mb-1">{provider.icon}</span>
                        <span className="text-xs text-center">
                          {provider.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Provider
                  </label>
                  <input
                    type="text"
                    value={selectedProvider}
                    onChange={(e) => setSelectedProvider(e.target.value)}
                    placeholder="Select from common or enter custom"
                    className="w-full p-2 border border-gray-300 rounded focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Account Number
                  </label>
                  <input
                    type="text"
                    placeholder="Enter account number"
                    className="w-full p-2 border border-gray-300 rounded focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount
                  </label>
                  <input
                    type="number"
                    placeholder="Enter amount"
                    className="w-full p-2 border border-gray-300 rounded focus:ring-primary-500 focus:border-primary-500"
                    min="0.01"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Date
                  </label>
                  <input
                    type="date"
                    className="w-full p-2 border border-gray-300 rounded focus:ring-primary-500 focus:border-primary-500"
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Memo (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Add a memo"
                    className="w-full p-2 border border-gray-300 rounded focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-primary-700 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Schedule Payment
                </button>
              </form>
            </div>
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-md p-6">
                <h3 className="text-sm font-medium text-gray-900 mb-4">
                  Upcoming Bills
                </h3>
                <div className="space-y-3">
                  {isLoading ? (
                    <p className="text-gray-500 text-sm text-center">
                      Loading...
                    </p>
                  ) : upcomingBills.length > 0 ? (
                    upcomingBills.map((bill) => (
                      <div
                        key={bill.id}
                        className="bg-white p-4 rounded-lg shadow-sm"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                              <span className="text-lg">
                                {providerIcons[bill.provider] || "📄"}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {bill.provider}
                              </p>
                              <div className="flex items-center text-sm space-x-2">
                                <span className="text-emerald-600">
                                  Due in{" "}
                                  {formatDistanceToNow(new Date(bill.dueDate))}
                                </span>
                                <span className="text-gray-400">•</span>
                                <span className="text-gray-500">
                                  Acct: ****{bill.accountNumber.slice(-4)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <span className="font-medium text-gray-900">
                            ${bill.amount.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm text-center">
                      No upcoming bills.
                    </p>
                  )}
                </div>
              </div>
              <div className="bg-gray-50 rounded-md p-6">
                <h3 className="text-sm font-medium text-gray-900 mb-4">
                  Payment History
                </h3>
                <div className="space-y-3">
                  {isLoading ? (
                    <p className="text-gray-500 text-sm text-center">
                      Loading...
                    </p>
                  ) : paymentHistory.length > 0 ? (
                    paymentHistory.map((bill) => (
                      <div
                        key={bill.id}
                        className="flex items-center justify-between text-sm p-2 hover:bg-white rounded-lg transition-colors duration-200"
                      >
                        <div className="flex flex-col">
                          <span className="text-gray-900 font-medium">
                            {bill.provider}
                          </span>
                          <span className="text-gray-500 text-xs">
                            Conf: {bill.confirmationNo || "N/A"}
                          </span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="text-gray-900">
                            ${bill.amount.toFixed(2)}
                          </span>
                          <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs">
                            Paid
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm text-center">
                      No payment history.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BillPayModal;
