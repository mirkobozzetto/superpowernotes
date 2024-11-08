import { prisma } from "@src/lib/prisma";

export const transcribeQueryBuilder = {
  async getUserTimeInfo(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        timeLimit: true,
        currentPeriodUsedTime: true,
        currentPeriodRemainingTime: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  },
};
