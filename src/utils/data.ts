import { api } from "@/lib/axios";

export function transformData(data?: string) {
  if (!data) return undefined;
  const valueArray = data.split(".");
  const key = valueArray[0];
  const value = valueArray[1];
  return { column: key, value };
}

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
