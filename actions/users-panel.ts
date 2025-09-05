"use server";

import { populateUserData } from "@/lib/admin/populate-user-data";
import { resetUserData } from "@/lib/admin/reset-user-data";
import { verifyAdmin } from "@/lib/admin/dal";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function toggleSubscription(userId: string) {
  try {
    if (!(await verifyAdmin())) {
      console.warn(`Unauthorized attempt by ${userId}`);
      return { error: "Admin privileges required" };
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { isSubscribed: true },
    });

    if (!user) {
      return { error: "User not found" };
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        isSubscribed: !user.isSubscribed,
        isActive: !user.isSubscribed,
      },
    });

    revalidatePath("/users-panel");

    return { success: true };
  } catch (error) {
    console.error(`Toggle failed:`, error);
    return {
      error: error instanceof Error ? error.message : "Operation failed",
    };
  }
}

export async function blockUserTransfer(userId: string) {
  try {
    if (!(await verifyAdmin())) {
      console.warn(`Unauthorized attempt by ${userId}`);
      return { error: "Admin privileges required" };
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { isTransferBlocked: true },
    });

    if (!user) {
      return { error: "User not found" };
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        isTransferBlocked: !user.isTransferBlocked,
      },
    });

    revalidatePath("/users-panel");

    return { success: true };
  } catch (error) {
    console.error(`Toggle failed:`, error);
    return {
      error: error instanceof Error ? error.message : "Operation failed",
    };
  }
}

interface PopulateDataOptions {
  accountTypes: string[];
}

export async function runUserScript(
  userId: string,
  scriptType: string,
  options?: PopulateDataOptions
) {
  try {
    if (!(await verifyAdmin())) {
      return { error: "Admin privileges required" };
    }

    let result;
    switch (scriptType) {
      case "populateData":
        result = await populateUserData(userId, options);
        break;
      case "resetData":
        result = await resetUserData(userId);
        break;
      case "blockTransfer":
        result = await blockUserTransfer(userId);
        break;
      default:
        return { error: "Invalid script type" };
    }

    revalidatePath("/users-panel");
    return { success: true, result };
  } catch (error) {
    console.error(`Failed to run ${scriptType} script`, error);
    return { error: `Script execution failed` };
  }
}
