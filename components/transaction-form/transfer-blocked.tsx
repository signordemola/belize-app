import React from "react";
import { Button } from "../ui/button";

const TransferBlocked = ({
  handleCloseBlockedModal,
}: {
  handleCloseBlockedModal: () => void;
}) => {
  return (
    <div className="fixed inset-0 bg-black/80 bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full mx-auto py-12 px-6 space-y-4 relative animate-fadeIn">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-red-200 rounded-full p-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-danger-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>
        <h3 className="text-xl font-semibold text-center text-gray-900">
          Transaction Blocked
        </h3>
        <p className="text-gray-600 text-center">
          For security reasons, this transaction has been blocked. Please
          contact our support team for assistance.
        </p>
        <div className="mt-4 space-y-6">
          <div className="bg-red-100 rounded-md p-4 text-sm text-gray-600">
            <p className="font-medium text-gray-900 mb-1">Contact Support</p>
            <p>📧 support@belizebank.com</p>
            <p>🕒 Monday - Friday: 8AM - 8PM EST</p>
          </div>
          <Button
            onClick={handleCloseBlockedModal}
            className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-gradient-to-r from-danger-600 to-danger-700 hover:from-danger-700 hover:to-danger-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-danger-600 transform transition-all duration-200"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TransferBlocked;
