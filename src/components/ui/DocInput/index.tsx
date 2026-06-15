"use client";

import { Field, Label } from "@headlessui/react";
import { CheckCircle2, CloudUpload, Loader2, X } from "lucide-react";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
} from "react";
import { cn } from "../../../lib/cn";
import { textBodySmClasses, textMetaClasses } from "../../../lib/typography";
import { inheritOutlineFocusVisibleClasses } from "../fieldVariants";
import {
  docInputDropzoneSizeClasses,
  docInputIconWrapSizeClasses,
  fieldErrorSizeClasses,
  fieldHintSizeClasses,
  fieldLabelSizeClasses,
} from "../responsiveSizes";
import {
  DOC_INPUT_ACCEPT,
  DOC_INPUT_ACCEPTED_MIME_TYPES,
  DOC_INPUT_FORMAT_LABELS,
  type DocInputDocument,
  type DocInputProps,
  type DocInputSize,
  type UploadQueueItemStatus,
} from "./types";
import {
  formatFileSize,
  getDocumentFileKind,
  getDocumentKindLabel,
  getDocumentKindStyles,
  getSupportedFormatsSentence,
} from "./utils";

type InFlightQueueItem = {
  id: string;
  document: DocInputDocument;
  status: UploadQueueItemStatus;
  progress: number;
};

type DropzoneHandlers = {
  onBrowse: () => void;
  onDragEnter: (event: DragEvent<HTMLElement>) => void;
  onDragLeave: (event: DragEvent<HTMLElement>) => void;
  onDragOver: (event: DragEvent<HTMLElement>) => void;
  onDrop: (event: DragEvent<HTMLElement>) => void;
};

function isAcceptedFile(file: File, accept: string): boolean {
  const extension = file.name.split(".").pop()?.toLowerCase();

  if (
    extension &&
    [".pdf", ".doc", ".docx"].some((item) => accept.includes(item))
  ) {
    if (extension === "pdf" || extension === "doc" || extension === "docx") {
      return true;
    }
  }

  return DOC_INPUT_ACCEPTED_MIME_TYPES.includes(
    file.type as (typeof DOC_INPUT_ACCEPTED_MIME_TYPES)[number],
  );
}

function toDocument(file: File, uri: string): DocInputDocument {
  return {
    name: file.name,
    uri,
    mimeType: file.type || undefined,
    size: file.size,
  };
}

function createQueueId(): string {
  return `queue-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function documentsMatch(a: DocInputDocument, b: DocInputDocument): boolean {
  return a.uri === b.uri && a.name === b.name;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

type DocInputDropzoneProps = DropzoneHandlers & {
  inputId: string;
  size: DocInputSize;
  disabled?: boolean;
  isUploading?: boolean;
  isDragOver?: boolean;
  hasError?: boolean;
  title: string;
  description: string;
  browseLabel: string;
  uploadingLabel: string;
};

function DocInputDropzone({
  inputId,
  size,
  disabled = false,
  isUploading = false,
  isDragOver = false,
  hasError = false,
  title,
  description,
  browseLabel,
  uploadingLabel,
  onBrowse,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
}: DocInputDropzoneProps) {
  return (
    <button
      type="button"
      id={inputId}
      disabled={disabled || isUploading}
      onClick={onBrowse}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className={cn(
        "group relative flex w-full flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed text-center transition-all duration-200",
        docInputDropzoneSizeClasses[size],
        "border-secondary/25 bg-page-ghost/60",
        "hover:border-primary/35 hover:bg-primary-light/30",
        isDragOver &&
          "scale-[1.01] border-primary bg-primary-light/40 ring-4 ring-primary/10",
        isUploading && "pointer-events-none border-primary/30 bg-primary-light/20",
        hasError && "border-danger/40 hover:border-danger/50",
        disabled && "cursor-not-allowed opacity-50",
        inheritOutlineFocusVisibleClasses,
      )}
    >
      <span
        className={cn(
          "pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200",
          "bg-[radial-gradient(circle_at_top,var(--color-primary-light),transparent_55%)]",
          (isDragOver || isUploading) && "opacity-100",
        )}
        aria-hidden
      />

      <span
        className={cn(
          "relative inline-flex items-center justify-center rounded-2xl border border-primary/10 bg-surface shadow-sm transition-transform duration-200",
          docInputIconWrapSizeClasses[size],
          "group-hover:scale-105",
          isDragOver && "scale-105 border-primary/25",
        )}
      >
        {isUploading ? (
          <Loader2
            className="size-5 animate-spin text-primary sm:size-6"
            aria-hidden
          />
        ) : (
          <CloudUpload
            className="size-5 text-primary transition-colors sm:size-6"
            aria-hidden
          />
        )}
      </span>

      <span className="relative mt-3 flex max-w-sm flex-col items-center gap-1">
        <span className={cn("font-semibold text-secondary", textBodySmClasses)}>
          {isUploading ? uploadingLabel : title}
        </span>

        {!isUploading ? (
          <span className={cn("text-muted", textBodySmClasses)}>
            {description}{" "}
            <span className="font-medium text-primary-dark underline decoration-primary/30 underline-offset-2">
              {browseLabel}
            </span>
          </span>
        ) : null}

        {!isUploading ? (
          <span className={cn("mt-1 text-muted", textMetaClasses)}>
            {getSupportedFormatsSentence(DOC_INPUT_FORMAT_LABELS)}
          </span>
        ) : null}
      </span>
    </button>
  );
}

type UploadProgressBarProps = {
  progress: number;
  status: UploadQueueItemStatus;
};

function UploadProgressBar({ progress, status }: UploadProgressBarProps) {
  const isComplete = status === "completed";
  const isError = status === "error";

  return (
    <div
      className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-secondary/10"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={progress}
    >
      <div
        className={cn(
          "h-full rounded-full transition-all duration-300 ease-out",
          isComplete && "bg-success",
          isError && "bg-danger",
          !isComplete && !isError && "bg-primary",
        )}
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      />
    </div>
  );
}

type UploadQueueFileIconProps = {
  document: DocInputDocument;
};

function UploadQueueFileIcon({ document }: UploadQueueFileIconProps) {
  const kind = getDocumentFileKind(document.name, document.mimeType);

  return (
    <span
      className={cn(
        "inline-flex size-11 shrink-0 items-center justify-center rounded-lg border sm:size-12",
        getDocumentKindStyles(kind),
      )}
    >
      <span className={cn("font-bold uppercase", textMetaClasses)}>
        {getDocumentKindLabel(kind)}
      </span>
    </span>
  );
}

type UploadQueueItemProps = {
  document: DocInputDocument;
  status: UploadQueueItemStatus;
  progress: number;
  disabled?: boolean;
  uploadingStatusLabel: string;
  processingStatusLabel: string;
  onRemove: () => void;
};

function UploadQueueItemRow({
  document,
  status,
  progress,
  disabled = false,
  uploadingStatusLabel,
  processingStatusLabel,
  onRemove,
}: UploadQueueItemProps) {
  const sizeLabel =
    document.size != null ? formatFileSize(document.size) : null;
  const showProgressMeta = status === "uploading" || status === "processing";

  return (
    <li className="rounded-xl border border-secondary/12 bg-surface p-3 sm:p-3.5">
      <div className="flex items-start gap-3">
        <UploadQueueFileIcon document={document} />

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p
                className={cn(
                  "truncate font-semibold text-text",
                  textBodySmClasses,
                )}
              >
                {document.name}
              </p>
              <p className={cn("mt-0.5 text-muted", textMetaClasses)}>
                {sizeLabel}
                {showProgressMeta ? ` • ${progress}%` : null}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              {status === "uploading" ? (
                <span className={cn("font-medium text-primary", textMetaClasses)}>
                  {uploadingStatusLabel}
                </span>
              ) : null}
              {status === "processing" ? (
                <span className={cn("font-medium text-primary", textMetaClasses)}>
                  {processingStatusLabel}
                </span>
              ) : null}
              {status === "completed" ? (
                <CheckCircle2
                  className="size-5 text-success"
                  aria-label="Upload complete"
                />
              ) : null}
              {status === "error" ? (
                <span className={cn("font-medium text-danger", textMetaClasses)}>
                  Failed
                </span>
              ) : null}

              <button
                type="button"
                onClick={onRemove}
                disabled={disabled}
                className={cn(
                  "inline-flex size-8 items-center justify-center rounded-lg text-muted transition-colors",
                  "hover:bg-danger/10 hover:text-danger",
                  "disabled:cursor-not-allowed disabled:opacity-40",
                  inheritOutlineFocusVisibleClasses,
                )}
                aria-label={`Remove ${document.name}`}
              >
                <X className="size-4" aria-hidden />
              </button>
            </div>
          </div>

          <UploadProgressBar progress={progress} status={status} />
        </div>
      </div>
    </li>
  );
}

export const DocInput = ({
  label,
  labelClassName,
  value,
  onChange,
  onRemove,
  onUpload,
  onUploadingChange,
  multiple = true,
  accept = DOC_INPUT_ACCEPT,
  size = "md",
  error,
  hint,
  isRequired = false,
  fullWidth = true,
  disabled = false,
  className,
  wrapperClassName,
  dropzoneTitle = "Drag & drop one or more documents",
  dropzoneDescription = "or browse multiple files from your device.",
  browseLabel = "Browse files",
  uploadingLabel = "Uploading documents…",
  queueTitle = "Uploading Queue",
  uploadingStatusLabel = "Uploading...",
  processingStatusLabel = "Processing...",
  name,
}: DocInputProps) => {
  const generatedId = useId();
  const inputId = `${generatedId}-file`;
  const errorId = `${inputId}-error`;
  const hintId = `${inputId}-hint`;
  const inputRef = useRef<HTMLInputElement>(null);
  const valueRef = useRef(value);
  const dragDepthRef = useRef(0);
  const progressTimersRef = useRef<Map<string, number>>(new Map());
  const [inFlightItems, setInFlightItems] = useState<InFlightQueueItem[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);

  valueRef.current = value;

  const isUploading = inFlightItems.some(
    (item) => item.status === "uploading" || item.status === "processing",
  );
  const onUploadingChangeRef = useRef(onUploadingChange);
  const wasUploadingRef = useRef(false);

  onUploadingChangeRef.current = onUploadingChange;

  useEffect(() => {
    if (wasUploadingRef.current === isUploading) {
      return;
    }

    wasUploadingRef.current = isUploading;
    onUploadingChangeRef.current?.(isUploading);
  }, [isUploading]);

  useEffect(() => {
    return () => {
      if (!wasUploadingRef.current) {
        return;
      }

      wasUploadingRef.current = false;
      onUploadingChangeRef.current?.(false);
    };
  }, []);

  const hasError = Boolean(error);

  const describedBy =
    [hasError ? errorId : null, !hasError && hint ? hintId : null]
      .filter(Boolean)
      .join(" ") || undefined;

  const completedQueueItems: InFlightQueueItem[] = value.map((document) => ({
    id: `completed-${document.uri}-${document.name}`,
    document,
    status: "completed",
    progress: 100,
  }));

  const queueItems = [...completedQueueItems, ...inFlightItems];
  const hasQueueItems = queueItems.length > 0;

  const clearProgressTimer = useCallback((id: string) => {
    const timerId = progressTimersRef.current.get(id);

    if (timerId != null) {
      window.clearInterval(timerId);
      progressTimersRef.current.delete(id);
    }
  }, []);

  const updateInFlightItem = useCallback(
    (id: string, patch: Partial<InFlightQueueItem>) => {
      setInFlightItems((current) =>
        current.map((item) => (item.id === id ? { ...item, ...patch } : item)),
      );
    },
    [],
  );

  const startProgressAnimation = useCallback(
    (id: string) => {
      clearProgressTimer(id);

      const timerId = window.setInterval(() => {
        setInFlightItems((current) =>
          current.map((item) => {
            if (item.id !== id || item.status !== "uploading") {
              return item;
            }

            const nextProgress = Math.min(
              item.progress + 4 + Math.random() * 8,
              92,
            );

            return { ...item, progress: Math.round(nextProgress) };
          }),
        );
      }, 180);

      progressTimersRef.current.set(id, timerId);
    },
    [clearProgressTimer],
  );

  const appendCompletedDocument = useCallback(
    (document: DocInputDocument) => {
      const nextValue = multiple
        ? [...valueRef.current, document]
        : [document];
      valueRef.current = nextValue;
      onChange(nextValue);
    },
    [multiple, onChange],
  );

  const finishUpload = useCallback(
    async (id: string, document: DocInputDocument) => {
      clearProgressTimer(id);
      updateInFlightItem(id, { status: "processing", progress: 96 });
      await delay(350);
      updateInFlightItem(id, { status: "completed", progress: 100 });
      appendCompletedDocument(document);
      setInFlightItems((current) => current.filter((item) => item.id !== id));
    },
    [appendCompletedDocument, clearProgressTimer, updateInFlightItem],
  );

  const processSingleFile = useCallback(
    async (file: File) => {
      const id = createQueueId();
      const pendingDocument = toDocument(file, "");

      setInFlightItems((current) => [
        ...current,
        {
          id,
          document: pendingDocument,
          status: "uploading",
          progress: 8,
        },
      ]);

      startProgressAnimation(id);

      if (!onUpload) {
        const uri = URL.createObjectURL(file);
        await finishUpload(id, toDocument(file, uri));
        return;
      }

      try {
        const uri = await onUpload(file);
        clearProgressTimer(id);

        if (!uri) {
          updateInFlightItem(id, { status: "error", progress: 0 });
          return;
        }

        await finishUpload(id, toDocument(file, uri));
      } catch {
        clearProgressTimer(id);
        updateInFlightItem(id, { status: "error", progress: 0 });
      }
    },
    [
      clearProgressTimer,
      finishUpload,
      onUpload,
      startProgressAnimation,
      updateInFlightItem,
    ],
  );

  const processFiles = async (files: File[]) => {
    if (!files.length || disabled) {
      return;
    }

    const acceptedFiles = (
      multiple ? files : files.slice(0, 1)
    ).filter((file) => isAcceptedFile(file, accept));

    if (!acceptedFiles.length) {
      return;
    }

    await Promise.all(acceptedFiles.map((file) => processSingleFile(file)));
  };

  const dropzoneHandlers: DropzoneHandlers = {
    onBrowse: () => {
      if (disabled || isUploading) {
        return;
      }

      inputRef.current?.click();
    },
    onDragEnter: (event) => {
      event.preventDefault();
      event.stopPropagation();

      if (disabled || isUploading) {
        return;
      }

      dragDepthRef.current += 1;
      setIsDragOver(true);
    },
    onDragLeave: (event) => {
      event.preventDefault();
      event.stopPropagation();

      dragDepthRef.current = Math.max(0, dragDepthRef.current - 1);

      if (dragDepthRef.current === 0) {
        setIsDragOver(false);
      }
    },
    onDragOver: (event) => {
      event.preventDefault();
      event.stopPropagation();
    },
    onDrop: async (event) => {
      event.preventDefault();
      event.stopPropagation();

      dragDepthRef.current = 0;
      setIsDragOver(false);

      if (disabled || isUploading) {
        return;
      }

      await processFiles(Array.from(event.dataTransfer.files));
    },
  };

  const handleRemoveQueueItem = (item: InFlightQueueItem) => {
    if (item.status === "completed") {
      onRemove?.(item.document);
      const nextValue = valueRef.current.filter(
        (document) => !documentsMatch(document, item.document),
      );
      valueRef.current = nextValue;
      onChange(nextValue);
      return;
    }

    clearProgressTimer(item.id);
    setInFlightItems((current) => current.filter((entry) => entry.id !== item.id));
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    await processFiles(files);
  };

  return (
    <Field
      disabled={disabled}
      className={cn(fullWidth && "w-full", wrapperClassName, className)}
    >
      {label != null && (
        <Label
          htmlFor={inputId}
          className={cn(fieldLabelSizeClasses, labelClassName)}
        >
          {label}
          {isRequired && (
            <span className="ms-0.5 text-danger" aria-hidden>
              *
            </span>
          )}
        </Label>
      )}

      <input
        ref={inputRef}
        type="file"
        name={name}
        className="sr-only"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        aria-describedby={describedBy}
        onChange={handleFileChange}
      />

      <div className="flex flex-col gap-4">
        <DocInputDropzone
          inputId={inputId}
          size={size}
          disabled={disabled}
          isUploading={isUploading}
          isDragOver={isDragOver}
          hasError={hasError}
          title={dropzoneTitle}
          description={dropzoneDescription}
          browseLabel={browseLabel}
          uploadingLabel={uploadingLabel}
          {...dropzoneHandlers}
        />

        {hasQueueItems ? (
          <section aria-live="polite" className="flex flex-col gap-3">
            <h3 className={cn("font-semibold text-secondary", textBodySmClasses)}>
              {queueTitle} ({queueItems.length})
            </h3>

            <ul className="flex flex-col gap-2.5">
              {queueItems.map((item) => (
                <UploadQueueItemRow
                  key={item.id}
                  document={item.document}
                  status={item.status}
                  progress={item.progress}
                  disabled={disabled}
                  uploadingStatusLabel={uploadingStatusLabel}
                  processingStatusLabel={processingStatusLabel}
                  onRemove={() => handleRemoveQueueItem(item)}
                />
              ))}
            </ul>
          </section>
        ) : null}
      </div>

      {hasError && (
        <p id={errorId} role="alert" className={fieldErrorSizeClasses}>
          {error}
        </p>
      )}

      {!hasError && hint != null && (
        <p id={hintId} className={fieldHintSizeClasses}>
          {hint}
        </p>
      )}
    </Field>
  );
};

export type { DocInputDocument, DocInputProps, UploadQueueItemStatus } from "./types";
export {
  DOC_INPUT_ACCEPT,
  DOC_INPUT_ACCEPTED_MIME_TYPES,
  DOC_INPUT_FORMAT_LABELS,
  DOC_INPUT_SIZES,
} from "./types";
