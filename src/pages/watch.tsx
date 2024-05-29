import type { VideoWithUser } from "@/utils/types";

import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import { useWindowDimensions } from "@/hooks/useWindowDimensions";
import { api } from "@/lib/axios";
import { Video } from "@/components/Video";
import { VideoCard } from "@/components/VideoCard";
import { Meta } from "@/components/Meta";
import { PageError } from "@/components/PageError";

export default function WatchPage() {
  const skeletonItems = [1, 2, 3, 4, 5, 6];
  const ref = useRef<HTMLDivElement>(null);
  const { width: screenWidth } = useWindowDimensions();

  const {
    query: { v },
  } = useRouter();

  const { data: video, isFetching: isFetchingVideo } =
    useQuery<VideoWithUser | null>({
      queryKey: ["watch", v],
      queryFn: async () => {
        try {
          return (await api.get(`/videos/${v}`)).data || null;
        } catch (error) {
          console.error(error);
          return null;
        }
      },
      staleTime: 1000 * 60 * 5,
    });

  const { data: videos, isFetching: isFetchingVideos } = useQuery<
    VideoWithUser[]
  >({
    queryKey: ["videos"],
    queryFn: async () => {
      try {
        return (await api.get("/videos")).data || [];
      } catch (error) {
        console.error(error);
        return [];
      }
    },
    staleTime: 1000 * 60 * 5,
  });

  return isFetchingVideo || isFetchingVideos ? (
    <div className="grid grid-cols-1 px-0 md:px-20 xl:grid-cols-3">
      <div className="col-span-2 flex w-full flex-col items-center pt-6 mdlg:pb-0 mdlg:pr-6">
        <div className="fixed inset-x-0 top-14 z-20 h-screen max-h-[30%] w-full animate-pulse bg-secondary xs:max-h-[40%] sm:top-16 md:relative md:inset-x-auto md:top-auto md:z-auto md:mt-0 md:max-h-[50%] lg:max-h-[60%]" />
        {screenWidth < 768 && <div className="mt-[235px] xs:mt-[320px]" />}
        <div className="mb-6 mt-4 flex w-full flex-col justify-start px-4 mdlg:px-0">
          <span className="h-8 w-1/2 animate-pulse bg-secondary" />
          <div className="mt-3.5 flex gap-2 overflow-hidden mdlg:gap-4">
            <div
              style={{
                width: screenWidth > 778 ? 48 : 34,
                height: screenWidth > 778 ? 48 : 34,
              }}
              className="aspect-square animate-pulse rounded-full bg-secondary object-cover"
            />
            <span className="h-8 w-[15%] animate-pulse self-center bg-secondary mdlg:self-auto" />
          </div>
        </div>
      </div>
      {(screenWidth < 768 || screenWidth > 1279) && (
        <div
          className={`size-full pt-0.5 ${screenWidth > 580 && "px-4 md:px-0"}`}
        >
          <div
            className={`size-full pt-4 ${screenWidth > 580 && "px-4 md:px-0"}`}
          >
            {skeletonItems.map((item) => (
              <VideoCard
                loading
                key={item}
                video={null}
                variant={screenWidth > 580 ? "medium" : "largeVertical"}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  ) : video && !isFetchingVideo ? (
    <>
      <Meta
        path={`/watch?v=${video.id}`}
        title={video.title}
        description={video.title}
        image={{ src: video.thumb, alt: video.title, isExternalImage: true }}
      />
      <div className="grid grid-cols-1 px-0 md:px-20 xl:grid-cols-3">
        <div className="col-span-2 flex w-full flex-col items-center justify-center pt-6 mdlg:pb-0 mdlg:pr-6">
          <div
            className={`relative -mt-6 md:mt-0 md:size-full`}
            style={
              screenWidth <= 778
                ? {
                    height: ref.current?.offsetHeight || `${100}px`,
                    width: `${screenWidth}px`,
                  }
                : {}
            }
          >
            <div
              ref={ref}
              className="fixed inset-x-0 top-14 z-20 w-full sm:top-16 md:relative md:inset-x-auto md:top-auto md:z-auto"
            >
              <Video videoId={video.youtubeId} />
            </div>
          </div>
          <div className="mb-6 mt-4 flex w-full flex-col justify-start px-4 mdlg:px-0">
            <h1 className="text-2xl font-semibold">{video.title}</h1>
            <div>
              <div className="mt-3.5 flex gap-2 overflow-hidden mdlg:gap-4">
                <Link
                  href={`/channel/${video.user.id}`}
                  className="outline-none ring-ring duration-200 hover:opacity-90 focus:ring-2"
                >
                  <Image
                    src={video.user.image}
                    alt={video.user.username}
                    width={screenWidth > 778 ? 48 : 34}
                    height={screenWidth > 778 ? 48 : 34}
                    className="aspect-square rounded-full object-cover"
                  />
                </Link>
                <Link
                  href={`/channel/${video.user.id}`}
                  className="self-center truncate text-lg outline-none ring-ring duration-200 hover:opacity-90 focus:ring-2 mdlg:self-auto mdlg:text-xl mdlg:font-semibold"
                >
                  {video.user.username}
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div
          className={`size-full pt-4 ${screenWidth > 580 && "px-4 md:px-0"}`}
        >
          {videos
            ? videos.map(
                (v) =>
                  v.id !== video.id && (
                    <VideoCard
                      key={v.id}
                      video={v}
                      variant={screenWidth > 580 ? "medium" : "largeVertical"}
                    />
                  ),
              )
            : null}
        </div>
      </div>
    </>
  ) : (
    <PageError title="Não foi possível encontrar o video que você está procurando." />
  );
}
