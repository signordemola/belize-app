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

  const { userId, password, rememberMe } = data;

  try {
    const user = await prisma.user.findUnique({
      where: { userId },
    });

    if (!user) {
      return { error: "User ID does not exist!" };
    }

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return { error: "Incorrect password!" };
    }

    const redirectUrl = `/verify-otp?email=${encodeURIComponent(user.email)}${
      rememberMe ? `&rememberMe=${rememberMe}` : ""
    }`;

    return { success: true, redirect: redirectUrl };
  } catch (error) {
    console.error("Sign in error:", error);
    return { error: "Something went wrong!" };
  }
};
