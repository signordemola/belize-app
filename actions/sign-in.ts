"use server";
import * as z from "zod";
import { verifyPassword } from "@/lib/password";
import { prisma } from "@/lib/db";
import { UserRoleEnum } from "@prisma/client";
import { createUserSession } from "@/lib/session";
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

    if (!user.isActive) {
      return { error: "Your account is not active. Please contact support!" };
    }

    await createUserSession({ userId: user.id, role: user.role }, rememberMe);

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
