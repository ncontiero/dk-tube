import type { Playlist, User } from "@prisma/client";
import type { VideoProps } from "@/components/VideoCard/types";
import { currentUser } from "@clerk/nextjs/server";
import { Play, Share } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/Button";
import {
  VideoCardChannel,
  VideoCardChannelName,
  VideoCardInfo,
  VideoCardRoot,
  VideoCardThumb,
  VideoCardTitle,
} from "@/components/VideoCard";
import { PlaylistOptions } from "./PlaylistOptions";
import { UpdatePlaylistDialog } from "./updatePlaylist/Dialog";

export type PlaylistProps = {
  user: User;
  videos: VideoProps[];
} & Playlist;
export type PlaylistPageProps = {
  readonly params: Promise<{ id: string }>;
  readonly getPlaylists?: () => Promise<PlaylistProps[]>;
  readonly playlist?: PlaylistProps;
  readonly isPlaylistStatic: boolean;
};

export async function PlaylistPageComp({
  getPlaylists,
  isPlaylistStatic = false,
  ...props
}: PlaylistPageProps) {
  const params = await props.params;
  const user = await currentUser();
  const playlist =
    props.playlist ||
    (getPlaylists &&
      (await getPlaylists()).find((playlist) => playlist.id === params.id));
  if (
    !playlist ||
    (!user && !playlist.isPublic) ||
    (!playlist.isPublic && playlist.user.externalId !== user?.id)
  )
    return notFound();

  const plImage = playlist.videos[0]?.thumb || "/playlist-img.jpg";

  return (
    <div className="flex flex-col gap-4">
      <div className="mx-auto flex size-full max-w-screen-2xl flex-col gap-4 mdlg:mt-4 mdlg:flex-row mdlg:px-4 mdlg:pt-4">
        <div className="flex size-full flex-col items-center gap-4 overflow-hidden bg-gradient-to-b from-primary/20 via-primary/10 to-background p-4 sm:flex-row mdlg:fixed mdlg:w-fit mdlg:flex-col mdlg:gap-0 mdlg:rounded-xl">
          <Image
            src={plImage}
            alt="image"
            className="top-0 -z-10 size-full max-h-[50%] bg-cover bg-top bg-no-repeat opacity-70 blur-3xl sm:max-h-[35%] mdlg:max-h-[50%] mdlg:max-w-[400px]"
            fill
          />
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
              {!isPlaylistStatic && (
                <>
                  <span>Playlist</span>
                  <span>•</span>
                  <span>{playlist.isPublic ? "Público" : "Privado"}</span>
                  <span>•</span>
                </>
              )}
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
              {!isPlaylistStatic && (
                <>
                  <div className="hidden gap-1 xxs:flex">
                    {user && user.id === playlist.user.externalId ? (
                      <UpdatePlaylistDialog playlist={playlist} />
                    ) : null}
                    <Button
                      variant="transparent"
                      className="hidden rounded-full xs:flex"
                      size="icon"
                      title="Compartilhar"
                    >
                      <Share size={20} />
                    </Button>
                  </div>
                  {user && user.id === playlist.user.externalId ? (
                    <PlaylistOptions playlist={playlist} />
                  ) : null}
                </>
              )}
            </div>
          </div>
        </div>
        <div className="mt-1.5 flex w-full flex-col gap-3 px-3 sm:px-8 mdlg:gap-2.5 mdlg:px-0 mdlg:pl-[380px]">
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
