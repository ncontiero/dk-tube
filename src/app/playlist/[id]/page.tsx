import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { type PlaylistPageProps, PlaylistPageComp } from "../PlaylistPage";

const getPlaylists = async () => {
  return await prisma.playlist.findMany({
    include: {
      user: { omit: { externalId: false } },
      videos: { include: { user: true } },
    },
  });
};

export async function generateMetadata(
  { params }: PlaylistPageProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const playlistId = (await params).id;
  if (!playlistId) return notFound();

  const playlist = (await getPlaylists()).find(
    (playlist) => playlist.id === playlistId,
  );
  if (!playlist) return notFound();

  const playlistUrl = `${(await parent).metadataBase}playlist/${playlist.id}`;
  const plImage = playlist.videos[0]?.thumb || "/playlist-img.jpg";

  return {
    title: playlist.name,
    alternates: {
      canonical: playlistUrl,
    },
    openGraph: {
      title: playlist.name,
      url: playlistUrl,
      images: { url: plImage, alt: playlist.name },
    },
    twitter: {
      card: "summary_large_image",
      title: playlist.name,
      images: { url: plImage, alt: playlist.name },
    },
  };
}

export async function generateStaticParams() {
  const playlists = await getPlaylists();

  return playlists.map((playlist) => ({
    id: playlist.id,
  }));
}

export default function PlaylistPage(props: PlaylistPageProps) {
  return <PlaylistPageComp {...props} getPlaylists={getPlaylists} />;
}
