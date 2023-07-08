import type { VideoWithUser } from "@/utils/types";

import Image from "next/image";
import Link from "next/link";

type ChannelVideoCardVariant = "main" | "large" | "small";

interface ChannelVideoCardProps {
  video: VideoWithUser;
  loading?: boolean;
  variant?: ChannelVideoCardVariant;
}

function ChannelVideoThumb({ video, variant = "main" }: ChannelVideoCardProps) {
  return (
    <Link
      href={`/watch?v=${video.id}`}
      className={`relative z-10 w-full ${
        variant === "large"
          ? "xs:rounded-xl"
          : variant === "small"
          ? "h-[90px] w-40 xs:h-[118px] xs:w-[220px]"
          : "h-[138px] w-[246px]"
      } outline-none ring-purple-400 duration-200 hover:opacity-90 focus:ring-2`}
    >
      <div
        className="absolute inset-0 -z-[5] bg-cover bg-center bg-no-repeat blur-lg xs:rounded-xl"
        style={{
          backgroundImage: `url(${video.thumb})`,
        }}
      />
      {variant === "large" ? (
        <Image
          src={video.thumb}
          alt={video.title}
          width={360}
          height={200}
          className="aspect-video w-full object-cover xs:rounded-xl"
        />
      ) : variant === "small" ? (
        <Image
          src={video.thumb}
          alt={video.title}
          width={220}
          height={118}
          className="aspect-video h-[90px] w-40 rounded-md object-cover xs:h-[118px] xs:w-[220px]"
        />
      ) : (
        <Image
          src={video.thumb}
          alt={video.title}
          className="mr-0 aspect-video h-[138px] w-[246px] rounded-md object-cover"
          width={246}
          height={138}
        />
      )}
    </Link>
  );
}

export function ChannelVideoCard({
  video,
  variant = "main",
  loading = false,
}: ChannelVideoCardProps) {
  return (
    <div
      className={`relative flex w-full ${
        variant === "large"
          ? "flex-col xs:mb-4 md:mb-10 xl:max-w-[360px]"
          : variant === "small"
          ? "w-full pb-2 xs:max-w-[220px] xs:flex-col"
          : "mt-2 gap-2"
      } items-center`}
    >
      <Link
        href={`/watch?v=${video.id}`}
        className={`absolute z-[5] xs:-m-1 ${
          variant === "large"
            ? "h-[105%] w-[102%] xs:h-[108%] xs:rounded-xl sm:h-[110%] md:h-[115%]"
            : variant === "small"
            ? "-ml-1 h-[103%] w-full rounded-xl xs:h-[110%] xs:w-[105%]"
            : "h-[105%] w-full xs:rounded-xl"
        } outline-none duration-200 focus:bg-zinc-600/30`}
      />
      {variant === "large" ? (
        <ChannelVideoThumb video={video} variant="large" />
      ) : variant === "small" ? (
        <div className="z-10 min-h-[90px] min-w-[160px] xs:min-h-[118px] xs:min-w-[200px]">
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
          className="z-10 w-full px-2 outline-none ring-purple-400 duration-200 hover:opacity-80 focus:ring-2 xs:px-0"
        >
          <h3
            className={`truncate ${
              variant === "large" || variant === "small"
                ? "text-md font-medium"
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
