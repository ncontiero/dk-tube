import { VideoWithUser } from "@/utils/formatters";
import { VideoCard, VideoCardVariant } from "./VideoCard/VideoCard";

interface ListVideosProps {
  videos?: VideoWithUser[];
  isFetching?: boolean;
  videoCardVariant?: VideoCardVariant;
}

export function ListVideos({
  videos,
  isFetching,
  videoCardVariant = "medium",
}: ListVideosProps) {
  const skeletonItems = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  return (
    <div className="flex w-full grid-cols-2 flex-col gap-4 xs:grid xs:px-4 mdlg:grid-cols-3 xl:grid-cols-4">
      {!videos || isFetching
        ? skeletonItems.map((i) => <div key={i}></div>)
        : videos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              variant={videoCardVariant}
            />
          ))}
    </div>
  );
}
