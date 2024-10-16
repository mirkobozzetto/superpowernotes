import OpenAI from "openai";
import { generateTags } from "../lib/noteUtils";
import { prisma } from "../lib/prisma";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const audioService = {
  async transcribeAudio(audioFile: File, duration: number) {
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
    });
    return { transcription: transcription.text, duration };
  },

  async saveVoiceNote(
    userId: string,
    transcription: string,
    duration: number,
    fileName: string,
    userTags: string[]
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

    let tags = userTags.length > 0 ? userTags : await generateTags(transcription);

    const [voiceNote, updatedUser] = await prisma.$transaction([
      prisma.voiceNote.create({
        data: {
          transcription,
          fileName,
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

  calculateRemainingTime(timeLimit: number, usedTime: number, newDuration: number = 0) {
    return Math.max(0, timeLimit - (usedTime + newDuration));
  },
};
