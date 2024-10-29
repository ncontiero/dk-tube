import type { Metadata } from "next";
import { currentUser } from "@clerk/nextjs/server";

import { unstable_cache } from "next/cache";
import { notFound } from "next/navigation";
import { getWatchLaterBase } from "@/utils/data";
import {
  type PlaylistPageProps,
  type PlaylistProps,
  PlaylistPageComp,
} from "../PlaylistPage";

const getWatchLater = unstable_cache(
  async (userExternalId: string): Promise<PlaylistProps> => {
    const watchLater = await getWatchLaterBase(userExternalId);
    if (!watchLater) notFound();
    return watchLater;
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
