import { User, VoiceNote } from "@prisma/client";
import { auth } from "@src/lib/auth/auth";
import { prisma } from "@src/lib/prisma";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const calculateRemainingTime = (user: User, voiceNotes: VoiceNote[], newDuration: number = 0) => {
  const totalUsedTime = voiceNotes.reduce((acc, note) => acc + note.duration, 0) + newDuration;
  return Math.max(0, user.timeLimit - totalUsedTime);
};

export async function POST(req: Request) {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { voiceNotes: true },
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

  const remainingTime = calculateRemainingTime(user, user.voiceNotes, duration);
  if (remainingTime < duration) {
    return NextResponse.json({ error: "Time limit exceeded" }, { status: 403 });
  }

  try {
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
    });

    return NextResponse.json({
      transcription: transcription.text,
      duration: duration,
    });
  } catch (error) {
    console.error("Error in transcription:", error);
    return NextResponse.json({ error: "Failed to transcribe audio" }, { status: 500 });
  }
}
