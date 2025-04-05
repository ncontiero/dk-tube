"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player/youtube";
import { useAction } from "next-safe-action/hooks";
import { useSearchParams } from "next/navigation";
import { updateHistoryAction } from "@/actions/history";

export type VideoProps = {
  readonly videoId: string;
  readonly startTime: number | undefined;
  readonly hasUser?: boolean;
};

export function Video({ videoId, startTime, hasUser = false }: VideoProps) {
  const dbVideoId = useSearchParams().get("v");
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [videoCurrentTime, setVideoCurrentTime] = useState(startTime || 0);

  const videoRef = useRef<ReactPlayer>(null);
  const ambilightVideoRef = useRef<ReactPlayer>(null);

  const optimizeAmbilight = useCallback((player?: Record<string, any>) => {
    if (!player || !player.getAvailableQualityLevels) return;
    const qualityLevels: string[] = [...player.getAvailableQualityLevels()];
    if (qualityLevels && qualityLevels.length > 0 && qualityLevels.length > 0) {
      qualityLevels.reverse();
      const lowestLevel =
        qualityLevels[qualityLevels.findIndex((q) => q !== "auto")];
      player.setPlaybackQuality(lowestLevel);
    }
  }, []);

  const updateHistory = useAction(updateHistoryAction);

  useEffect(() => {
    if (ambilightVideoRef.current) {
      ambilightVideoRef.current.seekTo(videoCurrentTime, "seconds");
      optimizeAmbilight(ambilightVideoRef.current.getInternalPlayer());
    }
  }, [optimizeAmbilight, videoCurrentTime]);

  return (
    <div className="relative flex size-full justify-center">
      <div
        id="video"
        className="z-[999] aspect-video size-full overflow-hidden md:rounded-xl"
      >
        <ReactPlayer
          ref={videoRef}
          url={`https://www.youtube.com/watch?v=${videoId}`}
          width="100%"
          height="100%"
          onPlay={() => {
            setVideoPlaying(true);
            setVideoCurrentTime(videoRef.current?.getCurrentTime() || 0);
          }}
          onPause={() => {
            setVideoPlaying(false);
            setVideoCurrentTime(videoRef.current?.getCurrentTime() || 0);
          }}
          onProgress={({ playedSeconds }) => {
            if (!hasUser) return;
            if (Math.floor(playedSeconds) % 5 === 0 && dbVideoId)
              updateHistory.execute({
                playedSeconds: Math.floor(playedSeconds),
                videoId: dbVideoId,
              });
          }}
          config={{
            playerVars: { autoplay: 1, start: startTime },
          }}
          controls
        />
      </div>
      <div
        id="ambilight-video"
        className="pointer-events-none absolute left-0 top-0 z-[-1] size-full shadow-[0_0_120px_rgba(0,0,0,0)] blur-[80px] saturate-[300%] delay-300 duration-1000 ease-in-out animate-in fade-in zoom-in"
      >
        <ReactPlayer
          url={`https://www.youtube.com/watch?v=${videoId}`}
          muted
          ref={ambilightVideoRef}
          width="100%"
          height="100%"
          playing={videoPlaying}
          onReady={(player) => optimizeAmbilight(player.getInternalPlayer())}
          controls={false}
        />
      </div>
    </div>
  );
}
