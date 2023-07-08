import type { UserWithVideosAndPlaylists, VideoWithUser } from "@/utils/types";

import { useState } from "react";
import { useWindowDimensions } from "@/hooks/useWindowDimensions";
import { userFormatter } from "@/utils/formatters";

import * as Tabs from "@radix-ui/react-tabs";
import { ChannelVideoCard } from "./ChannelVideoCard";

interface ChannelTabsProps {
  user: UserWithVideosAndPlaylists;
}

export function ChannelTabs({ user }: ChannelTabsProps) {
  const [userVideos] = useState([
    ...(user.videos.map((video) => ({
      ...video,
      user: userFormatter(user),
    })) as VideoWithUser[]),
  ]);
  const { width: screenWidth } = useWindowDimensions();

  return (
    <Tabs.Root defaultValue="home">
      <Tabs.List className="border-b border-gray-500">
        <div className="mx-auto flex w-full max-w-screen-2xl xs:px-2">
          <Tabs.Trigger
            value="home"
            className="border-b-2 border-transparent px-6 py-4 text-sm font-medium uppercase text-zinc-400 ring-purple-500 duration-200 hover:bg-zinc-800 hover:text-inherit focus:outline-none focus:ring-2 data-[state=active]:border-zinc-300"
          >
            Início
          </Tabs.Trigger>
          <Tabs.Trigger
            value="videos"
            className="border-b-2 border-transparent px-6 py-4 text-sm font-medium uppercase text-zinc-400 ring-purple-500 duration-200 hover:bg-zinc-800 hover:text-inherit focus:outline-none focus:ring-2 data-[state=active]:border-zinc-300"
          >
            Vídeos
          </Tabs.Trigger>
        </div>
      </Tabs.List>
      <div className="mx-auto flex w-full max-w-screen-2xl xs:px-2">
        <Tabs.Content
          value="home"
          className="w-full outline-none ring-purple-500 focus-visible:ring-2"
        >
          <div className="w-full pb-6 xs:max-w-5xl xs:pt-3">
            <ChannelVideoCard
              video={userVideos[0]}
              variant={screenWidth > 590 ? "main" : "large"}
            />
          </div>
          <div className="h-px bg-zinc-700" />
          <div className="mt-6 overflow-hidden px-3">
            <h2 className="font-semibold">Vídeos</h2>
            <div className="mt-3 flex w-full flex-col gap-3 pb-6 xs:max-w-5xl xs:flex-row xs:pt-3">
              {userVideos.map(
                (video) =>
                  video.id !== userVideos[0].id && (
                    <ChannelVideoCard
                      key={video.id}
                      video={video}
                      variant="small"
                    />
                  ),
              )}
            </div>
          </div>
        </Tabs.Content>
        <Tabs.Content
          value="videos"
          className="w-full outline-none ring-purple-500 focus-visible:ring-2"
        >
          <div className="flex w-full grid-cols-2 flex-col gap-7 pb-6 xs:grid xs:gap-4 xs:pl-1 xs:pt-3 mdlg:grid-cols-4">
            {userVideos.map((video) => (
              <ChannelVideoCard key={video.id} video={video} variant="large" />
            ))}
          </div>
        </Tabs.Content>
      </div>
    </Tabs.Root>
  );
}
