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

const getWatchLater = unstable_cache(
  async (userExternalId: string): Promise<PlaylistProps> => {
    const user = await prisma.user.findUnique({
      where: { externalId: userExternalId },
      include: { watchLater: { include: { user: true } } },
      omit: { externalId: false },
    });
    if (!user) notFound();
    return {
      id: "watch-later",
      name: "Assistir mais tarde",
      isPublic: false,
      user,
      videos: user?.watchLater || [],
      createdAt: new Date(),
      userId: user.id,
    };
  },
  ["watch-later"],
  { revalidate: 60 },
);

export const metadata: Metadata = {
  title: "Assistir mais tarde",
};

export default async function PlaylistPage(props: PlaylistPageProps) {
  const user = await currentUser();
  if (!user) notFound();

  const watchLater = await getWatchLater(user.id);

  return <PlaylistPageComp {...props} playlist={watchLater} isPlaylistStatic />;
}
