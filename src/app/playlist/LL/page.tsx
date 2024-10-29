import type { Metadata } from "next";
import { currentUser } from "@clerk/nextjs/server";

import { unstable_cache } from "next/cache";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  type PlaylistPageProps,
  type PlaylistProps,
  PlaylistPageComp,
} from "../PlaylistPage";

const getLikedVideos = unstable_cache(
  async (userExternalId: string): Promise<PlaylistProps> => {
    const user = await prisma.user.findUnique({
      where: { externalId: userExternalId },
      include: { likedVideos: { include: { user: true } } },
      omit: { externalId: false },
    });
    if (!user) notFound();
    return {
      id: "liked-videos",
      name: "Vídeos curtidos",
      isPublic: false,
      user,
      videos: user?.likedVideos || [],
      createdAt: new Date(),
      userId: user.id,
    };
  },
  ["liked-videos"],
  { revalidate: 60 },
);

export const metadata: Metadata = {
  title: "Vídeos curtidos",
};

export default async function PlaylistPage(props: PlaylistPageProps) {
  const user = await currentUser();
  if (!user) notFound();

  const likedVideos = await getLikedVideos(user.id);

  return (
    <PlaylistPageComp {...props} playlist={likedVideos} isPlaylistStatic />
  );
}
