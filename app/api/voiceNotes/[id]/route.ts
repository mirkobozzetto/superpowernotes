import { prisma } from "@src/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await request.json();
    console.log("PUT request received", { params, body });

    const { transcription, tags, fileName } = body;
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
  try {
    const { id } = params;
    await prisma.voiceNote.delete({
      where: { id },
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting voice note:", error);
    return NextResponse.json({ error: "Error deleting voice note" }, { status: 500 });
  }
}
