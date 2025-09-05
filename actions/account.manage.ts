"use server";

import * as z from "zod";
import { prisma } from "@/lib/db";
import {
  AddBeneficiarySchema,
  EditBeneficiarySchema,
  UpdateUsernameSchema,
} from "@/schemas";
import { getUserSession } from "@/lib/session";

export const addBeneficiary = async (
  values: z.infer<typeof AddBeneficiarySchema>
) => {
  const validatedFields = AddBeneficiarySchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: "Invalid fields!",
    };
  }

  const { name, type, accountNumber, utilityId } = validatedFields.data;

  const session = await getUserSession();
  if (!session) {
    return { error: "Unauthorized. Please log in again." };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { id: true },
    });

    if (!user) {
      return { error: "User not found." };
    }

    await prisma.beneficiary.create({
      data: {
        userId: user.id,
        name,
        type,
        accountNumber: type === "BANK_ACCOUNT" ? accountNumber : null,
        utilityId: type === "UTILITY" ? utilityId : null,
      },
    });

    return { success: "Beneficiary added successfully!" };
  } catch (error) {
    console.error("Add beneficiary error:", error);
    return { error: "Something went wrong while adding beneficiary." };
  }
};

export const editBeneficiary = async (
  values: z.infer<typeof EditBeneficiarySchema>
) => {
  const validatedFields = EditBeneficiarySchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: "Invalid fields!",
      details: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { id, name, type, accountNumber, utilityId } = validatedFields.data;

  const session = await getUserSession();
  if (!session) {
    return { error: "Unauthorized. Please log in again." };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { id: true },
    });

    if (!user) {
      return { error: "User not found." };
    }

    const beneficiary = await prisma.beneficiary.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!beneficiary) {
      return { error: "Beneficiary not found." };
    }

    if (beneficiary.userId !== user.id) {
      return { error: "Unauthorized to edit this beneficiary." };
    }

    await prisma.beneficiary.update({
      where: { id },
      data: {
        name,
        type,
        accountNumber: type === "BANK_ACCOUNT" ? accountNumber : null,
        utilityId: type === "UTILITY" ? utilityId : null,
      },
    });

    return { success: "Beneficiary updated successfully!" };
  } catch (error) {
    console.error("Edit beneficiary error:", error);
    return { error: "Something went wrong while updating beneficiary." };
  }
};

export const deleteBeneficiary = async (id: string) => {
  if (!z.string().uuid().safeParse(id).success) {
    return { error: "Invalid beneficiary ID." };
  }

  const session = await getUserSession();
  if (!session) {
    return { error: "Unauthorized. Please log in again." };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { id: true },
    });

    if (!user) {
      return { error: "User not found." };
    }

    const beneficiary = await prisma.beneficiary.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!beneficiary) {
      return { error: "Beneficiary not found." };
    }

    if (beneficiary.userId !== user.id) {
      return { error: "Unauthorized to delete this beneficiary." };
    }

    await prisma.beneficiary.delete({
      where: { id },
    });

    return { success: "Beneficiary deleted successfully!" };
  } catch (error) {
    console.error("Delete beneficiary error:", error);
    return { error: "Something went wrong while deleting beneficiary." };
  }
};

export const updateUsername = async (
  values: z.infer<typeof UpdateUsernameSchema>
) => {
  const validatedFields = UpdateUsernameSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: "Invalid fields!",
      details: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { username } = validatedFields.data;

  const session = await getUserSession();
  if (!session) {
    return { error: "Unauthorized. Please log in again." };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { id: true },
    });

    if (!user) {
      return { error: "User not found." };
    }

    const existingUser = await prisma.user.findFirst({
      where: { username, id: { not: user.id } },
      select: { id: true },
    });

    if (existingUser) {
      return { error: "Username is already taken." };
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { username },
    });

    return { success: "Username updated successfully!" };
  } catch (error) {
    console.error("Update username error:", error);
    return { error: "Something went wrong while updating username." };
  }
};
