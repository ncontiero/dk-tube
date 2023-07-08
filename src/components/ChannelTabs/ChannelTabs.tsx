import type { UserWithVideosAndPlaylists, VideoWithUser } from "@/utils/types";

import { useState } from "react";
import { useRouter } from "next/router";
import { useWindowDimensions } from "@/hooks/useWindowDimensions";
import { useSafePush } from "@/hooks/useSafePush";
import { userFormatter } from "@/utils/formatters";

import Link from "next/link";
import * as Tabs from "@radix-ui/react-tabs";
import { ChannelVideoCard } from "./components";
import { AnimatePresence, motion, type MotionProps } from "framer-motion";

import { ChevronDown } from "lucide-react";

interface ChannelTabsProps {
  user: UserWithVideosAndPlaylists;
}

type TabsContentProps = MotionProps & Tabs.TabsContentProps;

function TabsContent({ className, ...props }: TabsContentProps) {
  const MotionTabsContent = motion(Tabs.Content);

  return (
    <MotionTabsContent
      className={`w-full outline-none ring-purple-500 focus-visible:ring-2 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      {...props}
    />
  );
}

function TriggerButton({
  className,
  text,
  ...props
}: Tabs.TabsTriggerProps & { text: string }) {
  return (
    <Tabs.Trigger
      className={`rounded-t-lg border-b-2 border-transparent px-6 py-4 text-sm font-medium uppercase text-zinc-400 ring-purple-500 duration-200 hover:bg-zinc-800 hover:text-inherit focus:outline-none focus:ring-2 data-[state=active]:border-zinc-300 ${className}`}
      {...props}
    >
      {text}
    </Tabs.Trigger>
  );
}

export function ChannelTabs({ user }: ChannelTabsProps) {
  const [userVideos] = useState([
    ...(user.videos.map((video) => ({
      ...video,
      user: userFormatter(user),
    })) as VideoWithUser[]),
  ]);
  const {
    query: { tab },
  } = useRouter();
  const { safePush } = useSafePush();
  const [amountOfVideos, setAmountOfVideos] = useState(3);
  const { width: screenWidth } = useWindowDimensions();

  const currentTab = `${
    tab === "videos" ? "videos" : tab === "playlists" ? "playlists" : "home"
  }`;

  const tabs = [
    { value: "home", text: "Início" },
    { value: "videos", text: "Vídeos" },
    { value: "playlists", text: "Playlists" },
  ];

  return (
    <Tabs.Root
      defaultValue={currentTab}
      onValueChange={(tab) => safePush(`/channel/${user.id}?tab=${tab}`)}
      value={currentTab}
    >
      <Tabs.List className="border-b border-gray-500">
        <div className="relative mx-auto flex w-full max-w-screen-2xl xs:px-2">
          {tabs.map((tab) => (
            <TriggerButton value={tab.value} text={tab.text} key={tab.value} />
          ))}
        </div>
      </Tabs.List>
      <div className="mx-auto flex w-full max-w-screen-2xl xs:px-2">
        <AnimatePresence>
          {currentTab === "home" ? (
            <TabsContent value="home" forceMount>
              <div className="w-full pb-6 xs:max-w-5xl xs:pt-3">
                <ChannelVideoCard
                  video={userVideos[0]}
                  variant={screenWidth > 590 ? "main" : "large"}
                />
              </div>
              <div className="overflow-hidden border-t border-zinc-700 px-3 pt-6">
                <Link
                  className="font-semibold outline-none ring-purple-500 duration-200 focus-visible:ring-2"
                  href={`/channel/${user.id}?tab=videos`}
                >
                  Vídeos
                </Link>
                <div className="relative mt-3 flex w-full snap-x snap-mandatory flex-col gap-2 overflow-x-auto pb-6 xs:max-w-5xl xs:flex-row xs:gap-3 xs:pt-3">
                  {userVideos
                    .filter((video) => video.id !== userVideos[0].id)
                    .slice(0, screenWidth < 590 ? amountOfVideos : 12)
                    .map((video) => (
                      <ChannelVideoCard
                        key={video.id}
                        video={video}
                        variant="small"
                      />
                    ))}
                  {screenWidth < 590 && userVideos.length > amountOfVideos && (
                    <button
                      type="button"
                      className="flex items-center self-center rounded-full bg-zinc-900 p-2 duration-200 hover:bg-zinc-700 focus:bg-zinc-500 focus:outline-none"
                      onClick={() => setAmountOfVideos((prev) => prev + 3)}
                    >
                      <ChevronDown />
                    </button>
                  )}
                </div>
              </div>
            </TabsContent>
          ) : currentTab === "videos" ? (
            <TabsContent value="home" forceMount>
              <div className="flex w-full grid-cols-2 flex-col gap-7 pb-6 xs:grid xs:gap-4 xs:pl-1 xs:pt-3 mdlg:grid-cols-4">
                {userVideos.map((video) => (
                  <ChannelVideoCard
                    key={video.id}
                    video={video}
                    variant="large"
                  />
                ))}
              </div>
            </TabsContent>
          ) : (
            <TabsContent value="playlists" forceMount>
              <div className="flex w-full grid-cols-2 flex-col gap-7 pb-6 xs:grid xs:gap-4 xs:pl-1 xs:pt-3 mdlg:grid-cols-4">
                {user.playlists.map((playlist) => (
                  <div key={playlist.id} className="h-full">
                    <h3>{playlist.name}</h3>
                  </div>
                ))}
              </div>
            </TabsContent>
          )}
        </AnimatePresence>
      </div>
    </Tabs.Root>
  );
}
