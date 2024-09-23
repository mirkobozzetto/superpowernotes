import { auth } from "@src/lib/auth/auth";
import { prisma } from "@src/lib/prisma";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (user.role !== "ADMIN" && user.usedSeconds >= user.monthlySecondsLimit) {
    return NextResponse.json({ error: "Monthly limit reached" }, { status: 403 });
  }

  const formData = await req.formData();
  const audioFile = formData.get("audio") as File;

  if (!audioFile) {
    return NextResponse.json({ error: "No audio file provided" }, { status: 400 });
  }

  try {
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
    });

    const audioDuration = Number(formData.get("duration")) || 0;

    await prisma.user.update({
      where: { id: user.id },
      data: { usedSeconds: { increment: audioDuration } },
    });

    return NextResponse.json({
      transcription: transcription.text,
      duration: audioDuration,
    });
  } catch (error) {
    console.error("Error in transcription:", error);
    return NextResponse.json({ error: "Failed to transcribe audio" }, { status: 500 });
  }
}
