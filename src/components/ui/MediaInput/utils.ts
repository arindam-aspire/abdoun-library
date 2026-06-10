import {
  MEDIA_INPUT_FORMAT_LABELS,
  type SelectedMedia,
} from "./types";

export type MediaFileKind = "image" | "video" | "file";

const IMAGE_EXTENSIONS = new Set(["jpg", "jpeg", "png", "webp", "gif"]);
const VIDEO_EXTENSIONS = new Set(["mp4", "mov", "webm"]);

export function getSupportedFormatsSentence(
  formats: readonly string[] = MEDIA_INPUT_FORMAT_LABELS,
): string {
  if (formats.length === 0) {
    return "";
  }

  if (formats.length === 1) {
    return `Supported format: ${formats[0]}.`;
  }

  if (formats.length === 2) {
    return `Supported formats: ${formats[0]} and ${formats[1]}.`;
  }

  const lastFormat = formats[formats.length - 1];
  const leadingFormats = formats.slice(0, -1).join(", ");

  return `Supported formats: ${leadingFormats}, and ${lastFormat}.`;
}

export function getMediaFileKind(
  name: string,
  mimeType?: string,
): MediaFileKind {
  const extension = name.split(".").pop()?.toLowerCase();

  if (
    mimeType?.startsWith("image/") ||
    (extension && IMAGE_EXTENSIONS.has(extension))
  ) {
    return "image";
  }

  if (
    mimeType?.startsWith("video/") ||
    (extension && VIDEO_EXTENSIONS.has(extension))
  ) {
    return "video";
  }

  return "file";
}

export function isImageMedia(media: SelectedMedia): boolean {
  return getMediaFileKind(media.name, media.mimeType) === "image";
}

export function isVideoMedia(media: SelectedMedia): boolean {
  return getMediaFileKind(media.name, media.mimeType) === "video";
}

const MEDIA_KIND_LABELS: Record<MediaFileKind, string> = {
  image: "IMG",
  video: "MP4",
  file: "FILE",
};

const MEDIA_KIND_STYLES: Record<MediaFileKind, string> = {
  image: "bg-primary-light/50 text-primary-dark border-primary/15",
  video: "bg-warning/10 text-warning border-warning/20",
  file: "bg-page text-muted border-secondary/15",
};

export function getMediaKindLabel(kind: MediaFileKind): string {
  return MEDIA_KIND_LABELS[kind];
}

export function getMediaKindStyles(kind: MediaFileKind): string {
  return MEDIA_KIND_STYLES[kind];
}

export function getPreviewUriForFile(file: File): string {
  if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
    return URL.createObjectURL(file);
  }

  return "";
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function isAcceptedMediaFile(file: File, accept: string): boolean {
  const extension = file.name.split(".").pop()?.toLowerCase();

  if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
    return true;
  }

  if (extension && accept.includes(`.${extension}`)) {
    return true;
  }

  return false;
}

export function toSelectedMedia(file: File, uri: string): SelectedMedia {
  return {
    name: file.name,
    uri,
    mimeType: file.type || undefined,
    size: file.size,
  };
}
