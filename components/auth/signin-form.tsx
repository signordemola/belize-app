"use client";

import Link from "next/link";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Button } from "../ui/button";
import { Alert, AlertDescription } from "../ui/alert";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignInSchema } from "@/schemas";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import {
  IoPersonOutline,
  IoLockOpenOutline,
  IoEyeOffOutline,
  IoEyeOutline,
} from "react-icons/io5";
import { signIn } from "@/actions/sign-in";

export const SignInForm = () => {
  const router = useRouter();
  const [error, setError] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      accountNumber: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (values: z.infer<typeof SignInSchema>) => {
    setError("");

    startTransition(() => {
      signIn(values).then((result) => {
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

  return (
    <div className="flex-grow flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="w-full max-w-2xl rounded-sm border border-primary-600/30 bg-white p-16 shadow-md">
        <h2 className="mt-6 text-3xl font-serif font-bold text-primary-900">
          Welcome Back
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Sign in to access your account
        </p>

        {error && (
          <Alert variant="destructive" className="mt-4 border-destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="mt-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="accountNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Enter your Account Number</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <IoPersonOutline
                          className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
                          size={20}
                        />
                        <Input
                          {...field}
                          id="accountNumber"
                          type="text"
                          disabled={isPending}
                          className="pl-10 rounded-md py-6"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Enter your Password</FormLabel>
                    <FormControl>
                      <div className="relative bg-white">
                        <IoLockOpenOutline
                          className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
                          size={20}
                        />
                        <Input
                          {...field}
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          disabled={isPending}
                          className="pl-10 rounded-md py-6 bg-white autofill:!bg-white"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground cursor-pointer"
                        >
                          {showPassword ? (
                            <IoEyeOffOutline size={20} />
                          ) : (
                            <IoEyeOutline size={20} />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                <FormField
                  control={form.control}
                  name="rememberMe"
                  render={({ field }) => (
                    <FormItem className="flex items-center">
                      <FormControl>
                        <Checkbox
                          id="rememberMe"
                          className="border-foreground rounded size-4 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground transition-colors"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormLabel
                        htmlFor="rememberMe"
                        className="!mb-0 text-sm text-foreground cursor-pointer"
                      >
                        Remember me
                      </FormLabel>
                    </FormItem>
                  )}
                />

                <Link
                  href="#"
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                  Forgot your password?
                </Link>
              </div>

              <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-primary-600 py-6 rounded-md text-lg hover:bg-primary-800 focus:bg-primary-800 cursor-pointer"
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
                  "Sign In"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};
