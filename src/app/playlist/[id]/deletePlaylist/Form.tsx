"use client";

import type { Playlist } from "@prisma/client";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { Loader2, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
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
import { useFormState } from "@/hooks/useFormState";
import { type DeletePlaylistKeys, deletePlaylistAction } from "./action";

interface DeletePlaylistFormProps {
  readonly playlist: Playlist;
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
}

export function DeletePlaylistForm({
  playlist,
  open,
  onOpenChange,
}: DeletePlaylistFormProps) {
  const router = useRouter();

  const [{ errors, message, success }, handleSubmit, isPending] =
    useFormState<DeletePlaylistKeys>(deletePlaylistAction, (message) => {
      toast.success(message);
      router.push("/");
    });

  useEffect(() => {
    if (success === false && message) {
      toast.error(message);
    }
    if (errors?.playlistId) {
      toast.error(errors.playlistId);
    }
  }, [errors, message, success]);

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogTrigger className="flex items-center gap-2">
        <Trash size={20} />
        Excluir playlist
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir playlist</AlertDialogTitle>
          <AlertDialogDescription>
            Quer mesmo excluir{" "}
            <span className="font-bold">{playlist.name}</span>? Nota: a exclusão
            de playlists é uma ação permanente e não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <form onSubmit={handleSubmit}>
            <input
              type="hidden"
              name="playlistId"
              readOnly
              hidden
              value={playlist.id}
            />
            <Button
              type="submit"
              className="flex items-center gap-2"
              title="Excluir playlist"
              disabled={isPending}
            >
              {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
              {isPending ? "Excluindo..." : "Excluir playlist"}
            </Button>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
