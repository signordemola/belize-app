"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { transferToUSBank } from "@/actions/transfer";

interface FormData {
  fromAccount: string;
  bankName: string;
  accountNumber: string;
  accountHolderName: string;
  amount: string;
  reference: string;
}

interface ConfirmationData {
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  amount: string;
}

interface UserAccount {
  id: string;
  balance: number;
  accountNumber: string;
  routingNumber: string;
  holder: string;
  type: string;
  status: string;
}

interface USBankFormProps {
  userAccount: UserAccount | null;
}

export const USBankForm = ({ userAccount }: USBankFormProps) => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [step, setStep] = useState<"form" | "confirmation">("form");
  const [confirmationData, setConfirmationData] =
    useState<ConfirmationData | null>(null);
  const [pin, setPin] = useState("");
  const [isBlocked, setIsBlocked] = useState(false);

  const form = useForm<FormData>({
    defaultValues: {
      fromAccount: "",
      bankName: "",
      accountNumber: "",
      accountHolderName: "",
      amount: "",
      reference: "",
    },
  });

  const onSubmit = (values: FormData) => {
    setError("");
    setSuccess("");

    const amountRegex = /^\d+(\.\d{1,2})?$/;
    const referenceRegex = /^[a-zA-Z0-9\s]{0,50}$/;
    const accountNumberRegex = /^\d{8,17}$/;
    const nameRegex = /^[a-zA-Z\s]{2,100}$/;
    const bankNameRegex = /^[a-zA-Z0-9\s&-]{2,100}$/;

    if (!amountRegex.test(values.amount)) {
      setError("Amount must be a positive number with up to 2 decimal places.");
      return;
    }
    if (!referenceRegex.test(values.reference)) {
      setError("Reference must be alphanumeric and up to 50 characters.");
      return;
    }
    if (!accountNumberRegex.test(values.accountNumber)) {
      setError("Account number must be 8-17 digits.");
      return;
    }
    if (!nameRegex.test(values.accountHolderName)) {
      setError(
        "Account holder name must be 2-100 characters, letters and spaces only."
      );
      return;
    }
    if (!bankNameRegex.test(values.bankName)) {
      setError(
        "Bank name must be 2-100 characters, alphanumeric, spaces, & or -."
      );
      return;
    }
    if (!values.fromAccount) {
      setError("Please select an account.");
      return;
    }

    setConfirmationData({
      accountHolderName: values.accountHolderName,
      bankName: values.bankName,
      accountNumber: values.accountNumber,
      amount: parseFloat(values.amount).toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      }),
    });
    setStep("confirmation");
  };

  const handleConfirmTransfer = () => {
    setError("");
    setSuccess("");

    const pinRegex = /^\d{4}$/;
    if (!pinRegex.test(pin)) {
      setError("PIN must be exactly 4 digits.");
      return;
    }

    if (!confirmationData || !form.getValues()) {
      setError("Form data is missing.");
      return;
    }

    const values = form.getValues();
    startTransition(() => {
      transferToUSBank({
        fromAccountId: values.fromAccount,
        bankName: values.bankName,
        accountNumber: values.accountNumber,
        accountHolderName: values.accountHolderName,
        amount: parseFloat(values.amount),
        reference: values.reference,
        pin: pin,
      }).then((result) => {
        if (result?.error) {
          if (
            result.error === "Transfers are currently blocked for this account."
          ) {
            setIsBlocked(true);
          } else {
            setError(result.error);
          }
        } else if (result?.success) {
          setSuccess(result.success);
          setStep("form");
          setPin("");
          form.reset();
        }
      });
    });
  };

  const handleBack = () => {
    setError("");
    setSuccess("");
    setPin("");
    setStep("form");
  };

  const handleCloseBlockedModal = () => {
    setIsBlocked(false);
    setError("");
    setPin("");
    setStep("form");
    form.reset();
  };

  const handleCloseSuccessModal = () => {
    setSuccess("");
    setPin("");
    setStep("form");
    form.reset();
  };

  return (
    <div className="p-6 sm:p-8 animate-fadeIn">
      <div className="max-w-2xl mx-auto">
        {isBlocked && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full mx-auto p-6 space-y-4 relative animate-fadeIn">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-red-100 rounded-full p-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-primary-600"
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
              <div className="mt-4 space-y-3">
                <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600">
                  <p className="font-medium text-gray-900 mb-1">
                    Contact Support
                  </p>
                  <p>📧 support@fintrustcu.com</p>
                  <p>🕒 Monday - Friday: 8AM - 8PM EST</p>
                </div>
                <Button
                  onClick={handleCloseBlockedModal}
                  className="w-full py-3 px-4 border border-transparent rounded-xl shadow-sm text-white bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transform transition-all duration-200"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
        {success && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full mx-auto p-6 space-y-4 relative animate-fadeIn">
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
                {confirmationData?.accountHolderName} at{" "}
                {confirmationData?.bankName} (Account:{" "}
                {confirmationData?.accountNumber}) has been initiated
                successfully.
              </p>
              <div className="mt-4 space-y-3">
                <Button
                  onClick={handleCloseSuccessModal}
                  className="w-full py-3 px-4 border border-transparent rounded-xl shadow-sm text-white bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transform transition-all duration-200"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
        {step === "form" ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {error && (
                <Alert variant="destructive" className="border-destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="fromAccount"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="block text-sm font-medium text-gray-700">
                        From Account
                      </FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl 
                                    focus:ring-2 focus:ring-primary-500 focus:border-primary-500 
                                    hover:bg-white transition-colors duration-200 
                                    disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
                          disabled={isPending || !userAccount}
                        >
                          <option value="">Select account</option>
                          {userAccount && (
                            <option key={userAccount.id} value={userAccount.id}>
                              {userAccount.type} -{" "}
                              {userAccount.balance.toLocaleString("en-US", {
                                style: "currency",
                                currency: "USD",
                              })}
                            </option>
                          )}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bankName"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="block text-sm font-medium text-gray-700">
                        Select Bank
                      </FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 hover:bg-white transition-colors duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
                          disabled={isPending}
                        >
                          <option value="">Select bank</option>
                          <option value="Chase">Chase</option>
                          <option value="Bank of America">
                            Bank of America
                          </option>
                          <option value="Wells Fargo">Wells Fargo</option>
                          <option value="Citibank">Citibank</option>
                          <option value="US Bank">US Bank</option>
                          <option value="PNC Bank">PNC Bank</option>
                          <option value="Capital One">Capital One</option>
                          <option value="TD Bank">TD Bank</option>
                          <option value="BB&T">BB&T</option>
                          <option value="SunTrust Bank">SunTrust Bank</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="accountNumber"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="block text-sm font-medium text-gray-700">
                        Account Number
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          placeholder="Enter account number"
                          className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 hover:bg-white transition-colors duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
                          maxLength={17}
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="accountHolderName"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="block text-sm font-medium text-gray-700">
                        Account Holder Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          placeholder="Enter account holder name"
                          className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 hover:bg-white transition-colors duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="block text-sm font-medium text-gray-700">
                      Amount
                    </FormLabel>
                    <FormControl>
                      <div className="relative mt-1 rounded-xl shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                          <span className="text-gray-500 sm:text-sm">$</span>
                        </div>
                        <Input
                          {...field}
                          type="number"
                          placeholder="0.00"
                          className="block w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 hover:bg-white transition-colors duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
                          min="0.01"
                          step="0.01"
                          disabled={isPending}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="reference"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="block text-sm font-medium text-gray-700">
                      Reference
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="What's this transfer for?"
                        className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 hover:bg-white transition-colors duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {isPending ? (
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : (
                    "Continue"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleConfirmTransfer();
            }}
            className="space-y-6"
          >
            {error && (
              <Alert variant="destructive" className="border-destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="bg-gray-50 p-4 rounded-xl space-y-3">
              <h3 className="text-sm font-medium text-gray-700">
                Transfer Summary
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">To:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {confirmationData?.accountHolderName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Bank:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {confirmationData?.bankName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Account Number:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {confirmationData?.accountNumber}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Amount:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {confirmationData?.amount}
                  </span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Enter Transaction PIN
              </label>
              <Input
                type="password"
                placeholder="Enter 4-digit transaction PIN"
                className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 hover:bg-white transition-colors duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
                maxLength={4}
                pattern="\d{4}"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                disabled={isPending}
              />
            </div>
            <div className="pt-4 flex space-x-4">
              <Button
                type="button"
                onClick={handleBack}
                disabled={isPending}
                className="flex-1 py-3 px-4 border border-gray-200 rounded-xl shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Back
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="flex-1 flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {isPending ? (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  "Confirm Transfer"
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default USBankForm;
