import type { ChannelVideoCardVariant } from "./types";
import type { VideoWithUser } from "@/utils/types";

import Image from "next/image";
import Link from "next/link";

interface ChannelVideoThumbProps {
  readonly video: VideoWithUser;
  readonly variant?: ChannelVideoCardVariant;
}

export function ChannelVideoThumb({
  video,
  variant = "main",
}: ChannelVideoThumbProps) {
  return (
    <Link
      href={`/watch?v=${video.id}`}
      className={`relative z-10 w-full ${
        variant === "large"
          ? "xs:rounded-xl"
          : variant === "small"
            ? "h-[90px] w-40 xs:h-[118px] xs:w-[220px]"
            : "h-[138px] w-[246px]"
      } outline-none ring-ring duration-200 hover:opacity-90 focus:ring-2`}
    >
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
