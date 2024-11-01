"use client";

import type { LinkProps, VideoProps } from "./types";
import {
  type HTMLAttributes,
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useUser } from "@clerk/nextjs";
import Image, { type ImageProps } from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  type CardContentProps,
  type CardTitleProps,
  CardContent,
  CardImage,
  CardRoot,
  CardTitle,
} from "../Card";
import { SaveVideoPlaylistMenu } from "../SaveVideoPlaylist";

export interface VideoCardContextProps {
  readonly video: VideoProps | null;
  percentageWatched: number | undefined;
  timeWatched: number | undefined;
  userId: string | null;
}

const VideoCardContext = createContext<VideoCardContextProps>({
  video: null,
  percentageWatched: undefined,
  timeWatched: undefined,
  userId: null,
});
const useVideoCardContext = () => useContext(VideoCardContext);

export interface VideoCardRootProps extends HTMLAttributes<HTMLDivElement> {
  readonly video: VideoProps;
  readonly timeWatched?: number | undefined;
}

/**
 * VideoCard component for displaying video content in a card format.
 *
 * @example
 * <VideoCardRoot video={video}>
 *  <VideoCardThumb />
 *  <VideoCardInfo>
 *    <VideoCardChannel>
 *      <VideoCardChannelImage />
 *    </VideoCardChannel>
 *    <CardTitle />
 *    <VideoCardChannel>
 *      <VideoCardChannelName />
 *    </VideoCardChannel>
 *  </VideoCardInfo>
 * </VideoCardRoot>
 */
export const VideoCardRoot = forwardRef<HTMLDivElement, VideoCardRootProps>(
  ({ video, timeWatched: timeWatchedB, ...props }, ref) => {
    const { user } = useUser();
    const [timeWatched, setTimeWatched] = useState(timeWatchedB);

    const dbTimeWatched = useCallback(async () => {
      return await fetch(
        `/api/get-time-watched?videoId=${video.id}&userId=${user?.id}`,
      )
        .then((res) => res.json())
        .catch(console.error);
    }, [user?.id, video.id]);

    const videoDuration = video.duration
      .split(":")
      .reduce((acc, time) => acc * 60 + Number(time), 0);
    const percentageWatched = timeWatched
      ? Math.floor((timeWatched / videoDuration) * 100)
      : undefined;

    const contextValues = useMemo(
      () => ({
        video,
        percentageWatched,
        timeWatched,
        userId: user?.id || null,
      }),
      [video, percentageWatched, timeWatched, user?.id],
    );

    useEffect(() => {
      if (timeWatchedB) {
        setTimeWatched(timeWatchedB);
        return;
      }
      dbTimeWatched()
        .then((data) => setTimeWatched(data.timeWatched))
        .catch(console.error);
    }, [dbTimeWatched, timeWatchedB]);

    return (
      <VideoCardContext.Provider value={contextValues}>
        <CardRoot
          ref={ref}
          href={`/watch?v=${video.id}${timeWatched ? `&t=${timeWatched}` : ""}`}
          {...props}
        />
      </VideoCardContext.Provider>
    );
  },
);
VideoCardRoot.displayName = "VideoCardRoot";

export interface VideoCardThumbProps extends Partial<ImageProps> {
  readonly linkClassName?: string;
}

export const VideoCardThumb = forwardRef<HTMLImageElement, VideoCardThumbProps>(
  ({ linkClassName, width = 360, height = 200, ...props }, ref) => {
    const { video, percentageWatched, timeWatched } = useVideoCardContext();
    if (!video) return null;

    return (
      <Link
        href={`/watch?v=${video.id}${timeWatched ? `&t=${timeWatched}` : ""}`}
        className={cn(
          "relative z-10 w-full overflow-hidden outline-none ring-ring duration-200 hover:opacity-90 focus-visible:ring-2 xs:rounded-xl",
          linkClassName,
        )}
      >
        <CardImage
          ref={ref}
          src={video.thumb}
          alt={video.title}
          width={width}
          height={height}
          quality={100}
          {...props}
        />
        <div className="absolute bottom-2 right-2 rounded-md bg-background px-1 py-0.5 text-sm">
          {video.duration}
        </div>
        {percentageWatched ? (
          <div className="absolute bottom-0 h-1 w-full bg-foreground/50">
            <div
              style={{ width: `${percentageWatched}%` }}
              className="h-1 bg-primary"
            />
          </div>
        ) : null}
      </Link>
    );
  },
);
VideoCardThumb.displayName = "VideoCardThumb";

export const VideoCardInfo = forwardRef<HTMLDivElement, CardContentProps>(
  ({ children, ...props }, ref) => {
    const { video, userId } = useVideoCardContext();
    if (!video) return null;

    return (
      <CardContent ref={ref} {...props}>
        {children}
        {userId ? <SaveVideoPlaylistMenu videoId={video.id} /> : null}
      </CardContent>
    );
  },
);
VideoCardInfo.displayName = "VideoCardInfo";

export interface VideoCardChannelProps extends LinkProps {}

export const VideoCardChannel = forwardRef<
  HTMLAnchorElement,
  VideoCardChannelProps
>(({ className, ...props }, ref) => {
  const { video } = useVideoCardContext();
  if (!video) return null;

  return (
    <div className="z-10 size-fit">
      <Link
        ref={ref}
        href={`/channel/${video.user.id}`}
        className={cn(
          "group/channel flex items-center gap-2 outline-none ring-ring ring-offset-background duration-200 focus:ring-2 focus:ring-offset-2",
          className,
        )}
        {...props}
      />
    </div>
  );
});
VideoCardChannel.displayName = "VideoCardChannel";

export interface VideoCardChannelImageProps extends Partial<ImageProps> {}

export const VideoCardChannelImage = forwardRef<
  HTMLImageElement,
  VideoCardChannelImageProps
>(({ className, ...props }, ref) => {
  const { video } = useVideoCardContext();
  if (!video) return null;

  return (
    <Image
      ref={ref}
      src={video.user.image}
      alt={video.user.username}
      width={36}
      height={36}
      className={cn(
        "aspect-square size-full rounded-full object-cover",
        className,
      )}
      {...props}
    />
  );
});
VideoCardChannelImage.displayName = "VideoCardChannelImage";

export interface VideoCardChannelNameProps
  extends HTMLAttributes<HTMLSpanElement> {}

export const VideoCardChannelName = forwardRef<
  HTMLSpanElement,
  VideoCardChannelNameProps
>(({ className, children, ...props }, ref) => {
  const { video } = useVideoCardContext();
  if (!video) return null;

  return (
    <span
      ref={ref}
      className={cn(
        "text-sm opacity-60 duration-200 group-hover/channel:opacity-100",
        className,
      )}
      {...props}
    >
      {children || video.user.username}
    </span>
  );
});
VideoCardChannelName.displayName = "VideoCardChannelName";

export interface VideoCardTitleProps extends CardTitleProps {}

export const VideoCardTitle = forwardRef<
  HTMLHeadingElement,
  VideoCardTitleProps
>((props, ref) => {
  const { video, timeWatched } = useVideoCardContext();
  if (!video) return null;

  return (
    <Link
      href={`/watch?v=${video.id}${timeWatched ? `&t=${timeWatched}` : ""}`}
      title={video.title}
      className="z-10 size-fit rounded-md pr-6 ring-ring duration-200 hover:opacity-90 focus:outline-none focus-visible:ring-2"
    >
      <CardTitle ref={ref} {...props}>
        {video.title}
      </CardTitle>
    </Link>
  );
});
VideoCardTitle.displayName = "VideoCardTitle";
