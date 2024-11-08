import { auth } from "@src/lib/auth/auth";
import { logger } from "@src/lib/logger";
import { usersQueryBuilder } from "@src/services/routes/usersQueryBuilder";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    logger.warn("Unauthorized admin access attempt", {
      userId: session?.user?.id,
      role: session?.user?.role,
    });
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const users = await usersQueryBuilder.fetchUsersWithDetails();

    logger.info("Users fetched successfully", {
      adminId: session?.user?.id,
      userCount: users.length,
    });

    return NextResponse.json(users);
  } catch (error) {
    logger.error("Error fetching users", {
      adminId: session?.user?.id,
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
