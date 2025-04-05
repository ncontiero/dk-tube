"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { Bookmark, EllipsisVertical, Loader2, Trash2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { removeVideoFromHistoryAction } from "@/actions/history";
import { handleVideoFromPlaylistAction } from "@/actions/playlist";
import { removeVideoAction } from "@/actions/video";
import { Button } from "../ui/Button";
import { DialogTrigger } from "../ui/Dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/DropwDownMenu";
import { SaveToWatchLater } from "./SaveToWatchLater";
import { SaveVideoPlaylistDialog } from "./SaveVideoToPlaylist";

interface VideoCardOptionsMenuProps {
  readonly videoId: string;
  readonly playlistId?: string | undefined;
  readonly removeVideoFromHistoryOpt?: boolean;
  readonly videoIsFromChannel?: boolean;
}

export function VideoCardOptionsMenu({
  videoId,
  playlistId,
  removeVideoFromHistoryOpt = false,
  videoIsFromChannel = false,
}: VideoCardOptionsMenuProps) {
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleVideoFromPlaylist = useAction(handleVideoFromPlaylistAction, {
    onError: ({ error }) => {
      toast.error(error.serverError);
    },
    onSuccess: () => {
      toast.success("Vídeo removido da playlist com sucesso!");
    },
  });

  const removeVideoFromHistory = useAction(removeVideoFromHistoryAction, {
    onError: ({ error }) => {
      toast.error(error.serverError);
    },
    onSuccess: () => {
      toast.success("Vídeo removido do histórico com sucesso!");
    },
  });

  const removeVideo = useAction(removeVideoAction, {
    onError: ({ error }) => {
      toast.error(error.serverError);
    },
    onSuccess: () => {
      toast.success("Vídeo removido com sucesso!");
    },
  });

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
            onClick={() => removeVideoFromHistory.execute({ videoId })}
            onSelect={(e) => e.preventDefault()}
            disabled={removeVideoFromHistory.status === "executing"}
          >
            {removeVideoFromHistory.status === "executing" ? (
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
            onClick={() =>
              handleVideoFromPlaylist.execute({ videoId, playlistId })
            }
            onSelect={(e) => e.preventDefault()}
            disabled={handleVideoFromPlaylist.status === "executing"}
          >
            {handleVideoFromPlaylist.status === "executing" ? (
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
        {videoIsFromChannel ? (
          <DropdownMenuItem
            className="w-full cursor-pointer gap-2 p-2"
            onClick={() => removeVideo.execute({ videoId })}
            onSelect={(e) => e.preventDefault()}
            disabled={removeVideo.status === "executing"}
          >
            {removeVideo.status === "executing" ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Trash2 />
            )}
            <span>Excluir Vídeo</span>
          </DropdownMenuItem>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
