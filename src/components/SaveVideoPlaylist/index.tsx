"use client";

import type { Playlist } from "@prisma/client";
import { type PropsWithChildren, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import {
  Bookmark,
  EllipsisVertical,
  Loader2,
  Lock,
  Plus,
  X,
} from "lucide-react";
import { useFormState } from "@/hooks/useFormState";
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
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import {
  type CreatePlaylistKeys,
  createPlaylistAction,
} from "./createPlaylistAction";

export interface SaveVideoPlaylistDialogProps extends PropsWithChildren {
  readonly videoId: string;
  readonly open?: boolean;
  readonly onOpenChange?: (open: boolean) => void;
}

const noopFunc = () => {};
export function SaveVideoPlaylistDialog({
  children,
  videoId,
  open = false,
  onOpenChange = noopFunc,
}: SaveVideoPlaylistDialogProps) {
  const [createPlaylistFormOpen, setCreatePlaylistFormOpen] = useState(false);

  const { data: playlists, refetch: refetchPlaylists } = useQuery<
    Array<Playlist & { hasVideo: boolean }>
  >({
    queryKey: ["playlists"],
    queryFn: async () => {
      try {
        return (
          await fetch(`/api/playlists/my-playlists?videoId=${videoId}`)
        ).json();
      } catch (error) {
        console.error(error);
      }
    },
    refetchOnWindowFocus: false,
  });

  const [{ errors, message, success }, handleSubmit, isPending] =
    useFormState<CreatePlaylistKeys>(createPlaylistAction, async (message) => {
      await refetchPlaylists();
      toast.success(message);
      setCreatePlaylistFormOpen(false);
    });

  useEffect(() => {
    if (success === false && message) {
      toast.error(message);
    }
    if (errors?.videoId) {
      toast.error(errors.videoId);
    }
  }, [errors, message, success]);

  return (
    <Dialog defaultOpen={open} onOpenChange={onOpenChange}>
      {children}
      <DialogPortal>
        <DialogOverlay className="z-[9999] backdrop-blur-sm" />
        <DialogContent className="left-[50%] top-[50%] z-[99999] max-w-xs translate-x-[-50%] translate-y-[-50%] data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
          <div className="flex w-full items-center justify-between">
            <DialogHeader>
              <DialogTitle>
                {createPlaylistFormOpen
                  ? "Criar playlist"
                  : "Salvar vídeo em..."}
              </DialogTitle>
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
          <div
            className="flex flex-col gap-4 duration-200 data-[state=closed]:hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-right-1/3 data-[state=open]:slide-in-from-right-1/3"
            data-state={createPlaylistFormOpen ? "closed" : "open"}
            aria-hidden={createPlaylistFormOpen}
          >
            <div className="flex flex-col space-y-2">
              {playlists?.map((playlist) => (
                <Label
                  key={playlist.id}
                  htmlFor={`save-${playlist.id}`}
                  className="flex cursor-pointer items-center gap-2 text-base"
                  title={`Clique para salvar o vídeo na playlist '${playlist.name}'${!playlist.isPublic ? " (privada)" : ""}`}
                >
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
                            videoId,
                            playlistId: playlist.id,
                          }),
                        },
                      );
                      if (status === 200)
                        toast.success(checked ? "Salvo" : "Removido");
                    }}
                  />
                  {playlist.name}
                  {!playlist.isPublic && (
                    <span title="Privada">
                      <Lock className="size-4 text-yellow-500" />
                    </span>
                  )}
                </Label>
              ))}
            </div>
            <Button
              className="w-full gap-1 rounded-full"
              variant="secondary"
              onClick={() => setCreatePlaylistFormOpen(true)}
              type="button"
            >
              <Plus />
              Nova playlist
            </Button>
          </div>
          <form
            onSubmit={handleSubmit}
            data-state={createPlaylistFormOpen ? "open" : "closed"}
            className="duration-200 data-[state=closed]:hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-left-1/3 data-[state=open]:slide-in-from-left-1/3"
            aria-hidden={!createPlaylistFormOpen}
          >
            <input hidden value={videoId} name="videoId" readOnly />
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                name="name"
                type="text"
                id="name"
                placeholder="Digite o nome da playlist..."
              />

              {errors?.name ? (
                <p className="text-xs font-medium text-red-500 dark:text-red-400">
                  {errors.name[0]}
                </p>
              ) : null}
            </div>

            <div className="mt-4 flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                className="w-full rounded-full"
                onClick={() => setCreatePlaylistFormOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="w-full rounded-full"
                disabled={isPending}
              >
                {isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  "Criar"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}

export function SaveVideoPlaylistMenu({
  videoId,
}: {
  readonly videoId: string;
}) {
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <DropdownMenu open={dialogOpen || open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 z-20 size-fit rounded-full p-0.5 duration-200 group-focus-within/card:opacity-100 group-hover/card:opacity-100 sm:opacity-0"
        >
          <EllipsisVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <SaveVideoPlaylistDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          videoId={videoId}
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
