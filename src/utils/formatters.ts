import type { Playlist, Video, User } from "@prisma/client";

export interface UserProps {
  id: string;
  username: string;
  image: string;
}

export interface VideoWithUser extends Video {
  user: User;
}
export interface PlaylistWithUser extends Playlist {
  user: User;
  videos: VideoWithUser[];
}

export function userFormatter(user: User) {
  return {
    id: user.id,
    username: user.username,
    image: user.image,
  };
}

export function videoFormatter(video: VideoWithUser) {
  return {
    id: video.id,
    title: video.title,
    thumb: video.thumb,
    youtubeId: video.youtubeId,
    user: userFormatter(video.user),
    createdAt: video.createdAt,
  };
}

export function playlistFormatter(playlist: PlaylistWithUser) {
  return {
    id: playlist.id,
    name: playlist.name,
    isPublic: playlist.isPublic,
    user: userFormatter(playlist.user),
    videos: playlist.videos.map(videoFormatter),
    createdAt: playlist.createdAt,
  };
}
