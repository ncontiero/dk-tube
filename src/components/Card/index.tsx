import { type HTMLAttributes, forwardRef } from "react";
import Image, { type ImageProps } from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface CardRootProps extends HTMLAttributes<HTMLDivElement> {
  readonly href?: string;
}

/**
 * Card component for displaying content in a card format.
 *
 * @example
 * <CardRoot>
 *  <CardImage src="/img.png" alt="Card Image" width={300} height={200} />
 *  <CardContent>
 *    <CardTitle>Title</CardTitle>
 *  </CardContent>
 * </CardRoot>
 */
export const CardRoot = forwardRef<HTMLDivElement, CardRootProps>(
  ({ className, children, href, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("group/card relative flex w-full flex-col", className)}
        {...props}
      >
        {href ? (
          <>
            <Link
              href={href}
              className="absolute inset-0 z-[5] -my-1 rounded-xl outline-none duration-200 focus-visible:bg-zinc-600/30 group-active/card:bg-zinc-600/30 xs:-m-1"
            />
            <div className="absolute inset-0 z-[4] -my-1 rounded-xl duration-300 group-hover/card:bg-primary/20 xs:-m-1" />
          </>
        ) : null}
        {children}
      </div>
    );
  },
);
CardRoot.displayName = "CardRoot";

export interface CardImageProps extends ImageProps {}

export const CardImage = forwardRef<HTMLImageElement, CardImageProps>(
  ({ className, ...props }, ref) => {
    return (
      <Image
        ref={ref}
        className={cn(
          "aspect-video w-full object-cover xs:rounded-xl",
          className,
        )}
        {...props}
      />
    );
  },
);
CardImage.displayName = "CardImage";

export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {}

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative mt-3 flex w-full gap-2 px-2 md:px-0",
          className,
        )}
        {...props}
      />
    );
  },
);
CardContent.displayName = "CardContent";

export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  readonly titleMaxChars?: number;
}

export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, children, titleMaxChars = 40, ...props }, ref) => {
    return (
      <h3
        ref={ref}
        className={cn(
          "max-h-12 overflow-hidden px-0.5 text-sm font-semibold xs:text-base",
          className,
        )}
        {...props}
      >
        {typeof children === "string" && children.length > titleMaxChars
          ? `${children.slice(0, titleMaxChars)}...`
          : children}
      </h3>
    );
  },
);
CardTitle.displayName = "CardTitle";
