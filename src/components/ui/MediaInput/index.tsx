"use client";

import { Field, Label } from "@headlessui/react";
import {
  CloudUpload,
  ImageIcon,
  Loader2,
  Play,
  RefreshCw,
  Trash2,
} from "lucide-react";
import {
  useCallback,
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
  MEDIA_INPUT_ACCEPT,
  MEDIA_INPUT_FORMAT_LABELS,
  type MediaInputProps,
  type MediaInputSize,
  type SelectedMedia,
  type UploadQueueItemStatus,
} from "./types";
import {
  formatFileSize,
  getMediaFileKind,
  getMediaKindLabel,
  getMediaKindStyles,
  getPreviewUriForFile,
  getSupportedFormatsSentence,
  isAcceptedMediaFile,
  isVideoMedia,
  toSelectedMedia,
} from "./utils";

type InFlightQueueItem = {
  id: string;
  media: SelectedMedia;
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

const MEDIA_QUEUE_CARD_CLASS =
  "w-[5.5rem] shrink-0 snap-start sm:w-[6.25rem] md:w-[7rem] lg:w-[8rem]";

const MEDIA_QUEUE_SCROLL_CLASS = cn(
  "min-w-0 w-full overflow-x-auto overflow-y-hidden overscroll-x-contain",
  "snap-x snap-mandatory scroll-smooth",
  "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
);

function createQueueId(): string {
  return `queue-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function mediaMatch(a: SelectedMedia, b: SelectedMedia): boolean {
  return a.uri === b.uri && a.name === b.name;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

type MediaInputDropzoneProps = DropzoneHandlers & {
  inputId: string;
  size: MediaInputSize;
  disabled?: boolean;
  isUploading?: boolean;
  isDragOver?: boolean;
  hasError?: boolean;
  title: string;
  description: string;
  browseLabel: string;
  uploadingLabel: string;
};

function MediaInputDropzone({
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
}: MediaInputDropzoneProps) {
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
        "group relative flex w-full min-w-0 max-w-full flex-col items-center justify-center rounded-xl border border-dashed text-center transition-all duration-200",
        docInputDropzoneSizeClasses[size],
        "border-secondary/25 bg-page-ghost/60",
        "hover:border-primary/35 hover:bg-primary-light/30",
        isDragOver &&
          "border-primary bg-primary-light/40 ring-4 ring-primary/10",
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

      <span className="relative mt-3 flex min-h-[4.25rem] w-full flex-col items-center justify-center gap-1 px-2 text-center sm:min-h-[4.75rem] sm:px-4">
        <span className="relative flex min-h-[1.25rem] w-full items-center justify-center">
          <span
            className={cn(
              "font-semibold text-secondary",
              textBodySmClasses,
              isUploading && "invisible",
            )}
          >
            {title}
          </span>
          <span
            className={cn(
              "absolute inset-0 flex items-center justify-center font-semibold text-secondary",
              textBodySmClasses,
              !isUploading && "invisible",
            )}
          >
            {uploadingLabel}
          </span>
        </span>

        <span
          className={cn(
            "text-pretty text-muted",
            textBodySmClasses,
            isUploading && "invisible",
          )}
          aria-hidden={isUploading}
        >
          {description}{" "}
          <span className="font-medium text-primary-dark underline decoration-primary/30 underline-offset-2">
            {browseLabel}
          </span>
        </span>

        <span
          className={cn(
            "mt-1 text-muted",
            textMetaClasses,
            isUploading && "invisible",
          )}
          aria-hidden={isUploading}
        >
          {getSupportedFormatsSentence(MEDIA_INPUT_FORMAT_LABELS)}
        </span>
      </span>
    </button>
  );
}

type MediaQueueCardPreviewProps = {
  media: SelectedMedia;
  status: UploadQueueItemStatus;
  progress: number;
  generatingPreviewLabel: string;
};

function MediaQueueCardPreview({
  media,
  status,
  progress,
  generatingPreviewLabel,
}: MediaQueueCardPreviewProps) {
  const hasPreview = Boolean(media.uri);
  const isVideo = isVideoMedia(media);
  const kind = getMediaFileKind(media.name, media.mimeType);

  if (status === "processing") {
    return (
      <div className="flex size-full flex-col items-center justify-center gap-1 bg-page-ghost px-1.5 text-center sm:gap-1.5 sm:px-2">
        <Loader2
          className="size-4 animate-spin text-primary sm:size-5"
          aria-hidden
        />
        <span
          className={cn(
            "line-clamp-2 text-[0.625rem] leading-tight text-muted sm:text-xs",
          )}
        >
          {generatingPreviewLabel}
        </span>
      </div>
    );
  }

  return (
    <>
      {hasPreview ? (
        isVideo ? (
          <video
            src={media.uri}
            muted
            playsInline
            preload="metadata"
            className="size-full max-w-full object-cover"
          />
        ) : (
          <img
            src={media.uri}
            alt=""
            className="size-full max-w-full object-cover"
          />
        )
      ) : (
        <div
          className={cn(
            "flex size-full flex-col items-center justify-center",
            getMediaKindStyles(kind),
          )}
        >
          <ImageIcon className="size-5 sm:size-6" aria-hidden />
          <span className="sr-only">{getMediaKindLabel(kind)}</span>
        </div>
      )}

      {status === "uploading" ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/45 px-2 sm:px-3">
          <div
            className="mb-1.5 h-0.5 w-full max-w-[72px] overflow-hidden rounded-full bg-white/30 sm:mb-2 sm:max-w-[100px]"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
          >
            <div
              className="h-full rounded-full bg-primary transition-all duration-300"
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
          <span
            className={cn(
              "rounded-full bg-black/70 px-1.5 py-px text-[0.625rem] font-medium leading-tight text-white sm:px-2 sm:text-[0.6875rem]",
              textMetaClasses,
            )}
          >
            Uploading {progress}%
          </span>
        </div>
      ) : null}

      {status === "completed" && isVideo && hasPreview ? (
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="inline-flex size-7 items-center justify-center rounded-full bg-white/95 text-text shadow-md sm:size-8">
            <Play className="ms-0.5 size-2.5 fill-current sm:size-3" aria-hidden />
          </span>
        </span>
      ) : null}
    </>
  );
}

type MediaQueueStatusBadgeProps = {
  status: UploadQueueItemStatus;
  processingFooterLabel: string;
  processingStatusLabel: string;
  readyStatusLabel: string;
};

function MediaQueueStatusBadge({
  status,
  processingFooterLabel,
  processingStatusLabel,
  readyStatusLabel,
}: MediaQueueStatusBadgeProps) {
  if (status === "uploading") {
    return (
      <span
        className={cn(
          "inline-flex max-w-[52%] items-center gap-0.5 font-semibold uppercase tracking-wide text-primary sm:max-w-none sm:gap-1",
          "text-[0.625rem] leading-none sm:text-xs",
        )}
      >
        <RefreshCw className="size-2.5 shrink-0 animate-spin sm:size-3" aria-hidden />
        <span className="truncate">{processingFooterLabel}</span>
      </span>
    );
  }

  if (status === "processing") {
    return (
      <span
        className={cn(
          "shrink-0 rounded-full bg-page px-1.5 py-px italic text-muted sm:px-2 sm:py-0.5",
          "text-[0.625rem] leading-none sm:text-xs",
        )}
      >
        {processingStatusLabel}
      </span>
    );
  }

  if (status === "completed") {
    return (
      <span
        className={cn(
          "shrink-0 rounded-full bg-success/10 px-1.5 py-px font-medium text-success sm:px-2 sm:py-0.5",
          "text-[0.625rem] leading-none sm:text-xs",
        )}
      >
        {readyStatusLabel}
      </span>
    );
  }

  return (
    <span
      className={cn(
        "shrink-0 rounded-full bg-danger/10 px-1.5 py-px font-medium text-danger sm:px-2 sm:py-0.5",
        "text-[0.625rem] leading-none sm:text-xs",
      )}
    >
      Failed
    </span>
  );
}

type MediaUploadQueueCardProps = {
  media: SelectedMedia;
  status: UploadQueueItemStatus;
  progress: number;
  disabled?: boolean;
  generatingPreviewLabel: string;
  processingFooterLabel: string;
  processingStatusLabel: string;
  readyStatusLabel: string;
  onRemove: () => void;
};

function MediaUploadQueueCard({
  media,
  status,
  progress,
  disabled = false,
  generatingPreviewLabel,
  processingFooterLabel,
  processingStatusLabel,
  readyStatusLabel,
  onRemove,
}: MediaUploadQueueCardProps) {
  const sizeLabel = media.size != null ? formatFileSize(media.size) : null;
  const canRemove = status === "completed" || status === "error";

  return (
    <li
      className={cn(
        "flex flex-col overflow-hidden rounded-lg border border-secondary/12 bg-surface shadow-[0_1px_0_rgba(46,45,116,0.04)]",
        MEDIA_QUEUE_CARD_CLASS,
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-page-ghost sm:aspect-[5/4]">
        <MediaQueueCardPreview
          media={media}
          status={status}
          progress={progress}
          generatingPreviewLabel={generatingPreviewLabel}
        />
      </div>

      <div className="flex flex-col gap-1 p-1.5 sm:gap-1.5 sm:p-2">
        <div className="flex items-start gap-0.5 sm:gap-1">
          <p
            className={cn(
              "min-w-0 flex-1 truncate font-semibold text-text",
              textMetaClasses,
            )}
            title={media.name}
          >
            {media.name}
          </p>
          {canRemove ? (
            <button
              type="button"
              onClick={onRemove}
              disabled={disabled}
              className={cn(
                "inline-flex size-5 shrink-0 items-center justify-center rounded-md text-muted transition-colors sm:size-6",
                "hover:bg-danger/10 hover:text-danger",
                "disabled:cursor-not-allowed disabled:opacity-40",
                inheritOutlineFocusVisibleClasses,
              )}
              aria-label={`Remove ${media.name}`}
            >
              <Trash2 className="size-3" aria-hidden />
            </button>
          ) : null}
        </div>

        <div className="flex items-center justify-between gap-1 sm:gap-2">
          {sizeLabel ? (
            <span
              className={cn(
                "shrink-0 text-[0.625rem] text-muted sm:text-xs",
              )}
            >
              {sizeLabel}
            </span>
          ) : (
            <span />
          )}
          <MediaQueueStatusBadge
            status={status}
            processingFooterLabel={processingFooterLabel}
            processingStatusLabel={processingStatusLabel}
            readyStatusLabel={readyStatusLabel}
          />
        </div>
      </div>
    </li>
  );
}

export const MediaInput = ({
  label,
  labelClassName,
  value,
  onChange,
  onUpload,
  multiple = true,
  accept = MEDIA_INPUT_ACCEPT,
  size = "md",
  error,
  hint,
  isRequired = false,
  fullWidth = true,
  disabled = false,
  className,
  wrapperClassName,
  name,
  dropzoneTitle = "Drag & drop one or more photos or videos",
  dropzoneDescription = "or browse multiple files from your device.",
  browseLabel = "Browse media",
  uploadingLabel = "Uploading media…",
  queueTitle = "Uploading Queue",
  processingStatusLabel = "Processing",
  readyStatusLabel = "Ready",
  generatingPreviewLabel = "Generating Preview...",
  processingFooterLabel = "Processing",
}: MediaInputProps) => {
  const generatedId = useId();
  const inputId = `${generatedId}-media`;
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

  const hasError = Boolean(error);

  const describedBy =
    [hasError ? errorId : null, !hasError && hint ? hintId : null]
      .filter(Boolean)
      .join(" ") || undefined;

  const completedQueueItems: InFlightQueueItem[] = value.map((media) => ({
    id: `completed-${media.uri}-${media.name}`,
    media,
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

  const appendCompletedMedia = useCallback(
    (media: SelectedMedia) => {
      const nextValue = multiple ? [...valueRef.current, media] : [media];
      valueRef.current = nextValue;
      onChange(nextValue);
    },
    [multiple, onChange],
  );

  const finishUpload = useCallback(
    async (id: string, media: SelectedMedia) => {
      clearProgressTimer(id);
      updateInFlightItem(id, { status: "processing", progress: 96, media });
      await delay(350);
      updateInFlightItem(id, { status: "completed", progress: 100, media });
      appendCompletedMedia(media);
      setInFlightItems((current) => current.filter((item) => item.id !== id));
    },
    [appendCompletedMedia, clearProgressTimer, updateInFlightItem],
  );

  const processSingleFile = useCallback(
    async (file: File) => {
      const id = createQueueId();
      const previewUri = getPreviewUriForFile(file);
      const pendingMedia = toSelectedMedia(file, previewUri);

      setInFlightItems((current) => [
        ...current,
        {
          id,
          media: pendingMedia,
          status: "uploading",
          progress: 8,
        },
      ]);

      startProgressAnimation(id);

      if (!onUpload) {
        const uri = previewUri || URL.createObjectURL(file);
        await finishUpload(id, toSelectedMedia(file, uri));
        return;
      }

      try {
        const uri = await onUpload(file);
        clearProgressTimer(id);

        if (!uri) {
          updateInFlightItem(id, { status: "error", progress: 0 });
          return;
        }

        const completedMedia = toSelectedMedia(file, uri);
        await finishUpload(id, completedMedia);
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
    ).filter((file) => isAcceptedMediaFile(file, accept));

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
      const nextValue = valueRef.current.filter(
        (media) => !mediaMatch(media, item.media),
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
      className={cn(
        fullWidth && "w-full min-w-0 max-w-full",
        wrapperClassName,
        className,
      )}
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

      <div className="flex w-full min-w-0 max-w-full flex-col gap-4">
        <MediaInputDropzone
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
          <section
            aria-live="polite"
            className="flex w-full min-w-0 flex-col gap-3"
          >
            <h3 className={cn("font-semibold text-secondary", textBodySmClasses)}>
              {queueTitle} ({queueItems.length})
            </h3>

            <div className={MEDIA_QUEUE_SCROLL_CLASS}>
              <ul className="flex w-max min-w-0 flex-nowrap gap-1.5 sm:gap-2 md:gap-2.5">
                {queueItems.map((item) => (
                  <MediaUploadQueueCard
                    key={item.id}
                    media={item.media}
                    status={item.status}
                    progress={item.progress}
                    disabled={disabled}
                    generatingPreviewLabel={generatingPreviewLabel}
                    processingFooterLabel={processingFooterLabel}
                    processingStatusLabel={processingStatusLabel}
                    readyStatusLabel={readyStatusLabel}
                    onRemove={() => handleRemoveQueueItem(item)}
                  />
                ))}
              </ul>
            </div>
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

export type {
  MediaInputProps,
  MediaInputSize,
  SelectedMedia,
  UploadQueueItemStatus,
} from "./types";
export {
  MEDIA_INPUT_ACCEPT,
  MEDIA_INPUT_ACCEPTED_MIME_TYPES,
  MEDIA_INPUT_FORMAT_LABELS,
  MEDIA_INPUT_SIZES,
} from "./types";
