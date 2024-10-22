import OpenAI from "openai";
import { prisma } from "../lib/prisma";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const audioService = {
  async transcribeAudio(audioFile: File) {
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
    });
    return transcription.text;
  },

  async saveVoiceNote(
    userId: string,
    transcription: string,
    duration: number,
    title: string,
    tags: string[]
  ) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        timeLimit: true,
        currentPeriodUsedTime: true,
        currentPeriodRemainingTime: true,
      },
    });

    if (!user) throw new Error("User not found");
    if (user.currentPeriodRemainingTime < duration) throw new Error("Time limit exceeded");

    const [voiceNote, updatedUser] = await prisma.$transaction([
      prisma.voiceNote.create({
        data: {
          transcription,
          fileName: title,
          tags,
          duration,
          userId,
        },
      }),
      prisma.user.update({
        where: { id: userId },
        data: {
          currentPeriodUsedTime: { increment: duration },
          currentPeriodRemainingTime: { decrement: duration },
        },
      }),
    ]);

    return { voiceNote, remainingTime: updatedUser.currentPeriodRemainingTime };
  },
};
