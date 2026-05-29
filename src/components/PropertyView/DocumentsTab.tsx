"use client";

import {
  Download,
  ExternalLink,
  FileText,
  LayoutGrid,
} from "lucide-react";
import { useMemo } from "react";
import { cn } from "../../lib/cn";
import { Card } from "../ui/Card";
import type { DocumentsTabProps, PropertyMediaItem } from "./types";
import {
  getDocumentFileType,
  getMediaItemLabel,
  sortMediaItems,
} from "./utils";

function SectionHeading({ children }: { children: string }) {
  return (
    <h4 className="text-[11px] font-semibold tracking-[0.12em] text-text uppercase">
      {children}
    </h4>
  );
}

function DocumentsEmptyState() {
  return (
    <div
      className="mt-5 flex flex-col items-center justify-center rounded-xl border border-dashed border-secondary/20 bg-page-ghost px-6 py-10 text-center"
      role="status"
    >
      <span className="inline-flex size-12 items-center justify-center rounded-full bg-secondary/10 text-secondary">
        <FileText className="size-6" aria-hidden />
      </span>
      <p className="mt-4 text-sm font-semibold text-text">No documents yet</p>
      <p className="mt-1 max-w-sm text-sm text-muted">
        No documents or floor plans have been uploaded for this listing yet.
      </p>
    </div>
  );
}

type DocumentItemProps = {
  item: PropertyMediaItem;
  label: string;
  fileType: string;
};

function DocumentItem({ item, label, fileType }: DocumentItemProps) {
  return (
    <li className="flex items-center gap-4 rounded-xl border border-secondary/10 bg-page-ghost px-4 py-3.5">
      <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-light">
        <FileText className="size-5 text-primary" aria-hidden />
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-text">{label}</p>
        <p className="text-xs text-muted">{fileType} document</p>
      </div>

      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-secondary/15 bg-surface px-3 py-1.5 text-sm font-medium text-secondary transition-colors hover:bg-page"
      >
        <Download className="size-4" aria-hidden />
        <span className="hidden sm:inline">Download</span>
      </a>
    </li>
  );
}

type FloorPlanItemProps = {
  item: PropertyMediaItem;
  label: string;
};

function FloorPlanItem({ item, label }: FloorPlanItemProps) {
  const previewSrc = item.thumb_url || item.url;

  return (
    <li className="overflow-hidden rounded-xl border border-secondary/10 bg-surface">
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group block"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-page-ghost">
          <img
            src={previewSrc}
            alt={label}
            className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            loading="lazy"
            decoding="async"
          />
          <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-lg border border-secondary/15 bg-surface/95 px-2.5 py-1 text-xs font-medium text-secondary shadow-sm backdrop-blur-sm">
            <ExternalLink className="size-3.5" aria-hidden />
            View
          </span>
        </div>
        <div className="flex items-center gap-3 px-4 py-3">
          <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-light">
            <LayoutGrid className="size-4 text-primary" aria-hidden />
          </span>
          <span className="min-w-0 flex-1 truncate text-sm font-medium text-text/80">
            {label}
          </span>
        </div>
      </a>
    </li>
  );
}

export function DocumentsTab({
  propertyDetails,
  className,
}: DocumentsTabProps) {
  const documents = useMemo(
    () => sortMediaItems(propertyDetails.media.documents ?? []),
    [propertyDetails.media.documents],
  );
  const floorPlans = useMemo(
    () => sortMediaItems(propertyDetails.media.floor_plan_images ?? []),
    [propertyDetails.media.floor_plan_images],
  );
  const hasContent = documents.length > 0 || floorPlans.length > 0;

  return (
    <section className={cn("flex flex-col", className)} aria-label="Documents">
      <Card className="border border-secondary/10 p-5 shadow-none sm:p-6">
        <h3 className="text-sm font-bold tracking-[0.08em] text-secondary uppercase">
          Documents
        </h3>

        {hasContent ? (
          <div className="mt-5 flex flex-col gap-8">
            {documents.length > 0 ? (
              <div>
                <SectionHeading>Property documents</SectionHeading>
                <p className="mt-2 text-sm text-muted">
                  Verified files shared by the listing team for this property.
                </p>
                <ul className="mt-4 flex flex-col gap-3">
                  {documents.map((item, index) => (
                    <DocumentItem
                      key={item.id}
                      item={item}
                      label={getMediaItemLabel(
                        item,
                        index,
                        `Document ${index + 1}`,
                      )}
                      fileType={getDocumentFileType(item.url)}
                    />
                  ))}
                </ul>
              </div>
            ) : null}

            {floorPlans.length > 0 ? (
              <div>
                <SectionHeading>Floor plans</SectionHeading>
                <p className="mt-2 text-sm text-muted">
                  Review layout drawings and room configurations.
                </p>
                <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {floorPlans.map((item, index) => (
                    <FloorPlanItem
                      key={item.id}
                      item={item}
                      label={getMediaItemLabel(
                        item,
                        index,
                        `Floor plan ${index + 1}`,
                      )}
                    />
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        ) : (
          <DocumentsEmptyState />
        )}
      </Card>
    </section>
  );
}
