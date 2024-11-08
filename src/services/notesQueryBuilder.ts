import { Prisma } from "@prisma/client";

export const buildNotesQuery = (
  userId: string,
  params: {
    tags?: string[];
    startDate?: Date;
    endDate?: Date;
    keyword?: string;
  }
): Prisma.VoiceNoteFindManyArgs => {
  const whereClause: Prisma.VoiceNoteWhereInput = { userId };

  if (params.tags?.length) {
    whereClause.tags = { hasSome: params.tags };
  }

  if (params.startDate && params.endDate) {
    whereClause.createdAt = {
      gte: params.startDate,
      lte: params.endDate,
    };
  }

  if (params.keyword) {
    whereClause.transcription = {
      contains: params.keyword,
      mode: "insensitive",
    };
  }

  return {
    where: whereClause,
    orderBy: { createdAt: "desc" },
  };
};
