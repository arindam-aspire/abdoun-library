"use client";

export { DocInput as FileSelectInput } from "../DocInput";

export type {
  SelectedDocument,
  FileSelectInputProps,
  FileSelectInputSize,
} from "./types";

export {
  FILE_SELECT_ACCEPT,
  FILE_SELECT_ACCEPTED_MIME_TYPES,
  FILE_SELECT_FORMAT_LABELS,
  FILE_SELECT_SIZES,
} from "./types";

export {
  formatFileSize,
  getDocumentFileKind,
  getDocumentKindLabel,
  getDocumentKindStyles,
  getDocumentSubtitle,
  getSupportedFormatsSentence,
} from "../DocInput/utils";
