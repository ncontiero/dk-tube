"use client";

import type { Playlist } from "@/lib/prisma";
import { toast } from "react-toastify";
import { Loader2, Trash } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { deletePlaylistAction } from "@/actions/playlist";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/AlertDialog";
import { Button } from "@/components/ui/Button";
import { DropdownMenuItem } from "@/components/ui/DropwDownMenu";

interface DeletePlaylistFormProps {
  readonly playlist: Playlist;
}

export function DeletePlaylist({ playlist }: DeletePlaylistFormProps) {
  const deletePlaylist = useAction(deletePlaylistAction, {
    onError: ({ error }) => {
      toast.error(error.serverError);
    },
    onSuccess: () => {
      toast.success("Playlist excluída com sucesso!");
    },
  });

  return (
    <DropdownMenuItem className="py-2" onSelect={(e) => e.preventDefault()}>
      <AlertDialog>
        <AlertDialogTrigger className="flex items-center gap-2">
          <Trash size={20} />
          Excluir playlist
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir playlist</AlertDialogTitle>
            <AlertDialogDescription className="flex flex-col">
              <span>
                Quer mesmo excluir{" "}
                <span className="font-bold">{playlist.name}</span>?
              </span>
              <span>
                <span className="font-bold">Nota:</span> a exclusão de playlists
                é uma ação permanente e não pode ser desfeita.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <Button
              type="submit"
              className="flex w-fit items-center gap-2"
              title="Excluir playlist"
              onClick={() => deletePlaylist.execute({ id: playlist.id })}
              disabled={deletePlaylist.status === "executing"}
            >
              {deletePlaylist.status === "executing" ? (
                <Loader2 className="size-4 animate-spin" />
              ) : null}
              {deletePlaylist.status === "executing"
                ? "Excluindo..."
                : "Excluir playlist"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DropdownMenuItem>
  );
}
