import { prisma } from "@src/lib/prisma";
import { UserUsageResponse } from "@src/validations/routes/userUsageRoute";

export const userUsageQueryBuilder = {
  async getUserUsage(id: string): Promise<UserUsageResponse> {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        timeLimit: true,
        currentPeriodUsedTime: true,
        currentPeriodRemainingTime: true,
        lastResetDate: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  },
};
