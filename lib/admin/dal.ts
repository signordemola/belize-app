"use server";

import { UserRoleEnum } from "@prisma/client";
import { getUserSession } from "../session";
import { prisma } from "../db";
import { cache } from "react";

export const getAllUsers = cache(async () => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      where: { role: { not: UserRoleEnum.ADMIN } },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        emailVerified: true,
        isActive: true,
        isAdmin: true,
        role: true,
        isSubscribed: true,
        createdAt: true,
      },
    });

    return users; // Removed incorrect users[] syntax
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return [];
  }
});

export const verifyAdmin = async () => {
  try {
    const session = await getUserSession();
    if (!session?.userId) return false;

    if (session.role !== UserRoleEnum.ADMIN) return false;

    const adminUser = await prisma.user.findUnique({
      where: { id: session.userId, isAdmin: true, role: UserRoleEnum.ADMIN },
      select: {
        id: true,
      },
    });

    return !!adminUser;
  } catch (error) {
    console.error("Admin verification failed:", error);
    return false;
  }
};
