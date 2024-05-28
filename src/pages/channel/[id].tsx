import type {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
} from "next";
import type { UserWithVideosAndPlaylists } from "@/utils/types";

import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { userWithVideosFormatter } from "@/utils/formatters";

import { Meta } from "@/components/Meta";
import { ChannelTabs } from "@/components/ChannelTabs";

export const getStaticPaths: GetStaticPaths = async () => {
  const users = await prisma.user.findMany({
    select: { id: true },
  });
  const paths = users.map((user) => ({
    params: {
      id: user.id,
    },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<{
  user: UserWithVideosAndPlaylists;
}> = async ({ params }) => {
  if (!params?.id) {
    return {
      notFound: true,
    };
  }
  const user = (await prisma.user.findUnique({
    where: { id: typeof params.id === "string" ? params.id : params.id[0] },
    include: {
      playlists: { include: { videos: { include: { user: true } } } },
      videos: true,
    },
  })) as UserWithVideosAndPlaylists | null;

  if (!user) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      user: userWithVideosFormatter(
        JSON.parse(JSON.stringify(user)),
      ) as UserWithVideosAndPlaylists,
    },
  };
};

export default function ChannelPage({
  user,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      <Meta path={`/channel/${user.id}`} title={user.username} />
      <div className="mx-auto mt-4 flex w-full max-w-screen-2xl flex-col items-center px-4 pt-4 xs:flex-row xs:items-start">
        <div className="size-14 max-w-max xs:mb-3 xs:mr-6 xs:size-auto">
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
    </div>
  );
}
