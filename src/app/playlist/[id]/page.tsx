import type { Metadata, ResolvingMetadata } from "next";
import { currentUser } from "@clerk/nextjs/server";
import { EllipsisVertical, Play, Share, Trash } from "lucide-react";
import { unstable_cache } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropwDownMenu";
import {
  VideoCardChannel,
  VideoCardChannelName,
  VideoCardInfo,
  VideoCardRoot,
  VideoCardThumb,
  VideoCardTitle,
} from "@/components/VideoCard";
import { prisma } from "@/lib/prisma";
import { UpdatePlaylistDialog } from "./updatePlaylist/Dialog";

type PlaylistPageProps = {
  readonly params: Promise<{ id: string }>;
};

const getPlaylists = unstable_cache(
  async () => {
    return await prisma.playlist.findMany({
      include: {
        user: { omit: { externalId: false } },
        videos: { include: { user: true } },
      },
    });
  },
  ["playlists"],
  { revalidate: 60 },
);

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

export default async function PlaylistPage(props: PlaylistPageProps) {
  const params = await props.params;
  const user = await currentUser();
  const playlist = (await getPlaylists()).find(
    (playlist) => playlist.id === params.id,
  );
  if (
    !playlist ||
    (!user && !playlist.isPublic) ||
    (!playlist.isPublic && playlist.user.externalId !== user?.id)
  )
    return notFound();

  const plImage = playlist.videos[0]?.thumb || "/playlist-img.jpg";

  return (
    <div className="flex flex-col gap-4">
      <div className="relative mx-auto flex size-full max-w-screen-2xl flex-col gap-4 mdlg:mt-4 mdlg:flex-row mdlg:px-4 mdlg:pt-4">
        <div className="flex size-full flex-col items-center gap-4 bg-primary/60 p-4 sm:flex-row mdlg:w-fit mdlg:flex-col mdlg:gap-0 mdlg:rounded-xl">
          <div className="size-full md:max-h-[240px] md:max-w-[426px] mdlg:h-[190px] mdlg:w-[326px]">
            <Image
              src={plImage}
              alt={playlist.name}
              width={326}
              height={190}
              quality={100}
              className="aspect-video size-full rounded-xl object-cover"
            />
          </div>
          <div className="flex w-full flex-col items-start sm:w-auto mdlg:mt-5 mdlg:w-full">
            <h1 className="text-2xl font-bold">{playlist.name}</h1>
            <Link
              href={`/channel/${playlist.user.id}`}
              className="mt-2 flex w-fit items-center gap-2 rounded-xl outline-none ring-ring duration-200 focus-visible:ring-2"
            >
              <Image
                src={playlist.user.image}
                alt={playlist.user.username}
                width={24}
                height={24}
                className="size-6 rounded-full"
              />
              <span className="text-sm">{playlist.user.username}</span>
            </Link>
            <div className="mt-2 flex gap-1 text-xs opacity-70">
              <span>Playlist</span>
              <span>•</span>
              <span>{playlist.isPublic ? "Público" : "Privado"}</span>
              <span>•</span>
              <span>{playlist.videos.length} vídeos</span>
            </div>
            <div className="mt-4 flex w-full gap-1">
              {playlist.videos[0] ? (
                <Button
                  variant="outline"
                  className="w-full gap-2 rounded-full"
                  asChild
                >
                  <Link href={`/watch?v=${playlist.videos[0].id}`}>
                    <Play size={18} />
                    Reproduzir
                  </Link>
                </Button>
              ) : null}
              <div className="hidden gap-1 xxs:flex">
                <UpdatePlaylistDialog playlist={playlist} />
                <Button
                  variant="transparent"
                  className="hidden rounded-full xs:flex"
                  size="icon"
                  title="Compartilhar"
                >
                  <Share size={20} />
                </Button>
              </div>
              <DropdownMenu>
                <div>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="transparent"
                      className="rounded-full"
                      size="icon"
                      title="Mais opções"
                    >
                      <EllipsisVertical size={20} />
                    </Button>
                  </DropdownMenuTrigger>
                </div>
                <DropdownMenuContent>
                  <DropdownMenuItem className="gap-2 py-2">
                    <button
                      type="button"
                      className="flex items-center gap-2"
                      title="Excluir playlist"
                    >
                      <Trash size={20} />
                      Excluir playlist
                    </button>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex py-2 xxs:hidden">
                    <UpdatePlaylistDialog playlist={playlist} inMenu />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
        <div className="mddlg:gap-2.5 mt-1.5 flex w-full flex-col gap-3 px-3 sm:px-8 mdlg:px-0">
          {playlist.videos.map((video) => (
            <VideoCardRoot
              key={video.id}
              video={video}
              className="flex-col gap-1 xxs:flex-row"
            >
              <VideoCardThumb
                width={200}
                height={113}
                linkClassName="rounded-xl xs:max-h-[113px] xs:max-w-[200px]"
                className="rounded-xl"
              />
              <VideoCardInfo className="mt-0.5 gap-0 px-0">
                <div className="flex flex-col">
                  <VideoCardTitle
                    titleMaxChars={70}
                    className="max-h-10 xs:text-sm"
                  />
                  <VideoCardChannel className="size-fit rounded-md px-0.5 xxs:mt-1 md:mt-0.5">
                    <VideoCardChannelName className="md:text-xs" />
                  </VideoCardChannel>
                </div>
              </VideoCardInfo>
            </VideoCardRoot>
          ))}
        </div>
      </div>
    </div>
  );
}
