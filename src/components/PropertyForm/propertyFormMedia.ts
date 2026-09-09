import { isImageMedia } from "../ui/MediaInput/utils";
import type { PropertyMediaFile } from "./types";

function mediaIdentity(media: PropertyMediaFile): string {
  return `${media.uri}::${media.name}`;
}

export function getImageMediaFiles(
  mediaFiles: PropertyMediaFile[],
): PropertyMediaFile[] {
  return mediaFiles.filter((media) => isImageMedia(media));
}

export function normalizePropertyMediaFiles(
  mediaFiles: PropertyMediaFile[],
): PropertyMediaFile[] {
  const images = getImageMediaFiles(mediaFiles);
  const currentPrimary = images.find((media) => media.is_primary);

  return mediaFiles.map((media, index) => {
    const isImage = isImageMedia(media);
    const isPrimary = isImage
      ? currentPrimary
        ? mediaIdentity(media) === mediaIdentity(currentPrimary)
        : mediaIdentity(media) === mediaIdentity(images[0]!)
      : false;

    return {
      ...media,
      is_primary: isImage ? isPrimary : false,
      display_order: media.display_order ?? index,
    };
  });
}

export function setPrimaryPropertyMedia(
  mediaFiles: PropertyMediaFile[],
  primary: PropertyMediaFile,
): PropertyMediaFile[] {
  if (!isImageMedia(primary)) {
    return normalizePropertyMediaFiles(mediaFiles);
  }

  const next = mediaFiles.map((media) => ({
    ...media,
    is_primary: isImageMedia(media)
      ? mediaIdentity(media) === mediaIdentity(primary)
      : false,
  }));

  return normalizePropertyMediaFiles(next);
}

export function sortPropertyMediaForDisplay(
  mediaFiles: PropertyMediaFile[],
): PropertyMediaFile[] {
  return [...mediaFiles].sort((left, right) => {
    const leftPrimary = left.is_primary ? 0 : 1;
    const rightPrimary = right.is_primary ? 0 : 1;

    if (leftPrimary !== rightPrimary) {
      return leftPrimary - rightPrimary;
    }

    return (left.display_order ?? 0) - (right.display_order ?? 0);
  });
}
