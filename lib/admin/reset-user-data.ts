"use server";

import { handlePrismaError, withRetry } from "@/utils/admin-utils";
import { PrismaClient } from "@prisma/client";

export async function resetUserData(
  identifier: string
): Promise<{ message: string; userId?: string }> {
  const prisma = new PrismaClient({
    log: ["query", "info", "warn"],
    transactionOptions: { timeout: 30000 },
  });

  try {
    const user = await withRetry(() =>
      prisma.user.findFirst({
        where: {
          OR: [{ id: identifier }, { email: identifier.toLowerCase() }],
        },
        select: { id: true, email: true },
      })
    );

    if (!user) {
      throw new Error(`User with ID or email '${identifier}' not found.`);
    }

    await prisma.$transaction([
      prisma.transaction.deleteMany({ where: { userId: user.id } }),
      prisma.card.deleteMany({ where: { userId: user.id } }),
      prisma.mobileDeposit.deleteMany({ where: { userId: user.id } }),
      prisma.notification.deleteMany({ where: { userId: user.id } }),
      prisma.session.deleteMany({ where: { userId: user.id } }),
      prisma.bill.deleteMany({ where: { userId: user.id } }),
      prisma.statement.deleteMany({ where: { userId: user.id } }),
      prisma.beneficiary.deleteMany({ where: { userId: user.id } }),
      prisma.account.deleteMany({ where: { userId: user.id } }),
      prisma.auditLog.deleteMany({ where: { userId: user.id } }),
    ]);

    return {
      message: `User ${user.id} data cleared successfully.`,
      userId: user.id,
    };
  } catch (error: unknown) {
    throw handlePrismaError(error);
  } finally {
    await prisma.$disconnect();
  }
}
