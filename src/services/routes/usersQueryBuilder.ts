import { prisma } from "@src/lib/prisma";
import { UserResponse, UserResponseSchema } from "@src/validations/routes/usersRoute";

export const usersQueryBuilder = {
  async fetchUsersWithDetails(): Promise<UserResponse[]> {
    const users = await prisma.user.findMany({
      include: {
        voiceNotes: true,
      },
    });

    const mappedUsers = users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      timeLimit: user.timeLimit,
      currentPeriodUsedTime: user.currentPeriodUsedTime,
      currentPeriodRemainingTime: user.currentPeriodRemainingTime,
      lastResetDate: user.lastResetDate,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      emailVerified: user.emailVerified,
      notesCount: user.voiceNotes.length,
    }));

    return mappedUsers.map((user) => UserResponseSchema.parse(user));
  },
};
