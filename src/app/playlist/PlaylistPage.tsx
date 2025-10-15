import type { PlaylistProps } from "@/utils/types";
import { EllipsisVertical, Play, Share } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
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
import { DeletePlaylist } from "./DeletePlaylist";
import { UpdatePlaylistDialog } from "./UpdatePlaylist";

export type PlaylistPageCompProps = {
  readonly userId?: string | undefined;
  readonly playlist: PlaylistProps;
};

export function PlaylistPageComp({ playlist, userId }: PlaylistPageCompProps) {
  const plImage = playlist.videos[0]?.thumb || "/playlist-img.jpg";

  const isStaticPlaylist = playlist.id === "WL" || playlist.id === "LL";

  return (
    <div className="flex size-full flex-col gap-4">
      <div
        className={`
          mdl:mt-4 mdl:flex-row mdl:px-4 mdl:pt-4 mx-auto flex size-full max-w-(--breakpoint-2xl) flex-col gap-4
        `}
      >
        <div
          className={`
            from-primary/20 via-primary/10 to-background mdl:fixed mdl:w-fit mdl:flex-col mdl:gap-0 mdl:rounded-xl flex
            flex-col items-center gap-4 overflow-hidden bg-linear-to-b p-4 sm:flex-row
          `}
        >
          <Image
            src={plImage}
            alt="image"
            className={`
              mdl:max-h-[50%] mdl:max-w-[400px] top-0 -z-10 size-full max-h-[50%] bg-cover bg-top bg-no-repeat
              opacity-70 blur-3xl sm:max-h-[35%]
            `}
            fill
          />
          <div className="mdl:h-[190px] mdl:w-[326px] size-full md:max-h-[240px] md:max-w-[426px]">
            <Image
              src={plImage}
              alt={playlist.name}
              width={326}
              height={190}
              quality={100}
              className="aspect-video size-full rounded-xl object-cover"
            />
          </div>
          <div className="mdl:mt-5 mdl:w-full flex w-full flex-col items-start sm:w-auto">
            <h1 className="text-2xl font-bold">{playlist.name}</h1>
            <Link
              href={`/channel/${playlist.user.id}`}
              className={`
                ring-ring mt-2 flex w-fit items-center gap-2 rounded-xl outline-hidden duration-200 focus-visible:ring-2
              `}
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
              {!isStaticPlaylist && (
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
              {!isStaticPlaylist && (
                <>
                  <div className="xxs:flex hidden gap-1">
                    {userId && userId === playlist.user.externalId ? (
                      <UpdatePlaylistDialog playlist={playlist} />
                    ) : null}
                    <Button
                      variant="transparent"
                      className="xs:flex hidden rounded-full"
                      size="icon"
                      title="Compartilhar"
                    >
                      <Share size={20} />
                    </Button>
                  </div>
                  {userId && userId === playlist.user.externalId ? (
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
                        <DropdownMenuItem className="xxs:hidden flex py-2">
                          <UpdatePlaylistDialog playlist={playlist} inMenu />
                        </DropdownMenuItem>
                        <DeletePlaylist playlist={playlist} />
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : null}
                </>
              )}
            </div>
          </div>
        </div>
        <div className="mdl:gap-2.5 mdl:px-0 mdl:pl-[380px] mt-1.5 flex w-full flex-col gap-3 px-3 sm:px-8">
          {playlist.videos.map((video) => (
            <VideoCardRoot
              key={video.id}
              video={video}
              className="xxs:flex-row flex-col gap-1"
            >
              <VideoCardThumb
                width={200}
                height={113}
                linkClassName="rounded-xl xs:max-h-[113px] xs:max-w-[200px]"
                className="rounded-xl"
              />
              <VideoCardInfo
                className="mt-0.5 gap-0 px-0"
                playlistId={playlist.id !== "WL" ? playlist.id : undefined}
              >
                <div className="flex flex-col">
                  <VideoCardTitle
                    titleMaxChars={70}
                    className="xs:text-sm max-h-10"
                  />
                  <VideoCardChannel className="xxs:mt-1 size-fit rounded-md px-0.5 md:mt-0.5">
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
