"use server";
import * as z from "zod";
import { verifyPassword } from "@/lib/password";
import { prisma } from "@/lib/db";
import { UserRoleEnum } from "@prisma/client";
import { createUserSession } from "@/lib/session";
import { VerifyOTPSchema } from "@/schemas";

export const verifyOTP = async (
  values: z.infer<typeof VerifyOTPSchema>,
  email: string,
  rememberMe: boolean | string
) => {
  const { error, success, data } = VerifyOTPSchema.safeParse(values);

  if (!success) {
    return {
      error: "Invalid fields!",
      issues: error.issues,
    };
  }

  if (!email || typeof email !== "string") {
    return { error: "Email is required!" };
  }

  const shouldRemember =
    typeof rememberMe === "string"
      ? rememberMe === "true"
      : Boolean(rememberMe);

  const { otp } = data;

  try {
    const user = await prisma.user.findUnique({
      where: { email: email.toLocaleLowerCase().trim() },
      select: { id: true, role: true, otpSecret: true, isActive: true },
    });

    if (!user) {
      return { error: "Invalid credentials!" };
    }

    if (!user.otpSecret) {
      return { error: "No PIN found. Please request a new one." };
    }

    if (user.role === UserRoleEnum.CUSTOMER && !user.isActive) {
      return {
        error: "Your account is inactive. Please contact support!",
        redirect: "/sign-in",
      };
    }

    const isValid = await verifyPassword(otp, user.otpSecret);

    if (!isValid) {
      return { error: "Incorrect PIN entered!" };
    }

    await createUserSession(
      { userId: user.id, role: user.role },
      shouldRemember
    );

    let redirectPath: string;
    switch (user.role) {
      case UserRoleEnum.ADMIN:
        redirectPath = "/admin-panel";
        break;
      case UserRoleEnum.CUSTOMER:
      default:
        redirectPath = "/dashboard";
        break;
    }

    return { success: true, redirect: redirectPath };
  } catch (error) {
    console.error("Sign in error:", error);
    return { error: "Something went wrong!" };
  }
};
