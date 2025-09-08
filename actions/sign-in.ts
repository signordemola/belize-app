"use server";
import * as z from "zod";
import { verifyPassword } from "@/lib/password";
import { prisma } from "@/lib/db";
import { SignInSchema } from "@/schemas";

export const signIn = async (values: z.infer<typeof SignInSchema>) => {
  const { error, success, data } = SignInSchema.safeParse(values);

  if (!success) {
    return {
      error: "Invalid fields!",
      issues: error.issues,
    };
  }

  const { accountNumber, password, rememberMe } = data;

  try {
    const account = await prisma.account.findUnique({
      where: { accountNumber },
      include: { user: true },
    });

    if (!account || !account.user) {
      return { error: "Invalid credentials!" };
    }

    const isValid = await verifyPassword(password, account.user.hashedPass);
    if (!isValid) {
      return { error: "Invalid credentials!" };
    }

    const redirectUrl = `/verify-otp?email=${encodeURIComponent(
      account.user.email
    )}${rememberMe ? `&rememberMe=${rememberMe}` : ""}`;

    return { success: true, redirect: redirectUrl };
  } catch (error) {
    console.error("Sign in error:", error);
    return { error: "Something went wrong!" };
  }
};
