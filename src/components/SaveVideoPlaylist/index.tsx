"use client";

import type { Playlist, Video } from "@prisma/client";
import { type PropsWithChildren, useState } from "react";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import { Bookmark, EllipsisVertical, Lock, X } from "lucide-react";
import { Button } from "../ui/Button";
import { Checkbox } from "../ui/Checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "../ui/Dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/DropwDownMenu";
import { Label } from "../ui/Label";

export interface SaveVideoPlaylistDialogProps extends PropsWithChildren {
  readonly video: Video;
  readonly open?: boolean;
  readonly onOpenChange?: (open: boolean) => void;
}

const noopFunc = () => {};
export function SaveVideoPlaylistDialog({
  children,
  video,
  open = false,
  onOpenChange = noopFunc,
}: SaveVideoPlaylistDialogProps) {
  const { data: playlists } = useQuery<Array<Playlist & { hasVideo: boolean }>>(
    {
      queryKey: ["playlists"],
      queryFn: async () => {
        try {
          return (
            await fetch(`/api/playlists/my-playlists?videoId=${video.id}`)
          ).json();
        } catch (error) {
          console.error(error);
        }
      },
    },
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children}
      <DialogPortal>
        <DialogOverlay className="z-[9999] backdrop-blur-sm" />
        <DialogContent className="left-[50%] top-[50%] z-[99999] max-w-xs translate-x-[-50%] translate-y-[-50%]">
          <div className="flex w-full items-center justify-between">
            <DialogHeader>
              <DialogTitle>Salvar vídeo em...</DialogTitle>
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
          <div className="flex flex-col space-y-2">
            {playlists?.map((playlist) => (
              <div key={playlist.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`save-${playlist.id}`}
                  className="size-6"
                  defaultChecked={playlist.hasVideo}
                  onCheckedChange={async (checked) => {
                    const { status } = await fetch(
                      `/api/playlists/my-playlists`,
                      {
                        method: "POST",
                        body: JSON.stringify({
                          videoId: video.id,
                          playlistId: playlist.id,
                        }),
                      },
                    );
                    if (status === 200)
                      toast.success(checked ? "Salvo" : "Removido");
                  }}
                />
                <Label
                  htmlFor={`save-${playlist.id}`}
                  className="flex items-center gap-1 text-base"
                >
                  {playlist.name}
                  {!playlist.isPublic && (
                    <span title="Privada">
                      <Lock className="size-4 text-yellow-500" />
                    </span>
                  )}
                </Label>
              </div>
            ))}
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}

export function SaveVideoPlaylistMenu({ video }: { readonly video: Video }) {
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <DropdownMenu open={dialogOpen || open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 z-20 size-fit rounded-full p-0.5"
        >
          <EllipsisVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <SaveVideoPlaylistDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          video={video}
        >
          <DropdownMenuItem className="gap-2" asChild>
            <DialogTrigger>
              <Bookmark />
              <span>Salvar na playlist</span>
            </DialogTrigger>
          </DropdownMenuItem>
        </SaveVideoPlaylistDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
