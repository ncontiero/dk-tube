import type { Prisma, User } from "@prisma/client";
import type { PlaylistProps } from "@/app/playlist/PlaylistPage";
import type { VideoProps } from "@/components/VideoCard/types";
import { prisma } from "@/lib/prisma";

interface PlaylistInput {
  id: string;
  name: string;
  user: User;
  videos?: VideoProps[];
}

const createPlaylistObj = ({
  id,
  name,
  user,
  videos = [],
}: PlaylistInput): PlaylistProps => ({
  id,
  name,
  isPublic: false,
  user,
  videos,
  createdAt: new Date(),
  userId: user.id,
});

export const watchLaterObj = (
  user: User,
  videos: VideoProps[] = [],
): PlaylistProps =>
  createPlaylistObj({
    id: "WL",
    name: "Assistir mais tarde",
    user,
    videos,
  });

export const likedVideosObj = (
  user: User,
  videos: VideoProps[] = [],
): PlaylistProps =>
  createPlaylistObj({
    id: "LL",
    name: "Vídeos curtidos",
    user,
    videos,
  });

type UserPayload<T extends Prisma.UserInclude> = Prisma.UserGetPayload<{
  include: T;
}>;

export const getUser = async <T extends Prisma.UserInclude>(
  userExternalId: string,
  include: Prisma.UserInclude | null = null,
): Promise<UserPayload<T> | null> => {
  if (!userExternalId) {
    throw new Error("User external ID is required");
  }

  try {
    return (await prisma.user.findUnique({
      where: { externalId: userExternalId },
      omit: { externalId: false },
      include,
    })) as UserPayload<T> | null;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw new Error(
      `Failed to fetch user: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
};

export const getWatchLater = async (
  userExternalId: string,
): Promise<PlaylistProps | null> => {
  const user = await getUser<{ watchLater: { include: { user: true } } }>(
    userExternalId,
    { watchLater: { include: { user: true } } },
  );
  if (!user) return null;
  return watchLaterObj(user, user.watchLater || []);
};

export const getLikedVideos = async (
  userExternalId: string,
): Promise<PlaylistProps | null> => {
  const user = await getUser<{ likedVideos: { include: { user: true } } }>(
    userExternalId,
    { likedVideos: { include: { user: true } } },
  );
  if (!user) return null;
  return likedVideosObj(user, user.likedVideos || []);
};
