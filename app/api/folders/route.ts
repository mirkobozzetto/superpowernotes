import { auth } from "@src/lib/auth/auth";
import { logger } from "@src/lib/logger";
import { prisma } from "@src/lib/prisma";
import { folderQueryBuilder } from "@src/services/routes/folderQueryBuilder";
import { CreateFolderSchema, FolderResponseSchema } from "@src/validations/routes/folderRoute";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    logger.warn("Unauthorized folder creation attempt");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await request.json();
    const validatedData = CreateFolderSchema.parse(data);

    const newFolder = await folderQueryBuilder.createFolder(session.user.id, validatedData);
    const response = FolderResponseSchema.parse(newFolder);

    logger.info("Folder created successfully", {
      userId: session.user.id,
      folderId: newFolder.id,
    });

    return NextResponse.json(response);
  } catch (error) {
    logger.error("Error creating folder", {
      userId: session.user.id,
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return NextResponse.json({ error: "Error creating folder" }, { status: 500 });
  }
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    logger.warn("Unauthorized folders fetch attempt");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const folders = await folderQueryBuilder.getFolders(session.user.id);

    return NextResponse.json(folders);
  } catch (error) {
    logger.error("Error fetching folders", {
      userId: session.user.id,
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return NextResponse.json({ error: "Error fetching folders" }, { status: 500 });
  }
}
