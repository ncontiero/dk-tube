import { auth } from "@clerk/nextjs/server";
import { Film, Plus, X } from "lucide-react";
import Image from "next/image";

import Link from "next/link";
import { CreatePlaylistForm } from "@/components/SaveVideoPlaylist/CreatePlaylistForm";
import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";
import { ScrollArea, ScrollBar } from "@/components/ui/ScrollArea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/Tooltip";
import { UnauthorizedPage } from "@/components/UnauthorizedPage";
import {
  VideoCardInfo,
  VideoCardRoot,
  VideoCardThumb,
  VideoCardTitle,
} from "@/components/VideoCard";
import { prisma } from "@/lib/prisma";

const YouUnauthorizedPage = () => {
  return (
    <UnauthorizedPage
      title="Desfrute dos seus vídeos favoritos"
      description="Faça login para acessar os vídeos salvos ou marcados com gostei"
      icon={<Film size={96} />}
    />
  );
};

export default async function YouPage() {
  const { userId } = await auth();
  if (!userId) {
    return <YouUnauthorizedPage />;
  }

  const you = await prisma.user.findUnique({
    where: { externalId: userId },
    include: {
      history: { include: { video: true } },
      watchLater: true,
      likedVideos: true,
    },
  });
  if (!you) {
    return <YouUnauthorizedPage />;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="mx-auto mt-6 flex size-full max-w-screen-xl flex-col gap-6 px-4">
        <div className="flex items-center gap-4 xs:items-start">
          <Image
            src={you.image}
            alt={you.username}
            width={120}
            height={120}
            className="aspect-square max-h-[72px] max-w-[72px] rounded-full border object-cover xs:max-h-[120px] xs:max-w-[120px]"
          />
          <Link
            href={`/channel/${you.id}`}
            className="group flex size-fit flex-col rounded-md outline-none ring-primary duration-200 focus:ring-2"
          >
            <h1 className="text-xl font-bold uppercase xs:text-4xl">
              {you.username}
            </h1>
            <span className="mt-1 text-xs text-foreground/60 duration-200 group-hover:text-foreground group-hover:underline group-focus:text-foreground group-focus:underline xs:text-sm">
              Ver canal
            </span>
          </Link>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Link href="/feed/history">
              <h2 className="text-lg font-bold">Histórico</h2>
            </Link>
            <Button
              asChild
              variant="outline"
              className="rounded-full"
              size="sm"
            >
              <Link href="/feed/history">Ver tudo</Link>
            </Button>
          </div>
          <ScrollArea>
            <div className="flex flex-col gap-3 p-1 xs:flex-row xs:gap-2">
              {you.history.slice(0, 5).map(({ video }) => (
                <VideoCardRoot
                  key={video.id}
                  video={{ ...video, user: you }}
                  className="flex-row xs:w-[214px] xs:flex-col xs:pb-4"
                >
                  <VideoCardThumb
                    className="rounded-xl"
                    linkClassName="rounded-xl xs:max-h-[118px] xs:max-w-[214px]"
                    width={214}
                    height={118}
                  />
                  <VideoCardInfo className="mt-1.5 md:px-0.5">
                    <VideoCardTitle titleMaxChars={32} className="xs:text-sm" />
                  </VideoCardInfo>
                </VideoCardRoot>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Link href="/feed/playlists">
              <h2 className="text-lg font-bold">Playlists</h2>
            </Link>
            <div className="flex items-center gap-2">
              <Dialog>
                <TooltipProvider delayDuration={200}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="size-9 rounded-full"
                        >
                          <Plus />
                        </Button>
                      </DialogTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Criar playlist</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <DialogPortal>
                  <DialogOverlay className="z-[9999] backdrop-blur-sm" />
                  <DialogContent className="z-[99999] max-w-xs">
                    <div className="flex w-full items-center justify-between">
                      <DialogHeader>
                        <DialogTitle>Criar playlist</DialogTitle>
                      </DialogHeader>
                      <DialogClose asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Fechar"
                          aria-label="Fechar"
                        >
                          <X />
                        </Button>
                      </DialogClose>
                    </div>
                    <CreatePlaylistForm />
                  </DialogContent>
                </DialogPortal>
              </Dialog>
              <Button
                asChild
                variant="outline"
                className="rounded-full"
                size="sm"
              >
                <Link href="/feed/playlists">Ver tudo</Link>
              </Button>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Link href="/playlist/WL" className="flex items-center gap-4">
              <h2 className="text-lg font-bold">Assistir mais tarde</h2>
              <span className="text-foreground/60">
                {you.watchLater.length}
              </span>
            </Link>
            <Button
              asChild
              variant="outline"
              className="rounded-full"
              size="sm"
            >
              <Link href="/playlist/WL">Ver tudo</Link>
            </Button>
          </div>
          <ScrollArea>
            <div className="flex flex-col gap-3 p-1 xs:flex-row xs:gap-2">
              {you.watchLater.slice(0, 5).map((video) => (
                <VideoCardRoot
                  key={video.id}
                  video={{ ...video, user: you }}
                  className="flex-row xs:w-[214px] xs:flex-col xs:pb-4"
                >
                  <VideoCardThumb
                    className="rounded-xl"
                    linkClassName="rounded-xl xs:max-h-[118px] xs:max-w-[214px]"
                    width={214}
                    height={118}
                  />
                  <VideoCardInfo className="mt-1.5 md:px-0.5">
                    <VideoCardTitle titleMaxChars={32} className="xs:text-sm" />
                  </VideoCardInfo>
                </VideoCardRoot>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Link href="/playlist/LL" className="flex items-center gap-4">
              <h2 className="text-lg font-bold">Vídeos curtidos</h2>
              <span className="text-foreground/60">
                {you.likedVideos.length}
              </span>
            </Link>
            <Button
              asChild
              variant="outline"
              className="rounded-full"
              size="sm"
            >
              <Link href="/playlist/LL">Ver tudo</Link>
            </Button>
          </div>
          <ScrollArea>
            <div className="flex flex-col gap-3 p-1 xs:flex-row xs:gap-2">
              {you.watchLater.slice(0, 5).map((video) => (
                <VideoCardRoot
                  key={video.id}
                  video={{ ...video, user: you }}
                  className="flex-row xs:w-[214px] xs:flex-col xs:pb-4"
                >
                  <VideoCardThumb
                    className="rounded-xl"
                    linkClassName="rounded-xl xs:max-h-[118px] xs:max-w-[214px]"
                    width={214}
                    height={118}
                  />
                  <VideoCardInfo className="mt-1.5 md:px-0.5">
                    <VideoCardTitle titleMaxChars={32} className="xs:text-sm" />
                  </VideoCardInfo>
                </VideoCardRoot>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
