"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

interface BillPayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BillPayModal = ({ isOpen, onClose }: BillPayModalProps) => {
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
                    <option value="Checking">Checking - $719,725.00</option>
                    <option value="Savings">Savings - $5,704,583.00</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Common Providers
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    <button
                      type="button"
                      className="p-3 rounded-md text-sm font-medium transition-all duration-200 flex flex-col items-center justify-center bg-gray-50 text-gray-700 hover:bg-emerald-50"
                    >
                      <span className="text-xl mb-1">⚡</span>
                      <span className="text-xs text-center">PG&E Electric</span>
                    </button>
                    <button
                      type="button"
                      className="p-3 rounded-md text-sm font-medium transition-all duration-200 flex flex-col items-center justify-center bg-gray-50 text-gray-700 hover:bg-emerald-50"
                    >
                      <span className="text-xl mb-1">💧</span>
                      <span className="text-xs text-center">City Water</span>
                    </button>
                    <button
                      type="button"
                      className="p-3 rounded-md text-sm font-medium transition-all duration-200 flex flex-col items-center justify-center bg-gray-50 text-gray-700 hover:bg-emerald-50"
                    >
                      <span className="text-xl mb-1">🌐</span>
                      <span className="text-xs text-center">Xfinity</span>
                    </button>
                    <button
                      type="button"
                      className="p-3 rounded-md text-sm font-medium transition-all duration-200 flex flex-col items-center justify-center bg-gray-50 text-gray-700 hover:bg-emerald-50"
                    >
                      <span className="text-xl mb-1">📱</span>
                      <span className="text-xs text-center">T-Mobile</span>
                    </button>
                    <button
                      type="button"
                      className="p-3 rounded-md text-sm font-medium transition-all duration-200 flex flex-col items-center justify-center bg-gray-50 text-gray-700 hover:bg-emerald-50"
                    >
                      <span className="text-xl mb-1">🛡️</span>
                      <span className="text-xs text-center">State Farm</span>
                    </button>
                    <button
                      type="button"
                      className="p-3 rounded-md text-sm font-medium transition-all duration-200 flex flex-col items-center justify-center bg-gray-50 text-gray-700 hover:bg-emerald-50"
                    >
                      <span className="text-xl mb-1">🎬</span>
                      <span className="text-xs text-center">Netflix</span>
                    </button>
                  </div>
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
                    min="2025-07-20"
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
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                          <span className="text-lg">⚡</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            Pacific Gas & Electric
                          </p>
                          <div className="flex items-center text-sm space-x-2">
                            <span className="text-emerald-600">
                              Due in 3 days
                            </span>
                            <span className="text-gray-400">•</span>
                            <span className="text-gray-500">
                              Acct: ****2345
                            </span>
                          </div>
                        </div>
                      </div>
                      <span className="font-medium text-gray-900">$84.99</span>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                          <span className="text-lg">💧</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            Municipal Water Services
                          </p>
                          <div className="flex items-center text-sm space-x-2">
                            <span className="text-emerald-600">
                              Due in 5 days
                            </span>
                            <span className="text-gray-400">•</span>
                            <span className="text-gray-500">
                              Acct: ****7890
                            </span>
                          </div>
                        </div>
                      </div>
                      <span className="font-medium text-gray-900">$45.50</span>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                          <span className="text-lg">🌐</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            Comcast Internet
                          </p>
                          <div className="flex items-center text-sm space-x-2">
                            <span className="text-emerald-600">
                              Due in 7 days
                            </span>
                            <span className="text-gray-400">•</span>
                            <span className="text-gray-500">
                              Acct: ****4321
                            </span>
                          </div>
                        </div>
                      </div>
                      <span className="font-medium text-gray-900">$79.99</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-md p-6">
                <h3 className="text-sm font-medium text-gray-900 mb-4">
                  Payment History
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm p-2 hover:bg-white rounded-lg transition-colors duration-200">
                    <div className="flex flex-col">
                      <span className="text-gray-900 font-medium">
                        Pacific Gas & Electric
                      </span>
                      <span className="text-gray-500 text-xs">
                        Conf: PGE123456
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-gray-900">$84.99</span>
                      <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs">
                        Paid
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm p-2 hover:bg-white rounded-lg transition-colors duration-200">
                    <div className="flex flex-col">
                      <span className="text-gray-900 font-medium">
                        T-Mobile Wireless
                      </span>
                      <span className="text-gray-500 text-xs">
                        Conf: TMO789012
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-gray-900">$75.00</span>
                      <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs">
                        Paid
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm p-2 hover:bg-white rounded-lg transition-colors duration-200">
                    <div className="flex flex-col">
                      <span className="text-gray-900 font-medium">
                        Comcast Internet
                      </span>
                      <span className="text-gray-500 text-xs">
                        Conf: XFN345678
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-gray-900">$79.99</span>
                      <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs">
                        Paid
                      </span>
                    </div>
                  </div>
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
