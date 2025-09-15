"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { Alert, AlertDescription } from "../ui/alert";
import { VerifyPinSchema } from "@/schemas";
import { resendPin } from "@/actions/resend-pin";
import { verifyPin } from "@/actions/verify-pin";

const VerifyPinForm = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const rememberMe = searchParams.get("rememberMe") === "true";

  const router = useRouter();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [isResendPending, startResendTransition] = useTransition();

  const form = useForm<z.infer<typeof VerifyPinSchema>>({
    resolver: zodResolver(VerifyPinSchema),
    defaultValues: {
      pin: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof VerifyPinSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      verifyPin(values, email, rememberMe).then((result) => {
        if (result?.error) {
          setError(result.error);
        } else {
          if (result?.redirect) {
            router.push(result.redirect);
          }
        }
      });
    });
  };

  const handleResendPin = () => {
    setError("");
    setSuccess("");

    startResendTransition(() => {
      resendPin(email).then((result) => {
        if (result?.error) {
          setError(result.error);
        } else if (result?.success) {
          setSuccess(result.success);
        }
      });
    });
  };

  return (
    <div className="flex-grow flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="w-full max-w-xl rounded-sm border bg-white p-16 shadow-md">
        <h2 className="mt-6 text-3xl font-serif font-bold text-primary-900">
          Verify Your Account
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Please enter your PIN
        </p>

        {(error || success) && (
          <Alert
            variant={error ? "destructive" : "default"}
            className={`mt-4 ${
              error ? "border-destructive" : "border-green-600"
            }`}
          >
            <AlertDescription>{error || success}</AlertDescription>
          </Alert>
        )}

        <div className="mt-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="pin"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <InputOTP
                        maxLength={6}
                        {...field}
                        disabled={isPending}
                        className="w-full"
                      >
                        <InputOTPGroup className="w-1/2">
                          <InputOTPSlot
                            index={0}
                            className="w-1/3 py-5 border-gray-400"
                          />
                          <InputOTPSlot
                            index={1}
                            className="w-1/3 py-5 border-gray-400"
                          />
                          <InputOTPSlot
                            index={2}
                            className="w-1/3 py-5 border-gray-400"
                          />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup className="w-1/2">
                          <InputOTPSlot
                            index={3}
                            className="w-1/3 py-5 border-gray-400"
                          />
                          <InputOTPSlot
                            index={4}
                            className="w-1/3 py-5 border-gray-400"
                          />
                          <InputOTPSlot
                            index={5}
                            className="w-1/3 py-5 border-gray-400"
                          />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={isPending || isResendPending}
                className="w-full bg-secondary-600 py-5 rounded-md text-lg hover:bg-secondary-800 focus:bg-secondary-800 cursor-pointer"
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
                  "Verify Account"
                )}
              </Button>
              <Button
                variant="outline"
                type="button"
                onClick={handleResendPin}
                disabled={isPending || isResendPending}
                className="flex items-center gap-2 mt-4 border-gray-900 ml-auto cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                {isResendPending ? (
                  <svg
                    className="animate-spin h-5 w-5 text-gray-900"
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
                  "Resend PIN"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default VerifyPinForm;
