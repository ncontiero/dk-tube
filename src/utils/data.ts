import type { PlaylistProps } from "@/app/playlist/PlaylistPage";
import { prisma } from "@/lib/prisma";

export const getWatchLater = async (
  userExternalId: string,
): Promise<PlaylistProps | null> => {
  const user = await prisma.user.findUnique({
    where: { externalId: userExternalId },
    include: { watchLater: { include: { user: true } } },
    omit: { externalId: false },
  });
  if (!user) return null;
  return {
    id: "watch-later",
    name: "Assistir mais tarde",
    isPublic: false,
    user,
    videos: user?.watchLater || [],
    createdAt: new Date(),
    userId: user.id,
  };
};
