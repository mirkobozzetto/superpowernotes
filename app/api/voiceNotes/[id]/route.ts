import { auth } from "@src/lib/auth/auth";
import { prisma } from "@src/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = params;
    const body = await request.json();
    console.log("PUT request received", { params, body });
    const { transcription, tags, fileName } = body;

    const existingNote = await prisma.voiceNote.findUnique({
      where: { id },
    });

    if (!existingNote || existingNote.userId !== session.user.id) {
      return NextResponse.json({ error: "Note not found or access denied" }, { status: 404 });
    }

    const updatedNote = await prisma.voiceNote.update({
      where: { id },
      data: {
        transcription,
        tags,
        fileName,
        modifiedAt: new Date(),
      },
    });

    return NextResponse.json(updatedNote);
  } catch (error) {
    console.error("Error updating voice note:", error);
    return NextResponse.json({ error: "Error updating voice note" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = params;

    const existingNote = await prisma.voiceNote.findUnique({
      where: { id },
    });

    if (!existingNote || existingNote.userId !== session.user.id) {
      return NextResponse.json({ error: "Note not found or access denied" }, { status: 404 });
    }

    await prisma.voiceNote.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting voice note:", error);
    return NextResponse.json({ error: "Error deleting voice note" }, { status: 500 });
  }
}
