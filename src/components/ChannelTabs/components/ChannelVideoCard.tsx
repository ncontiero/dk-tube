import type { VideoWithUser } from "@/utils/types";
import type { ChannelVideoCardVariant } from "./types";

import Link from "next/link";
import { ChannelVideoThumb } from ".";

interface ChannelVideoCardProps {
  readonly video: VideoWithUser;
  // readonly loading?: boolean;
  readonly variant?: ChannelVideoCardVariant;
}

export function ChannelVideoCard({
  video,
  variant = "main",
}: ChannelVideoCardProps) {
  return (
    <div
      className={`relative flex w-full ${
        variant === "large"
          ? "xs:mb-4 flex-col md:mb-10 xl:max-w-[360px]"
          : variant === "small"
            ? "xs:max-w-[220px] xs:flex-col w-full"
            : "mt-2 gap-2"
      } items-center`}
    >
      <Link
        href={`/watch?v=${video.id}`}
        className={`xs:-m-1 absolute z-[5] ${
          variant === "large"
            ? "xs:h-[108%] xs:rounded-xl h-[105%] w-[102%] sm:h-[110%] md:h-[115%]"
            : variant === "small"
              ? "xs:h-[115%] xs:w-[103%] -ml-1 h-[110%] w-full rounded-xl"
              : "xs:rounded-xl h-[105%] w-full"
        } outline-none duration-200 focus:bg-zinc-600/30`}
      />
      {variant === "large" ? (
        <ChannelVideoThumb video={video} variant="large" />
      ) : variant === "small" ? (
        <div className="xs:min-h-[118px] xs:min-w-[200px] z-10 min-h-[90px] min-w-[160px]">
          <ChannelVideoThumb video={video} variant="small" />
        </div>
      ) : (
        <div className="z-10 min-h-[120px] min-w-[210px]">
          <ChannelVideoThumb video={video} variant="main" />
        </div>
      )}
      <div
        className={`${
          variant === "large" || variant === "small" ? "mt-2" : "mt-1"
        } flex w-full flex-col self-start truncate`}
      >
        <Link
          href={`/watch?v=${video.id}`}
          className="xs:px-0 z-10 w-full px-2 outline-none ring-purple-400 duration-200 hover:opacity-80 focus:ring-2"
        >
          <h3
            className={`truncate ${
              variant === "large" || variant === "small"
                ? "text-base font-medium"
                : "text-lg font-semibold"
            }`}
          >
            {video.title}
          </h3>
        </Link>
        {variant !== "large" && variant !== "small" && (
          <Link
            className="z-10 max-w-max truncate text-sm font-medium text-zinc-400 outline-none ring-purple-400 duration-200 hover:text-zinc-200 focus:ring-2"
            href={`/channel/${video.user.id}`}
          >
            {video.user.username}
          </Link>
        )}
      </div>
    </div>
  );
}
