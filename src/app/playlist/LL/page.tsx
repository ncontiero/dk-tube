import type { Metadata } from "next";
import { currentUser } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { getLikedVideos } from "@/utils/data";
import { type PlaylistPageProps, PlaylistPageComp } from "../PlaylistPage";

export const metadata: Metadata = {
  title: "Vídeos curtidos",
};

export default async function LikedVideosPage(props: PlaylistPageProps) {
  const user = await currentUser();
  if (!user) notFound();

  const likedVideos = await getLikedVideos(user.id);
  if (!likedVideos) notFound();

  return (
    <PlaylistPageComp {...props} playlist={likedVideos} isPlaylistStatic />
  );
}
