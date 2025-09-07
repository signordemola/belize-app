"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

interface StatementsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const StatementsModal = ({ isOpen, onClose }: StatementsModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg sm:max-w-6xl overflow-y-auto max-h-[80vh]">
        <div className="bg-gray-50/50 rounded-xl p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-medium text-gray-900 mb-4">
              Statements
            </DialogTitle>
          </DialogHeader>
          <div>
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
              <p className="text-sm text-yellow-800">
                Statements are available from March 2024 onwards. For older
                statements, please contact our support team at 1-800-FINTRUST or
                email support@fintrustcu.com
              </p>
            </div>
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Account
                </label>
                <select
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-emerald-500 focus:border-emerald-500 bg-gray-50 hover:bg-white transition-colors duration-200"
                  required
                >
                  <option value="">Choose an account</option>
                  <option value="Checking">Checking (*4544)</option>
                  <option value="Savings">Savings (*4490)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Statement Period
                </label>
                <select
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-emerald-500 focus:border-emerald-500 bg-gray-50 hover:bg-white transition-colors duration-200"
                  required
                >
                  <option value="">Select period</option>
                  <option value="2025-03">March 2025</option>
                  <option value="2025-02">February 2025</option>
                  <option value="2025-01">January 2025</option>
                  <option value="2024-12">December 2024</option>
                  <option value="2024-11">November 2024</option>
                  <option value="2024-10">October 2024</option>
                  <option value="2024-09">September 2024</option>
                  <option value="2024-08">August 2024</option>
                  <option value="2024-07">July 2024</option>
                  <option value="2024-06">June 2024</option>
                  <option value="2024-05">May 2024</option>
                  <option value="2024-04">April 2024</option>
                  <option value="2024-03">March 2024</option>
                </select>
              </div>
              <button
                type="submit"
                disabled
                className="w-full py-3 px-4 rounded-xl text-white font-medium bg-gray-300 cursor-not-allowed transition-colors duration-200"
              >
                Download Statement
              </button>
              <div className="mt-6 bg-gray-50 rounded-xl p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-3">
                  Recent Statements
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg hover:bg-primary-50 transition-colors duration-200 cursor-pointer group">
                    <div className="flex items-center">
                      <span className="text-xl mr-3">📄</span>
                      <span className="text-sm text-gray-900">March 2025</span>
                    </div>
                    <button className="text-primary-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      Download →
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg hover:bg-primary-50 transition-colors duration-200 cursor-pointer group">
                    <div className="flex items-center">
                      <span className="text-xl mr-3">📄</span>
                      <span className="text-sm text-gray-900">
                        February 2025
                      </span>
                    </div>
                    <button className="text-primary-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      Download →
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg hover:bg-primary-50 transition-colors duration-200 cursor-pointer group">
                    <div className="flex items-center">
                      <span className="text-xl mr-3">📄</span>
                      <span className="text-sm text-gray-900">
                        January 2025
                      </span>
                    </div>
                    <button className="text-primary-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      Download →
                    </button>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                Note: Statements are generated as PDF files and will be sent to
                your registered email address.
              </p>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StatementsModal;
