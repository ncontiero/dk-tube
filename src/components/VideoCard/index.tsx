"use client";

import type { CNonNullable, LinkProps, VideoCardContextProps } from "./types";
import {
  type HTMLAttributes,
  createContext,
  forwardRef,
  useContext,
  useMemo,
} from "react";

import Image, { type ImageProps } from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

const VideoCardContext = createContext<VideoCardContextProps>({ video: null });
const useVideoCardContext = () => useContext(VideoCardContext);

export interface VideoCardRootProps
  extends HTMLAttributes<HTMLDivElement>,
    CNonNullable<VideoCardContextProps> {}

export const VideoCardRoot = forwardRef<HTMLDivElement, VideoCardRootProps>(
  ({ video, className, children, ...props }, ref) => {
    const contextValues = useMemo(
      () => ({
        video,
      }),
      [video],
    );

    return (
      <VideoCardContext.Provider value={contextValues}>
        <div
          ref={ref}
          className={cn(
            "group/video-card relative flex w-full flex-col",
            className,
          )}
          {...props}
        >
          <Link
            href={`/watch?v=${video.id}`}
            className="absolute inset-0 z-[5] -my-1 rounded-xl outline-none duration-200 focus-within:bg-zinc-600/30 group-active/video-card:bg-zinc-600/30 xs:-m-1"
          />
          <div className="absolute inset-0 z-[4] -my-1 rounded-xl duration-300 group-hover/video-card:bg-primary/20 xs:-m-1" />
          {children}
        </div>
      </VideoCardContext.Provider>
    );
  },
);
VideoCardRoot.displayName = "VideoCardRoot";

export interface VideoCardThumbProps extends Partial<ImageProps> {
  readonly linkClassName?: string;
}

export const VideoCardThumb = forwardRef<HTMLImageElement, VideoCardThumbProps>(
  ({ className, linkClassName, width = 360, height = 200, ...props }, ref) => {
    const { video } = useVideoCardContext();
    if (!video) return null;

    return (
      <Link
        href={`/watch?v=${video.id}`}
        className={cn(
          "relative z-10 w-full outline-none ring-ring duration-200 hover:opacity-90 focus:ring-2 xs:rounded-xl",
          linkClassName,
        )}
      >
        <Image
          src={video.thumb}
          alt={video.title}
          ref={ref}
          width={width}
          height={height}
          quality={100}
          className={cn(
            "aspect-video w-full object-cover xs:rounded-xl",
            className,
          )}
          {...props}
        />
      </Link>
    );
  },
);
VideoCardThumb.displayName = "VideoCardThumb";

export interface VideoCardInfoProps extends HTMLAttributes<HTMLDivElement> {}

export const VideoCardInfo = forwardRef<HTMLDivElement, VideoCardInfoProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("mt-3 flex w-full gap-2 px-2 md:px-0", className)}
        {...props}
      />
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

export interface VideoCardTitleProps
  extends HTMLAttributes<HTMLHeadingElement> {
  readonly titleMaxChars?: number;
}

export const VideoCardTitle = forwardRef<
  HTMLHeadingElement,
  VideoCardTitleProps
>(({ className, titleMaxChars = 40, ...props }, ref) => {
  const { video } = useVideoCardContext();
  if (!video) return null;

  return (
    <Link
      href={`/watch?v=${video.id}`}
      title={video.title}
      className="z-10 size-fit rounded-md ring-ring duration-200 hover:opacity-90 focus:outline-none focus:ring-2"
    >
      <h3
        className={cn(
          "max-h-12 overflow-hidden px-0.5 text-sm font-semibold md:text-base",
          className,
        )}
        ref={ref}
        {...props}
      >
        {video.title.length > titleMaxChars
          ? `${video.title.slice(0, titleMaxChars)}...`
          : video.title}
      </h3>
    </Link>
  );
});
VideoCardTitle.displayName = "VideoCardTitle";
