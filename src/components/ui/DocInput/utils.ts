import { DOC_INPUT_FORMAT_LABELS, type DocInputDocument } from "./types";

export function getDropzoneSupportLabel(
  formats: readonly string[] = DOC_INPUT_FORMAT_LABELS,
  maxFileSizeLabel?: string,
): string {
  const formatList =
    formats.length <= 1
      ? formats[0] ?? ""
      : `${formats.slice(0, -1).join(", ")} and ${formats[formats.length - 1]}`;

  const sizeSuffix = maxFileSizeLabel ? ` (${maxFileSizeLabel})` : "";

  return `Support for ${formatList}${sizeSuffix}`;
}

export function getSupportedFormatsSentence(
  formats: readonly string[] = DOC_INPUT_FORMAT_LABELS,
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

export type DocumentFileKind = "pdf" | "doc" | "docx" | "file";

const DOCUMENT_KIND_LABELS: Record<DocumentFileKind, string> = {
  pdf: "PDF",
  doc: "DOC",
  docx: "DOCX",
  file: "FILE",
};

const DOCUMENT_KIND_STYLES: Record<DocumentFileKind, string> = {
  pdf: "bg-danger/10 text-danger border-danger/20",
  doc: "bg-primary-light text-primary-dark border-primary/20",
  docx: "bg-secondary-light/60 text-secondary border-secondary/20",
  file: "bg-page text-muted border-secondary/15",
};

export function getDocumentFileKind(
  name: string,
  mimeType?: string,
): DocumentFileKind {
  const extension = name.split(".").pop()?.toLowerCase();

  if (extension === "pdf" || mimeType === "application/pdf") {
    return "pdf";
  }

  if (extension === "doc" || mimeType === "application/msword") {
    return "doc";
  }

  if (
    extension === "docx" ||
    mimeType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    return "docx";
  }

  return "file";
}

export function getDocumentKindLabel(kind: DocumentFileKind): string {
  return DOCUMENT_KIND_LABELS[kind];
}

export function getDocumentKindStyles(kind: DocumentFileKind): string {
  return DOCUMENT_KIND_STYLES[kind];
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

export function getDocumentSubtitle(document: DocInputDocument): string | null {
  if (document.size == null) {
    return null;
  }

  return formatFileSize(document.size);
}
