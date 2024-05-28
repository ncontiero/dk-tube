import type { VideoWithUser } from "@/utils/types";
import { VideoCard, type VideoCardVariant } from "./VideoCard";

interface ListVideosProps {
  readonly videos?: VideoWithUser[];
  readonly isFetching?: boolean;
  readonly videoCardVariant?: VideoCardVariant;
}

export function ListVideos({
  videos,
  isFetching,
  videoCardVariant = "medium",
}: ListVideosProps) {
  const skeletonItems = [1, 2, 3, 4, 5, 6];

  return (
    <div className="flex w-full grid-cols-2 flex-col gap-4 xs:grid xs:px-4 mdlg:grid-cols-3 xl:grid-cols-4">
      {isFetching || !videos
        ? skeletonItems.map((item) => (
            <div
              key={item}
              className={`relative flex w-full flex-col items-center xs:mb-4 md:mb-10 xl:max-w-[360px]`}
            >
              <div className={`z-10 w-full xs:rounded-xl`}>
                <div
                  className={`h-60 animate-pulse rounded-xl bg-zinc-800 xs:h-[200px] xs:max-w-[360px]`}
                />
              </div>
              <div
                className={`flex w-full gap-3 truncate px-2 xs:pl-0 xs:pr-6`}
              >
                <div className="mt-3">
                  <div className="relative z-10 flex size-9 rounded-full">
                    <div className="aspect-square animate-pulse rounded-full bg-zinc-800 object-cover" />
                  </div>
                </div>
                <div className="flex w-full flex-col truncate">
                  <span
                    className={`mb-1 mt-3 h-6 w-full animate-pulse truncate bg-zinc-800`}
                  />
                  <span className="z-10 h-6 w-1/2 animate-pulse bg-zinc-800 opacity-60" />
                </div>
              </div>
            </div>
          ))
        : videos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              variant={videoCardVariant}
              loading={isFetching}
            />
          ))}
    </div>
  );
}
