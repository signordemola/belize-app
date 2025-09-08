import { prisma } from "../db";
import { UserRoleEnum } from "@prisma/client";
import { getUserSession } from "../session";

export const getAllUsers = async () => {
  try {
    const allUsers = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      where: { role: { not: UserRoleEnum.ADMIN } },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        dateOfBirth: true,
        fullAddress: true,
        state: true,
        zipCode: true,
        country: true,
        encryptedPass: true,
        iv: true,
        tag: true,
        isActive: true,
        isTransferBlocked: true,
        createdAt: true,
        account: {
          select: {
            id: true,
            type: true,
            balance: true,
            accountNumber: true,
            routingNumber: true,
            status: true,
            openedAt: true,
            closedAt: true,
            createdAt: true,
          },
        },
      },
    });

    return allUsers;
  } catch (error) {
    console.log("Failed to fetch all users:", error);
    return [];
  }
};

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
