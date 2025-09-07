"use server";

import * as z from "zod";
import { verifyPassword, hashPassword } from "@/lib/password";
import { prisma } from "@/lib/db";
import { ChangePinSchema, SetPinSchema } from "@/schemas";
import { getUserSession } from "@/lib/session";

export const setPin = async (values: z.infer<typeof SetPinSchema>) => {
  const validatedFields = SetPinSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: "Invalid fields!",
    };
  }

  const { newPin } = validatedFields.data;

  const session = await getUserSession();
  if (!session) return null;

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { id: true, transactionPin: true },
    });

    if (!user) {
      return { error: "User not found." };
    }

    if (user.transactionPin) {
      return {
        error:
          "A PIN is already set for this account. Please use 'Change PIN' if you wish to modify it.",
      };
    }

    const hashedNewPin = await hashPassword(newPin);

    await prisma.user.update({
      where: { id: user.id },
      data: { transactionPin: hashedNewPin },
    });

    return { success: "PIN set successfully!" };
  } catch (error) {
    console.error("Set PIN error:", error);
    return { error: "Something went wrong while setting PIN." };
  }
};

export const changePin = async (values: z.infer<typeof ChangePinSchema>) => {
  const validatedFields = ChangePinSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: "Invalid fields!",
    };
  }

  const { currentPin, newPin } = validatedFields.data;

  const session = await getUserSession();
  if (!session) return null;

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { id: true, transactionPin: true },
    });

    if (!user) {
      return { error: "User not found." };
    }

    if (!user.transactionPin) {
      return {
        error:
          "No PIN is currently set for this account. Please set a PIN first.",
      };
    }

    const isPinValid = await verifyPassword(currentPin, user.transactionPin);
    if (!isPinValid) {
      return { error: "Incorrect current PIN." };
    }

    const hashedNewPin = await hashPassword(newPin);

    await prisma.user.update({
      where: { id: user.id },
      data: { transactionPin: hashedNewPin },
    });

    return { success: "PIN updated successfully!" };
  } catch (error) {
    console.error("Change PIN error:", error);
    return { error: "Something went wrong while updating PIN." };
  }
};
