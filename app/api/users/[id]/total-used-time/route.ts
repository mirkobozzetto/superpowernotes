import { auth } from "@src/lib/auth/auth";
import { prisma } from "@src/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;

  try {
    const voiceNotes = await prisma.voiceNote.findMany({
      where: { userId: id },
      select: { duration: true },
    });

    const totalUsedTime = voiceNotes.reduce((acc, note) => acc + note.duration, 0);

    return NextResponse.json({ totalUsedTime });
  } catch (error) {
    console.error("Error fetching total used time:", error);
    return NextResponse.json({ error: "Failed to fetch total used time" }, { status: 500 });
  }
}
