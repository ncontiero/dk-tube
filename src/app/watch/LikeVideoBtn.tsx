"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Loader2, ThumbsUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

interface LikeVideoBtnProps {
  readonly videoId: string;
  readonly likes: number;
  readonly liked: boolean;
}

export function LikeVideoBtn({ videoId, likes, liked }: LikeVideoBtnProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isLiked, setIsLiked] = useState(liked);
  const [likeCount, setLikeCount] = useState(likes);
  const router = useRouter();

  const toggleLike = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);

    const { status } = await fetch("/api/videos/like", {
      method: "POST",
      body: JSON.stringify({ videoId }),
    });
    if (status === 200) {
      setIsLiked((prev) => !prev);
      toast.success(
        `Vídeo curtido ${isLiked ? "removido" : "adicionado à sua lista"}`,
      );
      setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
      router.refresh();
    } else {
      toast.error("Não foi possível curtir o vídeo");
    }

    setIsLoading(false);
  }, [isLiked, isLoading, router, videoId]);

  useEffect(() => {
    setIsLiked(liked);
    setLikeCount(likes);
  }, [liked, likes]);

  return (
    <Button
      variant="transparent"
      className="gap-2 rounded-full px-4"
      onClick={toggleLike}
      disabled={isLoading}
      aria-label={isLiked ? "Remover curtida" : "Curtir vídeo"}
    >
      {isLoading ? (
        <Loader2 size={20} className="animate-spin" />
      ) : (
        <ThumbsUp size={20} fill={isLiked ? "currentColor" : "none"} />
      )}
      <span>{likeCount}</span>
    </Button>
  );
}
