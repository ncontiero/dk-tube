import type { UserWithVideosAndPlaylists } from "@/utils/types";

import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/axios";

import { Meta } from "@/components/Meta";
import Image from "next/image";
import { PageError } from "@/components/PageError";
import { ChannelTabs } from "@/components/ChannelTabs";

export default function ChannelPage() {
  const {
    query: { id },
  } = useRouter();

  const { data: user, isFetching: isFetchingUser } =
    useQuery<UserWithVideosAndPlaylists | null>({
      queryKey: ["channel", id],
      queryFn: async () => {
        try {
          return (await api.get(`/users/${id}`)).data || null;
        } catch (error) {
          console.error(error);
          return null;
        }
      },
      staleTime: 1000 * 60 * 5,
    });

  return (
    <div className="flex flex-col gap-4">
      {isFetchingUser ? (
        <div>loading...</div>
      ) : user ? (
        <>
          <Meta path={`/channel/${id}`} title={user.username} />
          <div className="mx-auto mt-4 flex w-full max-w-screen-2xl flex-col items-center px-4 pt-4 xs:flex-row xs:items-start">
            <div className="h-14 w-14 max-w-max xs:mb-3 xs:mr-6 xs:h-auto xs:w-auto">
              <Image
                src={user.image}
                alt={user.username}
                width={128}
                height={128}
                className="aspect-square rounded-full object-cover"
              />
            </div>
            <div className="mt-2 flex flex-col items-center xs:mt-4 xs:items-start">
              <div>
                <h1 className="text-2xl font-semibold">{user.username}</h1>
              </div>
              <span className="text-sm opacity-90">
                {user.videos.length} vídeos
              </span>
            </div>
          </div>
          <ChannelTabs user={user} />
        </>
      ) : (
        <PageError title="Não foi possível encontrar o canal que você está procurando." />
      )}
    </div>
  );
}
