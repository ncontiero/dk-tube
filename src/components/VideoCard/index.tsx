"use client";

import type { CNonNullable, LinkProps, VideoCardContextProps } from "./types";
import {
  type HTMLAttributes,
  createContext,
  forwardRef,
  useContext,
  useMemo,
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

const VideoCardContext = createContext<VideoCardContextProps>({ video: null });
const useVideoCardContext = () => useContext(VideoCardContext);

export interface VideoCardRootProps
  extends HTMLAttributes<HTMLDivElement>,
    CNonNullable<VideoCardContextProps> {}

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
  ({ video, ...props }, ref) => {
    const contextValues = useMemo(() => ({ video }), [video]);

    return (
      <VideoCardContext.Provider value={contextValues}>
        <CardRoot ref={ref} href={`/watch?v=${video.id}`} {...props} />
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
    const { video } = useVideoCardContext();
    if (!video) return null;

    return (
      <Link
        href={`/watch?v=${video.id}`}
        className={cn(
          "relative z-10 w-full outline-none ring-ring duration-200 hover:opacity-90 focus-visible:ring-2 xs:rounded-xl",
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
      </Link>
    );
  },
);
VideoCardThumb.displayName = "VideoCardThumb";

export const VideoCardInfo = forwardRef<HTMLDivElement, CardContentProps>(
  ({ children, ...props }, ref) => {
    const { video } = useVideoCardContext();
    const { isLoaded, isSignedIn } = useUser();
    if (!video) return null;

    return (
      <CardContent ref={ref} {...props}>
        {children}
        {isLoaded && isSignedIn ? (
          <SaveVideoPlaylistMenu video={video} />
        ) : null}
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
  const { video } = useVideoCardContext();
  if (!video) return null;

  return (
    <Link
      href={`/watch?v=${video.id}`}
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
