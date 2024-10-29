import type { User, Video } from "@prisma/client";
import type { LinkProps as NextLinkProps } from "next/link";
import type { AnchorHTMLAttributes } from "react";

/**
 * @description Utility type to make all properties of an object non-nullable
 */
export type CNonNullable<T> = {
  [P in keyof T]: NonNullable<T[P]>;
};
export type LinkProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  keyof NextLinkProps
> &
  Partial<NextLinkProps>;

export type VideoProps = Video & { user: User };

export interface VideoCardContextProps {
  readonly video: VideoProps | null;
}
