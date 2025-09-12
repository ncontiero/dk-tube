import type { Playlist } from "@/lib/prisma";
import { Pencil, X } from "lucide-react";
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
import { UpdatePlaylistForm } from "./Form";

interface UpdatePlaylistDialogProps {
  readonly playlist: Playlist;
  readonly inMenu?: boolean;
}

export function UpdatePlaylistDialog({
  playlist,
  inMenu = false,
}: UpdatePlaylistDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {inMenu ? (
          <button
            type="button"
            className="flex items-center gap-2"
            title="Editar playlist"
          >
            <Pencil size={20} />
            Editar playlist
          </button>
        ) : (
          <Button
            variant="transparent"
            className="rounded-full"
            size="icon"
            title="Editar playlist"
            type="button"
          >
            <Pencil size={20} />
          </Button>
        )}
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent className="max-w-xs">
          <div className="flex w-full items-center justify-between">
            <DialogHeader>
              <DialogTitle>Editar playlist</DialogTitle>
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
          <UpdatePlaylistForm playlist={playlist} />
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
