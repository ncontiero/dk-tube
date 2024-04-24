import type { User, Video } from "@prisma/client";
import type {
  PlaylistWithUser,
  PlaylistWithVideos,
  UserWithVideosAndPlaylists,
  VideoWithUser,
} from "./types";

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
    videos: playlist.videos.map((v) => videoFormatter(v)),
    createdAt: playlist.createdAt,
  };
}

function simplePlaylistFormatter(playlist: PlaylistWithVideos) {
  return {
    id: playlist.id,
    name: playlist.name,
    isPublic: playlist.isPublic,
    videos: playlist.videos.map((v) => videoFormatter(v)),
    createdAt: playlist.createdAt,
  };
}

export function simpleVideoFormatter(video: Video) {
  return {
    id: video.id,
    title: video.title,
    thumb: video.thumb,
    youtubeId: video.youtubeId,
    createdAt: video.createdAt,
  };
}

export function userWithVideosFormatter(user: UserWithVideosAndPlaylists) {
  return {
    id: user.id,
    username: user.username,
    image: user.image,
    videos: user.videos.map((v) => simpleVideoFormatter(v)),
    playlists: user.playlists.map((p) => simplePlaylistFormatter(p)),
  };
}

export function searchedUserFormatter(user: User) {
  return {
    id: user.id,
    label: user.username,
    image: user.image,
    user: null,
  };
}
export function searchedVideoFormatter(video: VideoWithUser) {
  return {
    id: video.id,
    label: video.title,
    image: video.thumb,
    user: userFormatter(video.user),
  };
}
