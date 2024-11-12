"use client";

import { type PropsWithChildren, useCallback, useState } from "react";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import {
  Bookmark,
  EllipsisVertical,
  Loader2,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
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
import { Skeleton } from "../ui/Skeleton";
import { CreatePlaylistForm } from "./CreatePlaylistForm";
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
          <CreatePlaylistForm
            videoId={videoId}
            refetchPlaylists={refetchPlaylists}
            createPlaylistFormOpen={createPlaylistFormOpen}
            setCreatePlaylistFormOpen={setCreatePlaylistFormOpen}
          />
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}

interface SaveVideoPlaylistMenuProps {
  readonly videoId: string;
  readonly playlistId?: string | undefined;
  readonly removeVideoFromHistoryOpt?: boolean;
}

export function SaveVideoPlaylistMenu({
  videoId,
  playlistId,
  removeVideoFromHistoryOpt = false,
}: SaveVideoPlaylistMenuProps) {
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [removingFromPlaylist, setRemovingFromPlaylist] = useState(false);
  const [removingFromHistory, setRemovingFromHistory] = useState(false);
  const router = useRouter();

  const removeVideoFromPlaylist = useCallback(async () => {
    if (!videoId || !playlistId || removingFromPlaylist) return;

    setRemovingFromPlaylist(true);
    const { status } = await fetch(`/api/playlists/remove-video`, {
      method: "POST",
      body: JSON.stringify({
        videoId,
        playlistId,
      }),
    });

    if (status === 200) {
      toast.success("Vídeo removido da playlist com sucesso!");
      router.refresh();
    } else {
      toast.error("Erro ao remover vídeo da playlist!");
    }
    setRemovingFromPlaylist(false);
  }, [playlistId, removingFromPlaylist, router, videoId]);

  const removeVideoFromHistory = useCallback(async () => {
    if (!videoId || !removeVideoFromHistoryOpt || removingFromPlaylist) return;

    setRemovingFromHistory(true);
    const { status } = await fetch(`/api/history/remove-video`, {
      method: "POST",
      body: JSON.stringify({
        videoId,
      }),
    });

    if (status === 200) {
      toast.success("Vídeo removido do histórico com sucesso!");
      router.refresh();
    } else {
      toast.error("Erro ao remover vídeo da histórico!");
    }
    setRemovingFromHistory(false);
  }, [removeVideoFromHistoryOpt, removingFromPlaylist, router, videoId]);

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
        <SaveToWatchLater videoId={videoId} />
        {removeVideoFromHistoryOpt ? (
          <DropdownMenuItem
            className="w-full cursor-pointer gap-2 p-2"
            onClick={() => removeVideoFromHistory()}
            onSelect={(e) => e.preventDefault()}
            disabled={removingFromHistory}
          >
            {removingFromHistory ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Trash2 />
            )}
            <span>Remover do histórico</span>
          </DropdownMenuItem>
        ) : null}
        {playlistId ? (
          <DropdownMenuItem
            className="w-full cursor-pointer gap-2 p-2"
            onClick={() => removeVideoFromPlaylist()}
            onSelect={(e) => e.preventDefault()}
            disabled={removingFromPlaylist}
          >
            {removingFromPlaylist ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Trash2 />
            )}
            <span>Remover da playlist</span>
          </DropdownMenuItem>
        ) : null}
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
