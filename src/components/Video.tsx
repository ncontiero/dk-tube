"use client";

import { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
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

  const videoRef = useRef<HTMLVideoElement>(null);
  const ambilightVideoRef = useRef<HTMLVideoElement>(null);

  const updateHistory = useAction(updateHistoryAction);

  useEffect(() => {
    if (!ambilightVideoRef.current) return;
    ambilightVideoRef.current.currentTime = videoCurrentTime;
  }, [videoCurrentTime]);

  return (
    <div className="relative flex size-full justify-center">
      <div
        id="video"
        className="z-999 aspect-video size-full overflow-hidden md:rounded-xl"
      >
        <ReactPlayer
          ref={videoRef}
          src={`https://www.youtube.com/watch?v=${videoId}`}
          width="100%"
          height="100%"
          onPlay={() => {
            setVideoPlaying(true);
            setVideoCurrentTime(videoRef.current?.currentTime || 0);
          }}
          onPause={() => {
            setVideoPlaying(false);
            setVideoCurrentTime(videoRef.current?.currentTime || 0);
          }}
          onProgress={({ currentTarget: { currentTime } }) => {
            setVideoCurrentTime(currentTime);
            if (!hasUser) return;
            if (Math.floor(currentTime) % 5 === 0 && dbVideoId)
              updateHistory.execute({
                playedSeconds: Math.floor(currentTime),
                videoId: dbVideoId,
              });
          }}
          autoPlay={!!startTime}
          config={startTime ? { youtube: { start: startTime } } : {}}
          controls
        />
      </div>
      <div
        id="ambilight-video"
        className={`
          animate-in fade-in zoom-in pointer-events-none absolute top-0 left-0 z-[-1] size-full
          shadow-[0_0_120px_rgba(0,0,0,0)] blur-[80px] saturate-300 delay-300 duration-1000 ease-in-out
        `}
      >
        <ReactPlayer
          src={`https://www.youtube.com/watch?v=${videoId}`}
          ref={ambilightVideoRef}
          muted
          width="100%"
          height="100%"
          controls={false}
          playing={videoPlaying}
        />
      </div>
    </div>
  );
}
