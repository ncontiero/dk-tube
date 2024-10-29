"use client";

import type { Playlist } from "@prisma/client";
import { useState } from "react";
import { EllipsisVertical } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropwDownMenu";
import { DeletePlaylistForm } from "./deletePlaylist/Form";
import { UpdatePlaylistDialog } from "./updatePlaylist/Dialog";

interface PlaylistOptionsProps {
  readonly playlist: Playlist;
}

export function PlaylistOptions({ playlist }: PlaylistOptionsProps) {
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <DropdownMenu open={dialogOpen || open} onOpenChange={setOpen}>
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
        <DropdownMenuItem className="py-2">
          <DeletePlaylistForm
            playlist={playlist}
            open={dialogOpen}
            onOpenChange={setDialogOpen}
          />
        </DropdownMenuItem>
        <DropdownMenuItem className="flex py-2 xxs:hidden">
          <UpdatePlaylistDialog playlist={playlist} inMenu />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
