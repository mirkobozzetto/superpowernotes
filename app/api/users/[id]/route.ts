import { auth } from "@src/lib/auth/auth";
import { logger } from "@src/lib/logger";
import { userIdQueryBuilder } from "@src/services/routes/userIdQueryBuilder";
import { UserUpdateSchema } from "@src/validations/routes/userIdRoute";
import { NextResponse } from "next/server";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;
  const data = await request.json();

  try {
    const validatedData = UserUpdateSchema.parse(data);
    const updatedUser = await userIdQueryBuilder.updateUser(id, validatedData);

    logger.info("User updated successfully", {
      adminId: session.user.id,
      userId: id,
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    logger.error("Error updating user", {
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;

  try {
    await userIdQueryBuilder.deleteUser(id);

    logger.info("User deleted successfully", {
      adminId: session.user.id,
      deletedUserId: id,
    });

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    logger.error("Error deleting user", {
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
