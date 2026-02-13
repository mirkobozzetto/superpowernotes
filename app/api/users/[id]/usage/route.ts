import { auth } from "@src/lib/auth/auth";
import { logger } from "@src/lib/logger";
import { userUsageQueryBuilder } from "@src/services/routes/userUsageQueryBuilder";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const isAdmin = session.user?.role === "ADMIN";
  const isOwnProfile = session.user?.id === id;
  if (!isAdmin && !isOwnProfile) {
    logger.warn("Unauthorized usage access attempt", {
      userId: session.user.id,
      targetId: id,
    });
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const usage = await userUsageQueryBuilder.getUserUsage(id);

    logger.info("User usage fetched successfully", {
      requesterId: session.user.id,
      userId: id,
      isAdmin: session.user.role === "ADMIN",
    });

    return NextResponse.json(usage);
  } catch (error) {
    logger.error("Error fetching user usage", {
      requesterId: session.user.id,
      userId: id,
      error: error instanceof Error ? error.message : "Unknown error",
    });

    if (error instanceof Error && error.message === "User not found") {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ error: "Failed to fetch user usage" }, { status: 500 });
  }
}
