import type { Metadata, ResolvingMetadata } from "next";
import { currentUser } from "@clerk/nextjs/server";
import { Lock } from "lucide-react";
import { unstable_cache } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { CardImage, CardRoot, CardTitle } from "@/components/Card";
import { ScrollArea, ScrollBar } from "@/components/ui/ScrollArea";
import { Separator } from "@/components/ui/Separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import {
  VideoCardChannel,
  VideoCardChannelName,
  VideoCardInfo,
  VideoCardRoot,
  VideoCardThumb,
  VideoCardTitle,
} from "@/components/VideoCard";
import { prisma } from "@/lib/prisma";

type ChannelPageProps = {
  readonly params: { id: string[] };
};

const getChannels = unstable_cache(
  async () => {
    return await prisma.user.findMany({
      include: { videos: true, playlists: { include: { videos: true } } },
      omit: { externalId: false },
    });
  },
  ["channels"],
  { revalidate: 60 },
);

export async function generateMetadata(
  { params }: ChannelPageProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const channelId = params.id[0];
  if (!channelId) return notFound();

  const channel = (await getChannels()).find(
    (channel) => channel.id === channelId,
  );
  if (!channel) return notFound();

  const channelUrl = `${(await parent).metadataBase}channel/${channel.id}`;

  return {
    title: channel.username,
    alternates: {
      canonical: channelUrl,
    },
    openGraph: {
      title: channel.username,
      url: channelUrl,
      type: "profile",
      images: { url: channel.image, alt: channel.username },
    },
    twitter: {
      card: "summary_large_image",
      title: channel.username,
      images: { url: channel.image, alt: channel.username },
    },
  };
}

export async function generateStaticParams() {
  const channels = await getChannels();

  return channels.map((channel) => ({
    id: [channel.id],
  }));
}

export default async function ChannelPage({ params }: ChannelPageProps) {
  const user = await currentUser();
  const channel = (await getChannels()).find(
    (channel) => channel.id === params.id[0],
  );
  if (!channel) return notFound();

  const tabs = [
    { value: "home", label: "Início" },
    { value: "videos", label: "Vídeos" },
    { value: "playlists", label: "Playlists" },
  ];
  const mainVideo = channel.videos[0];
  const videos = channel.videos.slice(1);
  const initialTab = (tabs.find((tab) => tab.value === params.id[1]) ??
    tabs[0])!.value;

  const channelHasVideos = channel.videos.length > 0 && !!mainVideo;
  const channelHasPlaylists = channel.playlists.length > 0;
  const channelHasContent = channelHasVideos || channelHasPlaylists;

  if (initialTab === "videos" && !channelHasVideos)
    redirect(`/channel/${channel.id}/home`);
  if (initialTab === "playlists" && !channelHasPlaylists)
    redirect(`/channel/${channel.id}/home`);

  return (
    <div className="flex flex-col gap-4">
      <div className="mx-auto mt-4 flex w-full max-w-screen-2xl flex-col items-center px-4 pt-4 xs:flex-row xs:items-start">
        <div className="size-14 max-w-max xs:mb-3 xs:mr-6 xs:size-auto">
          <Image
            src={channel.image}
            alt={channel.username}
            width={128}
            height={128}
            className="aspect-square rounded-full object-cover"
          />
        </div>
        <div className="mt-2 flex flex-col items-center xs:mt-4 xs:items-start">
          <div>
            <h1 className="text-2xl font-semibold">{channel.username}</h1>
          </div>
          <span className="text-sm opacity-90">
            {channel.videos.length} vídeos
          </span>
        </div>
      </div>
      {!channelHasContent ? (
        <div className="mb-6 mt-10 flex justify-center text-center">
          <p>Este canal não tem nenhum conteúdo</p>
        </div>
      ) : (
        <Tabs defaultValue={initialTab}>
          <TabsList className="h-auto w-full rounded-none border-b border-secondary bg-transparent p-0">
            <ScrollArea className="w-full">
              <div className="relative mx-auto flex w-full max-w-screen-2xl pt-4 xs:px-2">
                {tabs
                  .filter(
                    (tab) =>
                      channelHasVideos ||
                      (tab.value !== "videos" && tab.value !== "home"),
                  )
                  .filter(
                    (tab) => channelHasPlaylists || tab.value !== "playlists",
                  )
                  .map((tab) => (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className="rounded-none rounded-t-lg border-b border-transparent px-6 py-4 text-sm font-medium uppercase text-foreground/80 duration-200 hover:bg-secondary hover:text-foreground data-[state=active]:border-foreground hover:data-[state=active]:bg-secondary"
                      asChild
                    >
                      <Link href={`/channel/${channel.id}/${tab.value}`}>
                        {tab.label}
                      </Link>
                    </TabsTrigger>
                  ))}
              </div>
              <ScrollBar orientation="horizontal" className="invisible" />
            </ScrollArea>
          </TabsList>
          <TabsContent
            value="home"
            className="mx-auto flex size-full max-w-screen-2xl flex-col xs:px-2"
          >
            {mainVideo ? (
              <>
                <div className="mt-2 w-full xs:max-w-3xl">
                  <VideoCardRoot
                    video={{ ...mainVideo, user: channel }}
                    className="gap-3 pb-4 xs:flex-row xs:pb-0"
                  >
                    <VideoCardThumb linkClassName="xs:max-h-[150px] xs:max-w-[250px]" />
                    <VideoCardInfo className="mt-0 px-0">
                      <div className="flex w-full px-2 xs:mt-0.5 xs:flex-col xs:px-0.5">
                        <VideoCardTitle
                          titleMaxChars={90}
                          className="max-h-none overflow-auto text-base md:text-lg"
                        />
                        <VideoCardChannel className="mt-1 hidden size-fit rounded-md px-0.5 xs:flex md:mt-0.5">
                          <VideoCardChannelName className="md:text-sm" />
                        </VideoCardChannel>
                      </div>
                    </VideoCardInfo>
                  </VideoCardRoot>
                </div>
                <Separator className="mb-4 mt-2 xs:mb-4 xs:mt-6" />
              </>
            ) : null}
            <div className="px-3">
              <Link
                className="text-lg font-bold outline-none ring-ring duration-200 hover:opacity-80 focus-visible:ring-2"
                href={`/channel/${channel.id}/videos`}
              >
                Vídeos
              </Link>
              <ScrollArea className="mt-4">
                <div className="flex flex-col gap-3 p-1 xs:flex-row xs:gap-2">
                  {videos.slice(0, 5).map((video) => (
                    <VideoCardRoot
                      key={video.id}
                      video={{ ...video, user: channel }}
                      className="flex-row xs:w-[210px] xs:flex-col xs:pb-4"
                    >
                      <VideoCardThumb
                        className="rounded-xl"
                        linkClassName="rounded-xl xs:max-h-[118px] xs:max-w-[210px]"
                        width={210}
                        height={118}
                      />
                      <VideoCardInfo className="mt-1 md:px-0.5">
                        <VideoCardTitle
                          titleMaxChars={32}
                          className="text-base"
                        />
                      </VideoCardInfo>
                    </VideoCardRoot>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>
          </TabsContent>
          {channelHasVideos ? (
            <TabsContent
              value="videos"
              className="mx-auto my-2 flex size-full max-w-screen-2xl flex-col flex-wrap gap-4 px-2 xs:flex-row"
            >
              {[mainVideo!, ...videos].map((video) => (
                <VideoCardRoot
                  key={video.id}
                  video={{ ...video, user: channel }}
                  className="flex-row xs:max-w-[300px] xs:flex-col xs:pb-2"
                >
                  <VideoCardThumb
                    linkClassName="rounded-xl xs:max-h-[180px] xs:max-w-[300px]"
                    className="rounded-xl"
                    width={300}
                    height={180}
                  />
                  <VideoCardInfo className="mt-0 xs:mt-2">
                    <div className="flex flex-col">
                      <VideoCardTitle className="text-base" />
                    </div>
                  </VideoCardInfo>
                </VideoCardRoot>
              ))}
            </TabsContent>
          ) : null}
          <TabsContent
            value="playlists"
            className="mx-auto mt-0 flex size-full max-w-screen-2xl flex-col px-2"
          >
            <h3 className="mb-4">Playlist criadas</h3>
            <div className="flex flex-wrap gap-4">
              {channel.playlists.map((playlist) => {
                if (user?.id !== channel.externalId && !playlist.isPublic) {
                  return null;
                }
                const href = playlist.videos[0]
                  ? `/watch?v=${playlist.videos[0].id}`
                  : `/playlist/${playlist.id}`;
                return (
                  <CardRoot
                    href={href}
                    key={playlist.id}
                    className="flex-row gap-0.5 xs:max-w-[300px] xs:flex-col xs:gap-1.5 xs:pb-4"
                  >
                    <Link
                      href={href}
                      className="relative z-10 rounded-xl outline-none ring-ring duration-200 focus-visible:ring-2 xs:max-h-[180px] xs:max-w-[300px]"
                    >
                      <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-background/80 text-sm font-semibold uppercase opacity-0 duration-300 group-hover/card:opacity-100 xs:text-base">
                        Reproduzir tudo
                      </div>
                      <CardImage
                        src={
                          playlist.videos[0]
                            ? playlist.videos[0].thumb
                            : "/playlist-img.jpg"
                        }
                        quality={100}
                        alt={`Reproduzir ${playlist.name}`}
                        width={300}
                        height={180}
                        className="rounded-xl"
                      />
                    </Link>
                    <div className="flex w-full flex-col px-1">
                      <Link
                        href={href}
                        title={playlist.name}
                        className="z-10 size-fit rounded-md ring-ring duration-200 hover:opacity-90 focus:outline-none focus-visible:ring-2"
                      >
                        <CardTitle className="text-base">
                          {playlist.name}
                        </CardTitle>
                      </Link>
                      <Link
                        href={`/playlist/${playlist.id}`}
                        className="z-10 mt-2 flex w-fit items-center gap-1 rounded-md text-xs text-foreground/60 ring-primary duration-200 hover:text-foreground focus:outline-none focus-visible:text-foreground focus-visible:ring-2 xs:text-sm"
                      >
                        Ver playlist completa
                        {!playlist.isPublic && (
                          <span title="Privada">
                            <Lock className="size-4 text-yellow-500" />
                          </span>
                        )}
                      </Link>
                    </div>
                  </CardRoot>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
