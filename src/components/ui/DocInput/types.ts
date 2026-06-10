import type { ReactNode } from "react";
import type { UiSizeTier } from "../responsiveSizes";

export type DocInputDocument = {
  name: string;
  uri: string;
  mimeType?: string;
  size?: number;
};

export const DOC_INPUT_SIZES = ["sm", "md", "lg"] as const;

export type DocInputSize = (typeof DOC_INPUT_SIZES)[number];

export const DOC_INPUT_ACCEPTED_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
] as const;

export const DOC_INPUT_ACCEPT =
  ".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";

export const DOC_INPUT_FORMAT_LABELS = ["PDF", "DOC", "DOCX"] as const;

export type UploadQueueItemStatus =
  | "uploading"
  | "processing"
  | "completed"
  | "error";

export interface DocInputProps {
  label?: ReactNode;
  labelClassName?: string;
  value: DocInputDocument[];
  onChange: (documents: DocInputDocument[]) => void;
  onUpload?: (file: File) => Promise<string | null>;
  multiple?: boolean;
  accept?: string;
  size?: DocInputSize;
  error?: string;
  hint?: string;
  isRequired?: boolean;
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
  wrapperClassName?: string;
  dropzoneTitle?: string;
  dropzoneDescription?: string;
  browseLabel?: string;
  uploadingLabel?: string;
  queueTitle?: string;
  uploadingStatusLabel?: string;
  processingStatusLabel?: string;
  name?: string;
}

export type { UiSizeTier };
