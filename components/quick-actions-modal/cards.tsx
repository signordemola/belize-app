"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

interface CardsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CardsModal = ({ isOpen, onClose }: CardsModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg sm:max-w-5xl overflow-y-auto max-h-[80vh]">
        <div className="bg-gray-50/50 rounded-md p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-900 mb-4">
              Card Services
            </DialogTitle>
          </DialogHeader>
          <div className="flex space-x-2 mb-6 bg-gray-50 p-1 rounded-md">
            <button className="flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 bg-white text-gray-900 shadow-sm">
              Overview
            </button>
            <button className="flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 text-gray-600 hover:text-gray-900">
              Statements
            </button>
          </div>
          <div className="space-y-8">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="w-full lg:w-[340px] flex-shrink-0">
                <div className="group relative">
                  <div className="relative transition-all duration-500 ease-out transform scale-100 rotate-0">
                    <div className="relative z-10 bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 rounded-2xl p-5 shadow-lg overflow-hidden w-full lg:w-[340px] aspect-[1.586]">
                      <div className="absolute inset-0 opacity-10">
                        <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-white/20 blur-2xl transform -rotate-12"></div>
                        <div className="absolute -left-16 -bottom-16 w-48 h-48 rounded-full bg-black/20 blur-2xl"></div>
                      </div>
                      <div className="relative h-full flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-base font-semibold text-white mb-1">
                              Debit Card
                            </h3>
                            <p className="text-white/80 text-xs">Standard</p>
                          </div>
                          <span className="px-2.5 py-1 rounded-full text-xs backdrop-blur-sm bg-green-400/20 text-green-100">
                            Active
                          </span>
                        </div>
                        <div className="my-4">
                          <p className="text-xl font-mono text-white tracking-wider mb-1">
                            **** **** **** 6874
                          </p>
                          <p className="text-xs text-white/80">
                            Expires: 12/27
                          </p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <p className="text-xs text-white/80">
                              Linked Account
                            </p>
                            <p className="text-sm font-semibold text-white">
                              Checking
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex space-x-2 transition-all duration-500 transform opacity-0 translate-y-4">
                      <button className="flex-1 bg-white hover:bg-gray-50 text-gray-900 py-2 px-3 rounded-md shadow-sm transition-all duration-200 flex items-center justify-center space-x-1 text-sm">
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          ></path>
                        </svg>
                        <span>Lock Card</span>
                      </button>
                      <button className="flex-1 bg-white hover:bg-gray-50 text-gray-900 py-2 px-3 rounded-md shadow-sm transition-all duration-200 flex items-center justify-center space-x-1 text-sm">
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                          ></path>
                        </svg>
                        <span>Report Lost</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-1 space-y-4">
                <div className="bg-gray-50 rounded-md p-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">
                    Quick Actions
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    <button className="flex items-center justify-center space-x-2 bg-white hover:bg-gray-50 py-2 px-3 rounded-lg text-sm text-gray-700 transition-colors duration-200">
                      <svg
                        className="w-4 h-4 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                        ></path>
                      </svg>
                      <span>Change PIN</span>
                    </button>
                    <button className="flex items-center justify-center space-x-2 bg-white hover:bg-gray-50 py-2 px-3 rounded-lg text-sm text-gray-700 transition-colors duration-200">
                      <svg
                        className="w-4 h-4 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                      <span>Set Limits</span>
                    </button>
                    <button className="flex items-center justify-center space-x-2 bg-white hover:bg-gray-50 py-2 px-3 rounded-lg text-sm text-gray-700 transition-colors duration-200">
                      <svg
                        className="w-4 h-4 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        ></path>
                      </svg>
                      <span>Get Details</span>
                    </button>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-md p-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">
                    Recent Transactions
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between bg-white p-3 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          Grocery Store
                        </p>
                        <p className="text-xs text-gray-500">2025-03-15</p>
                      </div>
                      <span className="text-sm font-medium ml-4 text-primary-600">
                        $84.52
                      </span>
                    </div>
                    <div className="flex items-center justify-between bg-white p-3 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          Gas Station
                        </p>
                        <p className="text-xs text-gray-500">2025-03-14</p>
                      </div>
                      <span className="text-sm font-medium ml-4 text-primary-600">
                        $45.00
                      </span>
                    </div>
                    <div className="flex items-center justify-between bg-white p-3 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          Coffee Shop
                        </p>
                        <p className="text-xs text-gray-500">2025-03-13</p>
                      </div>
                      <span className="text-sm font-medium ml-4 text-primary-600">
                        $4.75
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="w-full lg:w-[340px] flex-shrink-0">
                <div className="group relative">
                  <div className="relative transition-all duration-500 ease-out transform scale-100 rotate-0">
                    <div className="relative z-10 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 rounded-2xl p-5 shadow-lg overflow-hidden w-full lg:w-[340px] aspect-[1.586]">
                      <div className="absolute inset-0 opacity-10">
                        <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-white/20 blur-2xl transform -rotate-12"></div>
                        <div className="absolute -left-16 -bottom-16 w-48 h-48 rounded-full bg-black/20 blur-2xl"></div>
                      </div>
                      <div className="relative h-full flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-base font-semibold text-white mb-1">
                              Credit Card
                            </h3>
                            <p className="text-white/80 text-xs">Platinum</p>
                          </div>
                          <span className="px-2.5 py-1 rounded-full text-xs backdrop-blur-sm bg-green-400/20 text-green-100">
                            Active
                          </span>
                        </div>
                        <div className="my-4">
                          <p className="text-xl font-mono text-white tracking-wider mb-1">
                            **** **** **** 2478
                          </p>
                          <p className="text-xs text-white/80">
                            Expires: 03/28
                          </p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <p className="text-xs text-white/80">
                              Credit Limit
                            </p>
                            <p className="text-sm font-semibold text-white">
                              $5000.00
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-white/80">Available</p>
                            <p className="text-sm font-semibold text-white">
                              $3500.00
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex space-x-2 transition-all duration-500 transform opacity-0 translate-y-4">
                      <button className="flex-1 bg-white hover:bg-gray-50 text-gray-900 py-2 px-3 rounded-md shadow-sm transition-all duration-200 flex items-center justify-center space-x-1 text-sm">
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          ></path>
                        </svg>
                        <span>Lock Card</span>
                      </button>
                      <button className="flex-1 bg-white hover:bg-gray-50 text-gray-900 py-2 px-3 rounded-md shadow-sm transition-all duration-200 flex items-center justify-center space-x-1 text-sm">
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                          ></path>
                        </svg>
                        <span>Report Lost</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-1 space-y-4">
                <div className="bg-gray-50 rounded-md p-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">
                    Quick Actions
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    <button className="flex items-center justify-center space-x-2 bg-white hover:bg-gray-50 py-2 px-3 rounded-lg text-sm text-gray-700 transition-colors duration-200">
                      <svg
                        className="w-4 h-4 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                        ></path>
                      </svg>
                      <span>Change PIN</span>
                    </button>
                    <button className="flex items-center justify-center space-x-2 bg-white hover:bg-gray-50 py-2 px-3 rounded-lg text-sm text-gray-700 transition-colors duration-200">
                      <svg
                        className="w-4 h-4 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                      <span>Set Limits</span>
                    </button>
                    <button className="flex items-center justify-center space-x-2 bg-white hover:bg-gray-50 py-2 px-3 rounded-lg text-sm text-gray-700 transition-colors duration-200">
                      <svg
                        className="w-4 h-4 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        ></path>
                      </svg>
                      <span>Get Details</span>
                    </button>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-md p-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">
                    Recent Transactions
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between bg-white p-3 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          Restaurant
                        </p>
                        <p className="text-xs text-gray-500">2025-03-15</p>
                      </div>
                      <span className="text-sm font-medium ml-4 text-primary-600">
                        $125.00
                      </span>
                    </div>
                    <div className="flex items-center justify-between bg-white p-3 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          Online Shopping
                        </p>
                        <p className="text-xs text-gray-500">2025-03-14</p>
                      </div>
                      <span className="text-sm font-medium ml-4 text-primary-600">
                        $89.99
                      </span>
                    </div>
                    <div className="flex items-center justify-between bg-white p-3 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          Streaming Service
                        </p>
                        <p className="text-xs text-gray-500">2025-03-13</p>
                      </div>
                      <span className="text-sm font-medium ml-4 text-primary-600">
                        $14.99
                      </span>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-md p-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">
                    Credit Usage
                  </h4>
                  <div className="space-y-2">
                    <div className="w-full bg-white rounded-lg p-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">
                          Current Usage
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          $1500.00 of $5000.00
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full bg-primary-600 rounded-full transition-all duration-500"
                          style={{ width: "30%" }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center bg-white p-3 rounded-lg">
                      <span className="text-sm text-gray-600">
                        Rewards Points
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        2,500
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

export default CardsModal;
