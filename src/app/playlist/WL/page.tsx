import type { Metadata } from "next";
import { currentUser } from "@clerk/nextjs/server";

import { notFound } from "next/navigation";
import { getWatchLater } from "@/utils/data";
import { type PlaylistPageProps, PlaylistPageComp } from "../PlaylistPage";

export const metadata: Metadata = {
  title: "Assistir mais tarde",
};

export default async function WatchLaterPage(props: PlaylistPageProps) {
  const user = await currentUser();
  if (!user) notFound();

  const watchLater = await getWatchLater(user.id);
  if (!watchLater) notFound();

  return <PlaylistPageComp {...props} playlist={watchLater} isPlaylistStatic />;
}
