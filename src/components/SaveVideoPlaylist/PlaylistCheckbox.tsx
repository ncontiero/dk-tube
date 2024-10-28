import type { Playlist } from "@prisma/client";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import { Loader2, Lock } from "lucide-react";
import { Checkbox } from "../ui/Checkbox";
import { Label } from "../ui/Label";

export type PlaylistCheckboxProps = {
  readonly playlist: Playlist & { hasVideo: boolean };
  readonly videoId: string;
};

export function PlaylistCheckbox({ playlist, videoId }: PlaylistCheckboxProps) {
  const [checked, setChecked] = useState(playlist.hasVideo);
  const [loading, setLoading] = useState(false);

  const handleSaveVideo = useCallback(
    async (checked: boolean) => {
      setLoading(true);
      setChecked(checked);
      const { status } = await fetch(`/api/playlists/my-playlists`, {
        method: "POST",
        body: JSON.stringify({
          videoId,
          playlistId: playlist.id,
        }),
      });

      if (status === 200) {
        toast.success(checked ? "Salvo" : "Removido");
      } else {
        toast.error(`Erro ao ${checked ? "salvar" : "remover"} o vídeo`);
        setChecked(!checked);
      }

      setLoading(false);
    },
    [playlist.id, videoId],
  );

  return (
    <Label
      htmlFor={`save-${playlist.id}`}
      className="flex cursor-pointer items-center gap-2 text-base"
      title={`Clique para salvar o vídeo na playlist '${playlist.name}'${playlist.isPublic ? "" : " (privada)"}`}
    >
      {loading ? (
        <div className="size-6 rounded-md" title="Carregando...">
          <Loader2 className="size-full animate-spin" />
          <span className="sr-only">Carregando...</span>
        </div>
      ) : (
        <Checkbox
          id={`save-${playlist.id}`}
          className="size-6"
          checked={checked}
          onCheckedChange={handleSaveVideo}
        />
      )}
      {playlist.name}
      {!playlist.isPublic && (
        <span title="Privada">
          <Lock className="size-4 text-yellow-500" />
        </span>
      )}
    </Label>
  );
}
