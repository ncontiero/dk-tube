import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";

import { SITE_NAME } from "@/utils/constants";
import { api } from "@/lib/axios";
import { VideoWithUser } from "@/utils/formatters";

import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { Video } from "@/components/Video";
import { VideoCard } from "@/components/VideoCard";
import { Meta } from "@/components/Meta";

export default function WatchPage() {
  const {
    query: { v },
  } = useRouter();

  const { data: video, isFetching: isVideoFetching } =
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

  const { data: videos, isFetching: isVideosFetching } = useQuery<
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
  });

  return video ? (
    <>
      <Meta
        path={`/watch?v=${video.id}`}
        title={video.title}
        description={video.title}
        image={{ src: video.thumb, alt: video.title }}
      />
      <div className="grid w-full grid-cols-4 justify-start md:px-20">
        <div className="col-span-3 flex w-full flex-col items-center justify-center pr-6 pt-6">
          <Video videoId={video.youtubeId} />
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
        <div className="h-full w-full pt-4">
          {videos &&
            videos.map(
              (v) => v.id !== video.id && <VideoCard key={v.id} video={v} />,
            )}
        </div>
      </div>
    </>
  ) : (
    <div className="flex flex-col justify-center text-center md:min-h-[280px] md:flex-row md:justify-start md:text-start">
      <Head>
        <title>
          Não foi possível encontrar o video que você está procurando.
        </title>
      </Head>
      <section className="flex w-full flex-col text-center">
        <h1 className="mb-2 pt-10 text-2xl">
          Não foi possível encontrar o video que você está procurando.
        </h1>
        <p className="mt-2 text-lg">
          Por favor, volte para a{" "}
          <Link
            href="/"
            className="text-blue-300 underline-offset-2 hover:text-blue-200 hover:underline active:opacity-70"
          >
            página inicial do {SITE_NAME}
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
