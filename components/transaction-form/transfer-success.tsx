import React from "react";
import { Button } from "../ui/button";

interface SuccessState {
  amount: string;
  accountNumber: string;
}

interface TransferSuccessProps {
  handleCloseSuccessModal: () => void;
  confirmationData: SuccessState | null;
}

const TransferSuccess = ({
  handleCloseSuccessModal,
  confirmationData,
}: TransferSuccessProps) => {
  return (
    <div className="fixed inset-0 bg-black/80 bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full mx-auto py-12 px-6 space-y-4 relative animate-fadeIn">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-green-100 rounded-full p-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
        <h3 className="text-xl font-semibold text-center text-gray-900">
          Transfer Successful
        </h3>
        <p className="text-gray-600 text-center">
          Your transfer of {confirmationData?.amount} to{" "}
          <span className="text-danger-800">
            ({confirmationData?.accountNumber})
          </span>{" "}
          has been sent successfully.
        </p>
        <div className="mt-4 space-y-3">
          <Button
            onClick={handleCloseSuccessModal}
            className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transform transition-all duration-200"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TransferSuccess;
