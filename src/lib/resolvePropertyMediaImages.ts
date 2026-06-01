type OrderedMediaImage = {
  order: number;
  url?: string;
  thumb_url?: string;
};

export type ResolvedMediaImage = {
  displayUrl: string;
  fullUrl: string;
};

function getImageOrder(image: unknown): number {
  if (image && typeof image === "object" && "order" in image) {
    const order = Number((image as { order?: number }).order);
    return Number.isFinite(order) ? order : 0;
  }
  return 0;
}

function resolveMediaImage(image: unknown): ResolvedMediaImage | null {
  if (typeof image === "string") {
    const url = image.trim();
    return url ? { displayUrl: url, fullUrl: url } : null;
  }

  if (image && typeof image === "object") {
    const record = image as OrderedMediaImage;
    const fullUrl = record.url?.trim() ?? "";
    const thumbUrl = record.thumb_url?.trim() ?? "";
    const displayUrl = thumbUrl || fullUrl;

    if (!displayUrl) {
      return null;
    }

    return {
      displayUrl,
      fullUrl: fullUrl || displayUrl,
    };
  }

  return null;
}

export function resolveMediaImages(
  images: unknown[] | undefined,
  thumbnail?: string | null,
): ResolvedMediaImage[] {
  if (Array.isArray(images) && images.length > 0) {
    const resolved = [...images]
      .sort((a, b) => getImageOrder(a) - getImageOrder(b))
      .map(resolveMediaImage)
      .filter((item): item is ResolvedMediaImage => item != null);

    if (resolved.length > 0) {
      return resolved;
    }
  }

  const fallback = thumbnail?.trim();
  return fallback ? [{ displayUrl: fallback, fullUrl: fallback }] : [];
}

export function pickDisplayUrls(items: ResolvedMediaImage[]): string[] {
  return items.map((item) => item.displayUrl);
}

export function pickFullUrls(items: ResolvedMediaImage[]): string[] {
  return items.map((item) => item.fullUrl);
}

export function preloadImage(url: string): void {
  if (!url || typeof window === "undefined") {
    return;
  }

  const image = new window.Image();
  image.decoding = "async";
  image.src = url;
}
