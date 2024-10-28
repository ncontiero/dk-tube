import type { Metadata, ResolvingMetadata } from "next";
import { cache } from "react";
import { Bookmark } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SaveVideoPlaylistDialog } from "@/components/SaveVideoPlaylist";
import { Button } from "@/components/ui/Button";
import { DialogTrigger } from "@/components/ui/Dialog";
import { Separator } from "@/components/ui/Separator";
import { Video } from "@/components/Video";
import {
  VideoCardChannel,
  VideoCardChannelImage,
  VideoCardChannelName,
  VideoCardInfo,
  VideoCardRoot,
  VideoCardThumb,
  VideoCardTitle,
} from "@/components/VideoCard";
import { prisma } from "@/lib/prisma";

type WatchPageProps = {
  readonly searchParams: Promise<{ v: string }>;
};

const getVideos = cache(async () => {
  return await prisma.video.findMany({
    include: { user: true },
  });
});

export async function generateMetadata(
  { searchParams }: WatchPageProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const videoId = (await searchParams).v;
  if (!videoId) return notFound();

  const video = (await getVideos()).find((video) => video.id === videoId);
  if (!video) return notFound();

  const videoUrl = `${(await parent).metadataBase}watch?v=${video.id}`;

  return {
    title: video.title,
    alternates: {
      canonical: videoUrl,
    },
    openGraph: {
      title: video.title,
      url: videoUrl,
      images: { url: video.thumb, alt: video.title },
    },
    twitter: {
      card: "summary_large_image",
      title: video.title,
      images: { url: video.thumb, alt: video.title },
    },
  };
}

export default async function WatchPage({ searchParams }: WatchPageProps) {
  const videoId = (await searchParams).v;
  if (!videoId) return notFound();

  const videos = await getVideos();
  const video = videos.find((video) => video.id === videoId);
  if (!video) return notFound();

  return (
    <div className="my-6 grid grid-cols-1 px-0 md:px-20 xl:grid-cols-4 xl:px-24">
      <div className="col-span-3 flex w-full flex-col items-center justify-center xl:pb-0 xl:pr-6">
        <div className="-mt-7 size-full md:-mt-1">
          <div className="inset-x-0 w-full">
            <Video videoId={video.youtubeId} />
          </div>
        </div>
        <div className="mb-4 mt-3 flex w-full flex-col justify-start px-4 mdlg:px-0">
          <h1 className="z-10 text-base font-semibold md:text-lg mdlg:text-xl">
            {video.title}
          </h1>
          <div className="flex items-center justify-between">
            <div className="mt-4 flex gap-2 mdlg:mt-3 mdlg:gap-3">
              <Link
                href={`/channel/${video.user.id}`}
                className="rounded-full outline-none ring-ring duration-200 hover:opacity-90 focus:ring-2"
              >
                <Image
                  src={video.user.image}
                  alt={video.user.username}
                  width={40}
                  height={40}
                  className="aspect-square rounded-full object-cover"
                />
              </Link>
              <Link
                href={`/channel/${video.user.id}`}
                className="size-fit self-center truncate rounded-md px-0.5 outline-none ring-ring duration-200 hover:opacity-90 focus:ring-2 mdlg:self-auto mdlg:font-semibold"
              >
                {video.user.username}
              </Link>
            </div>
            <div>
              <SaveVideoPlaylistDialog videoId={video.id}>
                <DialogTrigger asChild>
                  <Button
                    type="button"
                    variant="transparent"
                    className="gap-1 rounded-full"
                  >
                    <Bookmark size={20} />
                    <span className="text-sm">Salvar</span>
                  </Button>
                </DialogTrigger>
              </SaveVideoPlaylistDialog>
            </div>
          </div>
        </div>
      </div>
      <div className="flex size-full flex-col gap-6 xs:gap-2.5 xs:px-4 md:px-0">
        <Separator className="mt-3 xl:hidden" />
        {videos
          .filter((v) => v.id !== video.id)
          .map((v) => (
            <VideoCardRoot
              key={v.id}
              video={v}
              className="mt-3 gap-1 xs:mt-0 xs:flex-row"
            >
              <VideoCardThumb linkClassName="xs:max-h-[94px] xs:max-w-[168px]" />
              <VideoCardInfo className="xs:mt-0.5">
                <VideoCardChannel className="size-9 rounded-full xs:hidden md:mt-1">
                  <VideoCardChannelImage />
                </VideoCardChannel>
                <div className="flex flex-col">
                  <VideoCardTitle />
                  <VideoCardChannel className="mt-1 size-fit rounded-md px-0.5 md:mt-0.5">
                    <VideoCardChannelName className="md:text-sm" />
                  </VideoCardChannel>
                </div>
              </VideoCardInfo>
            </VideoCardRoot>
          ))}
      </div>
    </div>
  );
}
