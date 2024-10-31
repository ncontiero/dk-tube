import type { PlaylistCheckboxProps } from "./PlaylistCheckbox";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import { Clock, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { DropdownMenuItem } from "../ui/DropwDownMenu";
import { Skeleton } from "../ui/Skeleton";

type PLProps = PlaylistCheckboxProps["playlist"];
interface SaveToWatchLaterProps {
  readonly videoId: string;
}

export function SaveToWatchLater({ videoId }: SaveToWatchLaterProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [hasVideoInWatchLater, setHasVideoInWatchLater] = useState(false);

  const { isFetching: isFetchingWatchLater, isPending: isPendingWatchLater } =
    useQuery<PLProps | null>({
      queryKey: ["watch-later"],
      queryFn: async () => {
        try {
          const playlists = (await (
            await fetch(`/api/playlists/my-playlists?videoId=${videoId}`)
          ).json()) as PLProps[];

          const watchLater =
            playlists.find((p) => p.id === "watch-later") || null;
          setHasVideoInWatchLater(!!watchLater?.hasVideo);

          return watchLater;
        } catch (error) {
          console.error(error);
        }
        return null;
      },
      refetchOnWindowFocus: false,
    });

  const handleSaveVideo = useCallback(async () => {
    setLoading(true);
    const { status } = await fetch(`/api/playlists/my-playlists`, {
      method: "POST",
      body: JSON.stringify({
        videoId,
        playlistId: "watch-later",
      }),
    });

    if (status === 200) {
      toast.success(hasVideoInWatchLater ? "Removido" : "Salvo");
      router.refresh();
      setHasVideoInWatchLater(!hasVideoInWatchLater);
    } else {
      toast.error(
        `Erro ao ${hasVideoInWatchLater ? "remover" : "salvar"} o vídeo`,
      );
    }

    setLoading(false);
  }, [router, videoId, hasVideoInWatchLater]);

  return (
    <DropdownMenuItem
      className="w-full cursor-pointer p-2"
      disabled={isFetchingWatchLater || isPendingWatchLater}
      onSelect={(e) => e.preventDefault()}
    >
      {isFetchingWatchLater || isPendingWatchLater ? (
        <div className="flex w-full items-center gap-2">
          <div>
            <Skeleton className="size-6" />
          </div>
          <Skeleton className="h-6 w-full" />
        </div>
      ) : (
        <button
          type="button"
          className="flex items-center gap-2"
          disabled={loading}
          onClick={handleSaveVideo}
        >
          {loading ? <Loader2 className="animate-spin" /> : <Clock />}
          <span>
            {hasVideoInWatchLater ? "Remover do " : "Salvar em "}
            &apos;Assistir mais tarde&apos;
          </span>
        </button>
      )}
    </DropdownMenuItem>
  );
}
