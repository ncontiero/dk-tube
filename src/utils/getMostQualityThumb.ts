import { api } from "@/lib/axios";

export async function getMostQualityThumb(youtubeId: string) {
  const baseThumbUrl = `https://i.ytimg.com/vi/${youtubeId}/`;
  const thumbQuality = [
    "maxresdefault",
    "sddefault",
    "hqdefault",
    "mqdefault",
    "default",
  ];

  for (const quality of thumbQuality) {
    const url = `${baseThumbUrl}${quality}.jpg`;
    const { status } = await api.get(url);
    if (status === 200) {
      return url;
    }
  }
}
