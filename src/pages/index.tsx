import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { VideoWithUser } from "@/utils/formatters";

import { ListVideos } from "@/components/ListVideos";
import { Meta } from "@/components/Meta";

export default function HomePage() {
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

  return (
    <>
      <Meta
        path="/"
        description="Aproveite vídeos e músicas que você ama, envie e compartilhe conteúdo original com amigos, parentes e o mundo no DkTube."
        image={{ src: "/logo.png", alt: "Logo do DkTube" }}
      />
      <div className="my-4 flex w-full justify-center gap-4 xs:mt-6 xs:max-w-screen-2xl md:mx-auto xl:mt-12">
        <ListVideos
          videos={videos}
          isFetching={isFetchingVideos}
          videoCardVariant="large"
        />
      </div>
    </>
  );
}
