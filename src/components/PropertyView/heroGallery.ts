import propertyFallbackImage from "@/assets/property-fallback-image.svg";

export type HeroGalleryImageItem = {
  type: "image";
  src: string;
};

export type HeroGalleryVideoItem = {
  type: "video";
  url: string;
  poster: string;
};

export type HeroGalleryItem = HeroGalleryImageItem | HeroGalleryVideoItem;

export function getPrimaryVideoUrl(
  videos: string[] = [],
  virtualTourUrl?: string | null,
): string | null {
  const video = videos.find((entry) => entry?.trim());
  return video ?? virtualTourUrl ?? null;
}

export function getVideoEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const id = parsed.pathname.slice(1).split("/")[0];
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }

    if (host === "youtube.com" || host === "m.youtube.com") {
      const id = parsed.searchParams.get("v");
      if (id) {
        return `https://www.youtube.com/embed/${id}`;
      }

      const shortsMatch = parsed.pathname.match(/^\/shorts\/([^/]+)/);
      if (shortsMatch?.[1]) {
        return `https://www.youtube.com/embed/${shortsMatch[1]}`;
      }
    }

    if (host === "vimeo.com") {
      const id = parsed.pathname.split("/").filter(Boolean)[0];
      return id ? `https://player.vimeo.com/video/${id}` : null;
    }
  } catch {
    return null;
  }

  return null;
}

export function buildHeroGallery(
  images: string[],
  videos: string[] = [],
  virtualTourUrl?: string | null,
): HeroGalleryItem[] {
  const videoUrl = getPrimaryVideoUrl(videos, virtualTourUrl);

  const items: HeroGalleryItem[] =
    images.length > 0
      ? images.map((src) => ({ type: "image", src }))
      : [{ type: "image", src: propertyFallbackImage }];

  const poster = items[0]?.type === "image" ? items[0].src : propertyFallbackImage;

  if (videoUrl) {
    items.push({ type: "video", url: videoUrl, poster });
  }

  return items;
}

export function getHeroImageSources(gallery: HeroGalleryItem[]): string[] {
  return gallery
    .filter((item): item is HeroGalleryImageItem => item.type === "image")
    .map((item) => item.src);
}
