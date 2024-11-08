import { prisma } from "@src/lib/prisma";
import { UserUpdate } from "@src/validations/routes/userIdRoute";

export const userIdQueryBuilder = {
  async updateUser(id: string, data: UserUpdate) {
    return await prisma.user.update({
      where: { id },
      data,
    });
  },

  async deleteUser(id: string) {
    return await prisma.user.delete({
      where: { id },
    });
  },
};
