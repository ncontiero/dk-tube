"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { Loader2, ThumbsUp } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { likeVideoAction } from "@/actions/video";
import { Button } from "@/components/ui/Button";

interface LikeVideoBtnProps {
  readonly videoId: string;
  readonly likes: number;
  readonly liked: boolean;
}

export function LikeVideoBtn({ videoId, likes, liked }: LikeVideoBtnProps) {
  const [likedVideo, setLikedVideo] = useState(liked);

  const likeVideo = useAction(likeVideoAction, {
    onError: ({ error }) => {
      toast.error(error.serverError);
    },
    onSuccess: ({ data }) => {
      setLikedVideo(data?.hasAdded || false);
      toast.success(
        `${data?.hasAdded ? "Adicionado aos" : "Removido dos"} vídeos curtidos com sucesso!`,
      );
    },
  });

  return (
    <Button
      variant="transparent"
      className="gap-2 rounded-full px-4"
      onClick={() => likeVideo.execute({ videoId })}
      disabled={likeVideo.status === "executing"}
      aria-label={likedVideo ? "Remover curtida" : "Curtir vídeo"}
    >
      {likeVideo.status === "executing" ? (
        <Loader2 size={20} className="animate-spin" />
      ) : (
        <ThumbsUp size={20} fill={likedVideo ? "currentColor" : "none"} />
      )}
      <span>{likes}</span>
    </Button>
  );
}
