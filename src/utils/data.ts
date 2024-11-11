import type { User } from "@prisma/client";
import type { PlaylistProps } from "@/app/playlist/PlaylistPage";
import type { VideoProps } from "@/components/VideoCard/types";
import { prisma } from "@/lib/prisma";

export const watchLaterObj = (
  user: User,
  videos: VideoProps[] = [],
): PlaylistProps => ({
  id: "WL",
  name: "Assistir mais tarde",
  isPublic: false,
  user,
  videos,
  createdAt: new Date(),
  userId: user.id,
});

export const likedVideosObj = (
  user: User,
  videos: VideoProps[] = [],
): PlaylistProps => ({
  id: "LL",
  name: "Vídeos curtidos",
  isPublic: false,
  user,
  videos,
  createdAt: new Date(),
  userId: user.id,
});

export const getWatchLater = async (
  userExternalId: string,
): Promise<PlaylistProps | null> => {
  const user = await prisma.user.findUnique({
    where: { externalId: userExternalId },
    include: { watchLater: { include: { user: true } } },
    omit: { externalId: false },
  });
  if (!user) return null;
  return watchLaterObj(user, user.watchLater || []);
};

export const getLikedVideos = async (
  userExternalId: string,
): Promise<PlaylistProps | null> => {
  const user = await prisma.user.findUnique({
    where: { externalId: userExternalId },
    include: { likedVideos: { include: { user: true } } },
    omit: { externalId: false },
  });
  if (!user) return null;
  return likedVideosObj(user, user.likedVideos || []);
};
