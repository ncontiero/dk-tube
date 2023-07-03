import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";

import { SITE_NAME } from "@/utils/constants";
import { api } from "@/lib/axios";
import { VideoWithUser } from "@/utils/formatters";

import Head from "next/head";
import Link from "next/link";
import { Video } from "@/components/Video";

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

  return video ? (
    <div className="mt-2">
      <Video video={video} />
    </div>
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
