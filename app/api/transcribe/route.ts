import { auth } from "@src/lib/auth/auth";
import { generateTags } from "@src/lib/noteUtils";
import { prisma } from "@src/lib/prisma";
import { audioService } from "@src/services/audioService";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      timeLimit: true,
      currentPeriodUsedTime: true,
      currentPeriodRemainingTime: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const formData = await req.formData();
  const audioFile = formData.get("audio") as File;
  const duration = Number(formData.get("duration") || 0);

  if (!audioFile) {
    return NextResponse.json({ error: "No audio file provided" }, { status: 400 });
  }

  if (user.currentPeriodRemainingTime < duration) {
    return NextResponse.json({ error: "Time limit exceeded" }, { status: 403 });
  }

  try {
    const transcription = await audioService.transcribeAudio(audioFile);
    const tags = await generateTags(transcription);
    const fileName = `recording-${Date.now()}.webm`;

    const result = await audioService.saveVoiceNote(
      userId,
      transcription,
      duration,
      fileName,
      tags
    );

    return NextResponse.json({
      transcription: result.voiceNote.transcription,
      tags: result.voiceNote.tags,
      duration,
      remainingTime: result.remainingTime,
    });
  } catch (error) {
    console.error("Error in transcription:", error);
    return NextResponse.json({ error: "Failed to transcribe audio" }, { status: 500 });
  }
}
