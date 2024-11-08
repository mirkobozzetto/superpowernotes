import { auth } from "@src/lib/auth/auth";
import { logger } from "@src/lib/logger";
import { prisma } from "@src/lib/prisma";
import { buildNotesQuery } from "@src/services/routes/notesQueryBuilder";
import { SearchParamsSchema } from "@src/validations/routes/notesRoute";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    logger.warn("Unauthorized access attempt", { url: request.url });
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  let searchParams;
  try {
    searchParams = new URL(request.url).searchParams;
  } catch {
    logger.error("Invalid URL", { url: request.url });
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  const params = {
    tags: searchParams.get("tags"),
    startDate: searchParams.get("startDate"),
    endDate: searchParams.get("endDate"),
    keyword: searchParams.get("keyword"),
  };

  try {
    const validatedParams = await SearchParamsSchema.safeParseAsync(params);
    if (!validatedParams.success) {
      logger.warn("Invalid parameters", {
        params,
        errors: validatedParams.error.flatten(),
      });
      return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
    }

    const query = buildNotesQuery(userId, validatedParams.data);
    const notes = await prisma.voiceNote.findMany(query);

    logger.info("Search successful", {
      userId,
      params: validatedParams.data,
      resultCount: notes.length,
    });

    return NextResponse.json(notes);
  } catch (error) {
    logger.error("Search error", {
      userId,
      params,
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return NextResponse.json({ error: "Error performing search" }, { status: 500 });
  }
}
