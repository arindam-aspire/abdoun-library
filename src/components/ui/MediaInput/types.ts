import type { ReactNode } from "react";
import type { UiSizeTier } from "../responsiveSizes";

export type SelectedMedia = {
  name: string;
  uri: string;
  /** Local blob URL kept for queue thumbnails when `uri` is not browser-displayable. */
  previewUri?: string;
  mimeType?: string;
  size?: number;
  is_primary?: boolean;
  display_order?: number;
};

export const MEDIA_INPUT_SIZES = ["sm", "md", "lg"] as const;

export type MediaInputSize = (typeof MEDIA_INPUT_SIZES)[number];

export const MEDIA_INPUT_ACCEPTED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "video/mp4",
  "video/quicktime",
  "video/webm",
] as const;

export const MEDIA_INPUT_ACCEPT =
  "image/jpeg,image/png,image/webp,image/gif,video/mp4,video/quicktime,video/webm,.jpg,.jpeg,.png,.webp,.gif,.mp4,.mov,.webm";

export const MEDIA_INPUT_FORMAT_LABELS = [
  "JPG",
  "PNG",
  "WEBP",
  "GIF",
  "MP4",
  "MOV",
] as const;

export type UploadQueueItemStatus =
  | "uploading"
  | "processing"
  | "completed"
  | "error";

export interface MediaInputProps {
  label?: ReactNode;
  labelClassName?: string;
  value: SelectedMedia[];
  onChange: (media: SelectedMedia[]) => void;
  /** Fired when a committed media item is removed from the queue. */
  onRemove?: (media: SelectedMedia) => void;
  onUpload?: (file: File) => Promise<string | null>;
  /** Fired when any file enters or leaves the in-flight upload queue. */
  onUploadingChange?: (isUploading: boolean) => void;
  multiple?: boolean;
  accept?: string;
  size?: MediaInputSize;
  error?: string;
  hint?: string;
  isRequired?: boolean;
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
  wrapperClassName?: string;
  name?: string;
  dropzoneTitle?: string;
  dropzoneDescription?: string;
  browseLabel?: string;
  uploadingLabel?: string;
  queueTitle?: string;
  uploadingStatusLabel?: string;
  processingStatusLabel?: string;
  readyStatusLabel?: string;
  generatingPreviewLabel?: string;
  processingFooterLabel?: string;
  showPrimaryAction?: boolean;
  primaryActionLabel?: string;
  onSetPrimary?: (media: SelectedMedia) => void;
}

export type { UiSizeTier };
