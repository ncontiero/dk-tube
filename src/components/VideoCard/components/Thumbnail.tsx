import type { VideoWithUser } from "@/utils/formatters";
import Image from "next/image";
import Link from "next/link";

export type VideoCardVariant = "large" | "medium" | "small";

interface ThumbnailProps {
  video: VideoWithUser;
  variant?: VideoCardVariant;
}

export function Thumbnail({ video, variant }: ThumbnailProps) {
  return (
    <Link
      href={`/watch?v=${video.id}`}
      className={`z-10 w-full ${
        variant === "large" ? "rounded-xl" : "h-24 w-40 rounded-md"
      } outline-none ring-purple-400 duration-200 hover:opacity-90 focus:ring-2`}
    >
      {variant === "large" ? (
        <Image
          src={video.thumb}
          alt={video.title}
          width={360}
          height={200}
          className={`aspect-video w-full rounded-xl object-cover`}
        />
      ) : (
        <Image
          src={video.thumb}
          alt={video.title}
          className={`mr-0 aspect-video h-24 w-40 rounded-md object-cover`}
          width={168}
          height={94}
        />
      )}
    </Link>
  );
}
