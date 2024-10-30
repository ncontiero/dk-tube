"use client";

import { type PropsWithChildren, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import { Bookmark, EllipsisVertical, Loader2, Plus, X } from "lucide-react";
import { useFormState } from "@/hooks/useFormState";
import { Button } from "../ui/Button";
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
import { Skeleton } from "../ui/Skeleton";
import { Switch } from "../ui/Switch";
import {
  type CreatePlaylistKeys,
  createPlaylistAction,
} from "./createPlaylistAction";
import {
  type PlaylistCheckboxProps,
  PlaylistCheckbox,
} from "./PlaylistCheckbox";
import { SaveToWatchLater } from "./SaveToWatchLater";

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

  const {
    data: playlists,
    refetch: refetchPlaylists,
    isPending: isPendingPlaylists,
    isRefetching: isRefetchingPlaylists,
  } = useQuery<PlaylistCheckboxProps["playlist"][]>({
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
        <DialogContent className="z-[99999] max-w-xs">
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
              {isPendingPlaylists || isRefetchingPlaylists ? (
                [1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Skeleton className="size-6 rounded-md" />
                    <Skeleton className="h-6 w-1/2" />
                  </div>
                ))
              ) : !playlists ? (
                <div className="my-2">Você não tem playlists!</div>
              ) : (
                playlists.map((playlist) => (
                  <PlaylistCheckbox
                    key={playlist.id}
                    playlist={playlist}
                    videoId={videoId}
                  />
                ))
              )}
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
            <input
              hidden
              type="hidden"
              value={videoId}
              name="videoId"
              readOnly
            />
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

            <Label
              className="mt-4 flex cursor-pointer flex-col gap-2 rounded-xl p-2 duration-200 hover:bg-input/80"
              htmlFor="isPublic"
            >
              <div className="flex w-full items-center justify-between">
                Pública
                <Switch name="isPublic" id="isPublic" />
              </div>
              {errors?.isPublic ? (
                <p className="text-xs font-medium text-red-500 dark:text-red-400">
                  {errors.isPublic[0]}
                </p>
              ) : null}
            </Label>

            <div className="mt-4 flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                className="w-full rounded-full"
                onClick={() => setCreatePlaylistFormOpen(false)}
              >
                Voltar
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
        <DropdownMenuItem
          className="w-full cursor-pointer p-2"
          onSelect={(e) => e.preventDefault()}
        >
          <SaveToWatchLater videoId={videoId} />
        </DropdownMenuItem>
        <SaveVideoPlaylistDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          videoId={videoId}
        >
          <DropdownMenuItem className="w-full cursor-pointer gap-2 p-2" asChild>
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
