import type { VideoWithUser } from "@/utils/formatters";
import Image from "next/image";
import Link from "next/link";

import { useCallback, useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player/youtube";

export type VideoProps = {
  video: VideoWithUser;
};

export function Video({ video }: VideoProps) {
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [videoCurrentTime, setVideoCurrentTime] = useState(0);
  const { youtubeId: videoId } = video;

  const videoRef = useRef<ReactPlayer>(null);
  const ambilightVideoRef = useRef<ReactPlayer>(null);

  const optimizeAmbilight = useCallback((player?: Record<string, any>) => {
    if (!player || !player.getAvailableQualityLevels) return;
    const qualityLevels: string[] = [...player.getAvailableQualityLevels()];
    if (qualityLevels && qualityLevels.length && qualityLevels.length > 0) {
      qualityLevels.reverse();
      const lowestLevel =
        qualityLevels[qualityLevels.findIndex((q) => q !== "auto")];
      player.setPlaybackQuality(lowestLevel);
    }
  }, []);

  useEffect(() => {
    if (ambilightVideoRef.current) {
      ambilightVideoRef.current.seekTo(videoCurrentTime, "seconds");
      optimizeAmbilight(ambilightVideoRef.current.getInternalPlayer());
    }
  }, [optimizeAmbilight, videoCurrentTime]);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-center pr-6 pt-6">
      <div className="ml-6 h-full w-full">
        <div className="h-full w-full">
          <div className="relative flex h-full w-full justify-center">
            <div id="video" className="aspect-video h-full w-full rounded-lg">
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
                controls
              />
            </div>
            <div
              id="ambilight-video"
              className="pointer-events-none absolute left-0 top-0 -z-[1] h-full w-full scale-125 opacity-50 shadow-[0_0_120px_rgba(0,0,0,0)] blur-[80px] saturate-[300%]"
            >
              <ReactPlayer
                url={`https://www.youtube.com/watch?v=${videoId}`}
                muted
                ref={ambilightVideoRef}
                width="100%"
                height="100%"
                playing={videoPlaying}
                onReady={(player) =>
                  optimizeAmbilight(player.getInternalPlayer())
                }
                controls={false}
              />
            </div>
          </div>
          <div className="mb-6 mt-4 flex w-full flex-col justify-start">
            <h1 className="text-2xl font-semibold">{video.title}</h1>
            <div>
              <div className="mt-3.5 flex gap-4 overflow-hidden">
                <Link
                  href={`/channel/${video.user.id}`}
                  className="outline-none ring-purple-400 duration-200 hover:opacity-90 focus:ring-2"
                >
                  <Image
                    src={video.user.image}
                    alt={video.user.username}
                    width={48}
                    height={48}
                    className="aspect-square rounded-full object-cover"
                  />
                </Link>
                <Link
                  href={`/channel/${video.user.id}`}
                  className="truncate text-xl font-semibold outline-none ring-purple-400 duration-200 hover:opacity-90 focus:ring-2"
                >
                  {video.user.username}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
