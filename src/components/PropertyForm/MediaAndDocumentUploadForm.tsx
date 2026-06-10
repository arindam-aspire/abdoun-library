"use client";

import type { UseMediaUploadFormReturn } from "../../hooks/useMediaUploadFormHook";
import { cn } from "../../lib/cn";
import { textBodySmClasses, textPageTitleClasses } from "../../lib/typography";
import { Badge } from "../ui/Badge";
import { FileSelectInput } from "../ui/FileSelectInput";
import { Input } from "../ui/Input";
import { MediaInput } from "../ui/MediaInput";
import {
  propertyFormGridClasses,
  propertyFormStackClasses,
} from "./propertyFormFieldLayout";

const MEDIA_UPLOAD_TITLE = "Media & Documents";
const MEDIA_UPLOAD_SUBTITLE =
  "Upload property photos, videos, tour links, and supporting documents.";
const MEDIA_UPLOAD_BADGE_LABEL = "Required";

export interface MediaAndDocumentUploadFormProps {
  form: UseMediaUploadFormReturn;
  onUploadPropertyMedia?: (file: File) => Promise<string | null>;
  onUploadPropertyDocument?: (file: File) => Promise<string | null>;
  className?: string;
}

export function MediaAndDocumentUploadForm({
  form,
  onUploadPropertyMedia,
  onUploadPropertyDocument,
  className,
}: MediaAndDocumentUploadFormProps) {
  return (
    <form
      className={cn(propertyFormStackClasses, className)}
      onSubmit={(event) => event.preventDefault()}
      noValidate
    >
      <header className="flex flex-col gap-1.5">
        <div className="flex items-start justify-between gap-3">
          <h2
            className={cn(
              "min-w-0 font-bold text-secondary",
              textPageTitleClasses,
            )}
          >
            {MEDIA_UPLOAD_TITLE}
          </h2>
          <Badge variant="exclusive" appearance="solid" className="shrink-0">
            {MEDIA_UPLOAD_BADGE_LABEL}
          </Badge>
        </div>
        <p className={cn("text-muted", textBodySmClasses)}>
          {MEDIA_UPLOAD_SUBTITLE}
        </p>
      </header>

      <MediaInput
        name="media_files"
        label="Media"
        value={form.values.media_files}
        onChange={form.setMediaFiles}
        onUpload={onUploadPropertyMedia}
        wrapperClassName="w-full min-w-0"
      />

      <div className={propertyFormGridClasses}>
        <Input
          name="youtube_url"
          type="url"
          label="YouTube URL"
          placeholder="https://youtube.com/watch?v=..."
          value={form.values.youtube_url}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
          error={form.errors.youtube_url}
          fullWidth
        />

        <Input
          name="virtual_tour_url"
          type="url"
          label="Virtual Tour URL"
          placeholder="https://tour.example.com/..."
          value={form.values.virtual_tour_url}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
          error={form.errors.virtual_tour_url}
          fullWidth
        />
      </div>

      <FileSelectInput
        name="documents"
        label="Documents"
        value={form.values.documents}
        onChange={form.setDocuments}
        onUpload={onUploadPropertyDocument}
        multiple
        wrapperClassName="w-full min-w-0"
      />
    </form>
  );
}
