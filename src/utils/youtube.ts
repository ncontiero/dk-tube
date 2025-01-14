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
    const { status } = await fetch(url);
    if (status === 200) {
      return url;
    }
  }
}

export function formatDuration(duration: string) {
  const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
  const matches = duration.match(regex);
  if (!matches) return "00:00";

  const hours = Number.parseInt(matches[1] || "0", 10);
  const minutes = Number.parseInt(matches[2] || "0", 10);
  const seconds = Number.parseInt(matches[3] || "0", 10);

  const formattedHours = hours > 0 ? `${hours}:` : "";
  const formattedMinutes =
    minutes > 0 || hours > 0 ? `${minutes.toString().padStart(2, "0")}:` : "";
  const formattedSeconds = seconds.toString().padStart(2, "0");

  return `${formattedHours}${formattedMinutes}${formattedSeconds}`;
}
