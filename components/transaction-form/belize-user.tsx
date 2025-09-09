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
import { TransferToBelizeSchema } from "@/schemas";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { transferToBelizeUser } from "@/actions/transfer";
import TransferBlocked from "./transfer-blocked";
import TransferSuccess from "./transfer-success";

interface UserAccount {
  id: string;
  balance: number;
  accountNumber: string;
  routingNumber: string;
  holder: string;
  type: string;
  status: string;
}

interface BelizeUerFormProps {
  userAccount: UserAccount | null;
}

interface SuccessState {
  amount: string;
  accountNumber: string;
}

export const BelizeUerForm = ({ userAccount }: BelizeUerFormProps) => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<SuccessState | null>(null);
  const [isBlocked, setIsBlocked] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [step, setStep] = useState<"details" | "pin">("details");

  const form = useForm<z.infer<typeof TransferToBelizeSchema>>({
    resolver: zodResolver(TransferToBelizeSchema),
    defaultValues: {
      fromAccount: "",
      recipientAccount: "",
      amount: "",
      reference: "",
      pin: "",
    },
    mode: "onChange",
  });

  const onSubmit = (values: z.infer<typeof TransferToBelizeSchema>) => {
    setError("");
    console.log("Submit to backend:", values);

    startTransition(() => {
      transferToBelizeUser(values).then((result) => {
        if (result?.error) {
          if (result?.error === "Transfers blocked") {
            setIsBlocked(true);
          } else {
            setError(result.error);
          }
        } else {
          if (result?.success) {
            setIsSuccess(true);
            setSuccess({
              amount: parseFloat(values.amount).toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              }),
              accountNumber: values.recipientAccount,
            });
          }
        }
      });
    });
  };

  const handleContinue = async () => {
    const result = await form.trigger([
      "fromAccount",
      "recipientAccount",
      "amount",
      "reference",
    ]);

    if (result) {
      setStep("pin");
    }
  };

  const handleCloseBlockedModal = () => {
    setIsBlocked(false);
    setStep("details");
    form.reset();
  };

  const handleCloseSuccessModal = () => {
    setIsSuccess(false);
    setStep("details");
    form.reset();
  };

  return (
    <div className="p-6 sm:p-8 animate-fadeIn">
      <div className="max-w-2xl mx-auto">
        {isBlocked && (
          <TransferBlocked handleCloseBlockedModal={handleCloseBlockedModal} />
        )}

        {isSuccess && (
          <TransferSuccess
            handleCloseSuccessModal={handleCloseSuccessModal}
            confirmationData={success}
          />
        )}

        {error && (
          <Alert variant="destructive" className="my-4 border-destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form
            action=""
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            {step === "details" && (
              <>
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
                            className="block w-full p-2 bg-gray-50 border border-gray-200 rounded-md 
                                    focus:ring-2 focus:ring-primary-500 focus:border-primary-500 
                                    hover:bg-white transition-colors duration-200 
                                    disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
                            disabled={isPending || !userAccount}
                          >
                            <option value="">Select account</option>
                            {userAccount && (
                              <option
                                key={userAccount.id}
                                value={userAccount.id}
                              >
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
                    name="recipientAccount"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="block text-sm font-medium text-gray-700">
                          Recipient Account Number
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="text"
                            maxLength={10}
                            placeholder="Enter recipient's account number"
                            className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 hover:bg-white transition-colors duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
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
                        <div className="relative mt-1 rounded-md shadow-sm">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                            <span className="text-gray-500 sm:text-sm">$</span>
                          </div>
                          <Input
                            {...field}
                            type="number"
                            placeholder="0.00"
                            maxLength={7}
                            className="block w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 hover:bg-white transition-colors duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
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
                          className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 hover:bg-white transition-colors duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="button"
                  onClick={handleContinue}
                  className="w-full"
                >
                  Continue
                </Button>
              </>
            )}

            {step === "pin" && (
              <>
                <div className="bg-gray-50 p-4 rounded-md space-y-4">
                  <h3 className="text-xl font-medium text-primary-700">
                    Transfer Summary
                  </h3>
                  <div className="space-y-2">
                    <p className="flex justify-between">
                      Receipient Account:{" "}
                      <span className="font-medium">
                        {form.getValues("recipientAccount")}
                      </span>
                    </p>
                    <p className="flex justify-between">
                      Amount:{" "}
                      <span className="font-medium">
                        {parseFloat(
                          form.getValues("amount") || "0"
                        ).toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                        })}
                      </span>
                    </p>
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="pin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Transaction PIN</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" maxLength={4} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex space-x-4">
                  <Button
                    type="button"
                    onClick={()=> setStep('details')}
                    className="flex-1 py-3 px-4 border border-primary-600 rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:cursor-not-allowed transition-colors duration-300"
                    disabled={isPending}
                  >
                    Back
                  </Button>

                  <Button
                    type="submit"
                    disabled={isPending}
                    className="flex-1 flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:cursor-not-allowed transition-colors duration-300"
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
              </>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
};

export default BelizeUerForm;
