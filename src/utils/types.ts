import type { Playlist, User, Video } from "@prisma/client";

/**
 * @description Utility type to make all properties of an object non-nullable
 */
export type CNonNullable<T> = {
  [P in keyof T]: NonNullable<T[P]>;
};

export type VideoProps = Video & { user: User };

export type PlaylistProps = {
  user: User;
  videos: VideoProps[];
} & Playlist;
