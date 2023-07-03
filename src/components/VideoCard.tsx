import { VideoWithUser } from "@/utils/formatters";
import Image from "next/image";
import Link from "next/link";

export type VideoCardVariant = "large" | "medium" | "small";

interface VideoCardProps {
  video: VideoWithUser;
  variant?: VideoCardVariant;
}

export function VideoCard({ video, variant = "medium" }: VideoCardProps) {
  return (
    <div className="relative flex w-full flex-col items-center xs:mb-4 md:mb-10 xl:max-w-[360px]">
      <Link
        href={`/watch?v=${video.id}`}
        className="absolute z-[5] -m-1 h-[105%] w-[102%] rounded-xl outline-none duration-200 focus:bg-zinc-600/50"
      />
      <Link
        href={`/watch?v=${video.id}`}
        className="z-10 w-full rounded-xl outline-none ring-purple-400 duration-200 hover:opacity-90 focus:ring-2"
      >
        <Image
          src={video.thumb}
          alt={video.title}
          width={360}
          height={200}
          className="w-full rounded-xl"
        />
      </Link>
      <div className="flex w-full gap-3 px-2 xs:pl-0 xs:pr-6">
        <div className="mt-3">
          <Link
            href={`/channel/${video.user.id}`}
            className="relative z-10 flex h-9 w-9 rounded-full outline-none ring-purple-400 duration-200 hover:opacity-80 focus:ring-2"
          >
            <Image
              src={video.user.image}
              alt={video.user.username}
              className="aspect-square rounded-full object-cover"
              fill
            />
          </Link>
        </div>
        <div className="flex flex-col overflow-hidden">
          <Link
            href={`/watch?v=${video.id}`}
            className="z-10 outline-none ring-purple-400 duration-200 hover:opacity-80 focus:ring-2"
          >
            <h3 className="mb-1 mt-3 truncate">{video.title}</h3>
          </Link>
          <Link
            className="z-10 w-max opacity-60 outline-none ring-purple-400 duration-200 hover:opacity-100 focus:ring-2"
            href={`/channel/${video.user.id}`}
          >
            {video.user.username}
          </Link>
        </div>
      </div>
    </div>
  );
}
