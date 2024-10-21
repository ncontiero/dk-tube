import type { Metadata, ResolvingMetadata } from "next";
import { unstable_cache } from "next/cache";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

type PlaylistPageProps = {
  readonly params: { id: string };
};

const getPlaylists = unstable_cache(
  async () => {
    return await prisma.playlist.findMany({
      include: { user: true, videos: true },
    });
  },
  ["playlists"],
  { revalidate: 60 },
);

export async function generateMetadata(
  { params }: PlaylistPageProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const playlistId = params.id;
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

export default async function PlaylistPage({ params }: PlaylistPageProps) {
  const playlist = (await getPlaylists()).find(
    (playlist) => playlist.id === params.id,
  );
  if (!playlist) return notFound();

  return (
    <div className="flex flex-col gap-4">
      <div className="mx-auto mt-4 flex w-full max-w-screen-2xl flex-col items-center px-4 pt-4 xs:flex-row xs:items-start">
        <h1>{playlist.name}</h1>
      </div>
    </div>
  );
}
