"use client";

import {
  Download,
  ExternalLink,
  FileText,
  LayoutGrid,
} from "lucide-react";
import { cn } from "../../lib/cn";
import { Card } from "../ui/Card";
import type { DocumentsTabProps } from "./types";
import { getDocumentFileType, getDocumentLabelFromUrl } from "./utils";

function SectionHeading({ children }: { children: string }) {
  return (
    <h4 className="text-[11px] font-semibold tracking-[0.12em] text-text uppercase">
      {children}
    </h4>
  );
}

type DocumentItemProps = {
  url: string;
  label: string;
  fileType: string;
};

function DocumentItem({ url, label, fileType }: DocumentItemProps) {
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
        href={url}
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
  url: string;
  label: string;
};

function FloorPlanItem({ url, label }: FloorPlanItemProps) {
  return (
    <li className="overflow-hidden rounded-xl border border-secondary/10 bg-surface">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="group block"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-page-ghost">
          <img
            src={url}
            alt={label}
            className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            loading="lazy"
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
  const documents = propertyDetails.media.documents ?? [];
  const floorPlans = propertyDetails.media.floor_plan_images ?? [];
  const hasContent = documents.length > 0 || floorPlans.length > 0;

  return (
    <section className={cn("flex flex-col", className)} aria-label="Documents">
      <Card className="border border-secondary/10 p-5 shadow-none sm:p-6">
        <h3 className="text-sm font-bold tracking-[0.08em] text-secondary uppercase">
          Documents
        </h3>
        <div className="mt-4 border-b border-secondary/10" aria-hidden />

        {hasContent ? (
          <div className="mt-5 flex flex-col gap-8">
            {documents.length > 0 ? (
              <div>
                <SectionHeading>Property documents</SectionHeading>
                <p className="mt-2 text-sm text-muted">
                  Verified files shared by the listing team for this property.
                </p>
                <ul className="mt-4 flex flex-col gap-3">
                  {documents.map((url, index) => (
                    <DocumentItem
                      key={`${url}-${index}`}
                      url={url}
                      label={getDocumentLabelFromUrl(url, index)}
                      fileType={getDocumentFileType(url)}
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
                  {floorPlans.map((url, index) => (
                    <FloorPlanItem
                      key={`${url}-${index}`}
                      url={url}
                      label={getDocumentLabelFromUrl(url, index) || `Floor plan ${index + 1}`}
                    />
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        ) : (
          <p className="mt-5 text-sm text-muted">
            No documents or floor plans have been uploaded for this listing yet.
          </p>
        )}
      </Card>
    </section>
  );
}
