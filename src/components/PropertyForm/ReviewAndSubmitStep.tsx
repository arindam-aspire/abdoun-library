"use client";

import { FileText } from "lucide-react";
import type { ReactNode } from "react";
import { useMemo } from "react";
import { cn } from "../../lib/cn";
import {
  textBodySmClasses,
  textMetaMediumClasses,
  textPageTitleClasses,
  textSectionTitleClasses,
} from "../../lib/typography";
import { Card } from "../ui/Card";
import { Checkbox } from "../ui/Checkbox";
import { formatFileSize } from "../ui/FileSelectInput";
import { formatPriceValue } from "../ui/PriceInput/utils";
import {
  getFilteredFeaturesAndAmenitiesCatalog,
  isAmenityGroup,
  isFeatureGroup,
  resolveSelectedCatalogItems,
} from "./amenitiesFormOptions";
import { nationalityOptions } from "./ownerInfoFormOptions";
import {
  bathroomOptions,
  bedroomOptions,
  completionStatusOptions,
  occupancyOptions,
  orientationOptions,
  ownershipTypeOptions,
  parkingSpaceOptions,
  propertyAgeOptions,
} from "./propertyDetailsFormOptions";
import {
  areAllTermsAccepted,
  createAcceptedTermsValues,
  createDeclinedTermsValues,
} from "./propertyFormDefaults";
import { propertyFormGridClasses, propertyFormStackClasses } from "./propertyFormFieldLayout";
import type {
  AmenitiesFormValues,
  BasicInfoFormValues,
  FeaturesAndAmenities,
  LocationInsertFormValues,
  LocationTaxonomyCity,
  MediaUploadFormValues,
  OwnerInfoFormValues,
  OwnerInfoItem,
  PricingDetailsFormValues,
  PropertyDetailsFormValues,
  PropertyTaxonomyCategory,
  SelectedDocument,
  TermsAcceptanceFormValues,
} from "./types";

const REVIEW_TITLE = "Review & Submit";
const REVIEW_SUBTITLE =
  "Review all property details below before submitting your listing.";
const TERMS_SECTION_TITLE = "Terms & Conditions";
const TERMS_AGREE_LABEL =
  "I have read the points above and agree to all of them.";
const TERMS_BULLETS = [
  "I confirm that all information provided is accurate and complete to the best of my knowledge.",
  "I agree to the platform's terms of service and privacy policy.",
  "I authorize the platform to display this property listing publicly.",
  "I understand that listing fees and commissions apply as per the platform's pricing policy.",
] as const;
const EMPTY_VALUE = "—";
const REVIEW_CARD_CLASSES =
  "border border-secondary/10 bg-page p-4 sm:p-5";

const listingPurposeLabels: Record<string, string> = {
  sale: "Sale",
  rent: "Rent",
};

function displayValue(value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === "") {
    return EMPTY_VALUE;
  }

  return String(value);
}

function optionLabel(
  options: readonly { value: string; label: string }[],
  value: string | number | null | undefined,
): string {
  if (value === null || value === undefined || value === "") {
    return EMPTY_VALUE;
  }

  const match = options.find((option) => option.value === String(value));
  return match?.label ?? String(value);
}

function formatPriceField(value: string, currency: string): string {
  if (!value.trim()) {
    return EMPTY_VALUE;
  }

  return `${formatPriceValue(value)} ${currency}`;
}

function builtUpAreaLabel(measurementUnit: "SQFT" | "SQM"): string {
  return measurementUnit === "SQM"
    ? "Built-up Area (sq. m.)"
    : "Built-up Area (sq.ft.)";
}

function resolveCategoryName(
  categoryTaxonomy: PropertyTaxonomyCategory[],
  categoryId: number | null,
): string {
  if (categoryId == null) {
    return EMPTY_VALUE;
  }

  return (
    categoryTaxonomy.find((category) => category.id === categoryId)?.name ??
    String(categoryId)
  );
}

function resolveTypeName(
  categoryTaxonomy: PropertyTaxonomyCategory[],
  categoryId: number | null,
  typeId: number | null,
): string {
  if (typeId == null) {
    return EMPTY_VALUE;
  }

  const category = categoryTaxonomy.find((item) => item.id === categoryId);
  const type = category?.property_types.find((item) => item.id === typeId);

  return type?.name ?? String(typeId);
}

function resolveCityName(
  locationTaxonomy: LocationTaxonomyCity[],
  cityId: number | null,
): string {
  if (cityId == null) {
    return EMPTY_VALUE;
  }

  return (
    locationTaxonomy.find((city) => city.id === cityId)?.name ?? String(cityId)
  );
}

function resolveAreaNames(
  locationTaxonomy: LocationTaxonomyCity[],
  cityId: number | null,
  areaIds: number[],
): string {
  if (areaIds.length === 0) {
    return EMPTY_VALUE;
  }

  const city = locationTaxonomy.find((item) => item.id === cityId);
  const names = areaIds
    .map((areaId) => city?.areas.find((area) => area.id === areaId)?.name)
    .filter((name): name is string => Boolean(name));

  return names.length > 0 ? names.join(", ") : areaIds.join(", ");
}

function resolveNationality(value: string): string {
  if (!value) {
    return EMPTY_VALUE;
  }

  return (
    nationalityOptions.find((option) => option.value === value)?.label ?? value
  );
}

function isImageDocument(document: SelectedDocument): boolean {
  if (document.mimeType?.startsWith("image/")) {
    return true;
  }

  return /\.(jpe?g|png|gif|webp|bmp|svg)$/i.test(document.name);
}

function isVideoDocument(document: SelectedDocument): boolean {
  if (document.mimeType?.startsWith("video/")) {
    return true;
  }

  return /\.(mp4|mov|webm)$/i.test(document.name);
}

function ReviewField({
  label,
  value,
  className,
}: {
  label: string;
  value: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("min-w-0", className)}>
      <dt className={cn("text-muted", textMetaMediumClasses)}>{label}</dt>
      <dd className={cn("mt-0.5 break-words text-text", textBodySmClasses)}>
        {value}
      </dd>
    </div>
  );
}

function ReviewSection({
  title,
  children,
}: {
  title: ReactNode;
  children: ReactNode;
}) {
  return (
    <Card className={REVIEW_CARD_CLASSES}>
      <h3
        className={cn(
          "mb-4 text-secondary",
          textSectionTitleClasses,
        )}
      >
        {title}
      </h3>
      {children}
    </Card>
  );
}

function ReviewChipList({ items }: { items: string[] }) {
  if (items.length === 0) {
    return <span>{EMPTY_VALUE}</span>;
  }

  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((item) => (
        <li
          key={item}
          className="rounded-full border border-secondary/15 bg-page-ghost/60 px-2.5 py-1 text-text"
        >
          <span className={textBodySmClasses}>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function DocumentList({ documents }: { documents: SelectedDocument[] }) {
  if (documents.length === 0) {
    return <span>{EMPTY_VALUE}</span>;
  }

  return (
    <ul className="flex flex-col gap-2">
      {documents.map((document) => (
        <li
          key={`${document.name}-${document.uri}`}
          className="flex min-w-0 items-center justify-between gap-3 rounded-md border border-secondary/10 bg-page-ghost/40 px-3 py-2"
        >
          <span className={cn("min-w-0 truncate font-medium", textBodySmClasses)}>
            {document.name}
          </span>
          {document.size != null ? (
            <span className={cn("shrink-0 text-muted", textMetaMediumClasses)}>
              {formatFileSize(document.size)}
            </span>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

function MediaPreviewGrid({ mediaFiles }: { mediaFiles: SelectedDocument[] }) {
  if (mediaFiles.length === 0) {
    return <span>{EMPTY_VALUE}</span>;
  }

  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
      {mediaFiles.map((file, index) => (
        <li
          key={`${file.name}-${file.uri}`}
          className="overflow-hidden rounded-lg border border-secondary/10 bg-page-ghost/40"
        >
          <div className="relative aspect-[4/3] bg-surface">
            {isImageDocument(file) ? (
              <img
                src={file.uri}
                alt={file.name}
                className="size-full object-cover"
              />
            ) : isVideoDocument(file) ? (
              <video
                src={file.uri}
                controls
                playsInline
                preload="metadata"
                onLoadedData={(event) => {
                  event.currentTarget.pause();
                }}
                className="size-full object-cover"
              />
            ) : (
              <div className="flex size-full items-center justify-center bg-secondary/5 text-muted">
                <span className={textMetaMediumClasses}>Media</span>
              </div>
            )}
            {index === 0 ? (
              <span className="absolute left-2 top-2 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white sm:text-[11px]">
                Primary
              </span>
            ) : null}
          </div>
          <p
            className={cn(
              "truncate px-2 py-1.5 text-text",
              textMetaMediumClasses,
            )}
            title={file.name}
          >
            {file.name}
          </p>
        </li>
      ))}
    </ul>
  );
}

function OwnerReviewFields({
  owner,
  index,
  hasMultipleOwners,
}: {
  owner: OwnerInfoItem;
  index: number;
  hasMultipleOwners: boolean;
}) {
  return (
    <div
      className={cn(
        index > 0 && "border-t border-secondary/15 pt-4",
        hasMultipleOwners && index > 0 && "mt-4",
      )}
    >
      {hasMultipleOwners ? (
        <h4 className={cn("mb-4 font-semibold text-secondary", textBodySmClasses)}>
          Owner {index + 1}
        </h4>
      ) : null}

      <dl className={propertyFormGridClasses}>
        <ReviewField label="Owner Name" value={displayValue(owner.owner_name)} />
        <ReviewField
          label="Phone Number"
          value={displayValue(
            owner.phone_number
              ? `${owner.country_code} ${owner.phone_number}`.trim()
              : "",
          )}
        />
        <ReviewField label="Email Address" value={displayValue(owner.email)} />
        <ReviewField
          label="Nationality"
          value={resolveNationality(owner.nationality)}
        />
        <ReviewField
          label="Social Security ID"
          value={displayValue(owner.social_security_id)}
          className="md:col-span-2"
        />
        <ReviewField
          label="Owner Address"
          value={displayValue(owner.owner_address)}
          className="md:col-span-2"
        />
        <div className="md:col-span-2">
          <ReviewField
            label="Owner Documents"
            value={<DocumentList documents={owner.owner_documents} />}
          />
        </div>
      </dl>
    </div>
  );
}

export interface ReviewAndSubmitStepProps {
  basicInfo: BasicInfoFormValues;
  location: LocationInsertFormValues;
  propertyDetails: PropertyDetailsFormValues;
  ownerInfo: OwnerInfoFormValues;
  pricing: PricingDetailsFormValues;
  amenities: AmenitiesFormValues;
  media: MediaUploadFormValues;
  categoryTaxonomy: PropertyTaxonomyCategory[];
  locationTaxonomy: LocationTaxonomyCity[];
  featuresAndAmenities: FeaturesAndAmenities[];
  termsAcceptance: TermsAcceptanceFormValues;
  onTermsAcceptanceChange: (terms: TermsAcceptanceFormValues) => void;
  /** When false, the terms agreement checkbox is disabled. */
  canEdit?: boolean;
  pricingCurrency?: string;
  measurementUnit?: "SQFT" | "SQM";
  className?: string;
}

export function ReviewAndSubmitStep({
  basicInfo,
  location,
  propertyDetails,
  ownerInfo,
  pricing,
  amenities,
  media,
  categoryTaxonomy,
  locationTaxonomy,
  featuresAndAmenities,
  termsAcceptance,
  onTermsAcceptanceChange,
  canEdit = true,
  pricingCurrency = "JOD",
  measurementUnit = "SQFT",
  className,
}: ReviewAndSubmitStepProps) {
  const allTermsAccepted = areAllTermsAccepted(termsAcceptance);
  const filteredCatalog = useMemo(
    () =>
      getFilteredFeaturesAndAmenitiesCatalog(
        featuresAndAmenities,
        basicInfo.category_id,
        basicInfo.type_id,
      ),
    [basicInfo.category_id, basicInfo.type_id, featuresAndAmenities],
  );

  const selectedCatalogItems = useMemo(
    () =>
      resolveSelectedCatalogItems(
        filteredCatalog,
        amenities.selected_amenities,
        amenities.feature_ids,
      ),
    [amenities.feature_ids, amenities.selected_amenities, filteredCatalog],
  );

  const selectedFeatures = useMemo(
    () =>
      selectedCatalogItems
        .filter((item) => isFeatureGroup(item.feature_group))
        .map((item) => item.name),
    [selectedCatalogItems],
  );

  const selectedAmenities = useMemo(
    () =>
      selectedCatalogItems
        .filter((item) => isAmenityGroup(item.feature_group))
        .map((item) => item.name),
    [selectedCatalogItems],
  );

  return (
    <div className={cn(propertyFormStackClasses, className)}>
      <header className="flex flex-col gap-1.5">
        <h2
          className={cn(
            "min-w-0 font-bold text-secondary",
            textPageTitleClasses,
          )}
        >
          {REVIEW_TITLE}
        </h2>
        <p className={cn("text-muted", textBodySmClasses)}>{REVIEW_SUBTITLE}</p>
      </header>

      <ReviewSection title="Basic Information">
        <dl className={propertyFormGridClasses}>
          <ReviewField
            label="Listing Purpose"
            value={
              basicInfo.listing_purpose
                ? (listingPurposeLabels[basicInfo.listing_purpose] ??
                  basicInfo.listing_purpose)
                : EMPTY_VALUE
            }
          />
          <ReviewField
            label="Category"
            value={resolveCategoryName(categoryTaxonomy, basicInfo.category_id)}
          />
          <ReviewField
            label="Property Type"
            value={resolveTypeName(
              categoryTaxonomy,
              basicInfo.category_id,
              basicInfo.type_id,
            )}
          />
          <ReviewField label="Property Title" value={displayValue(basicInfo.title)} />
          <ReviewField
            label="Description"
            value={displayValue(basicInfo.description)}
            className="md:col-span-2"
          />
        </dl>
      </ReviewSection>

      <ReviewSection title="Location">
        <dl className={propertyFormGridClasses}>
          <ReviewField
            label="City"
            value={resolveCityName(locationTaxonomy, location.city_id)}
          />
          <ReviewField
            label="Areas"
            value={resolveAreaNames(
              locationTaxonomy,
              location.city_id,
              location.area_ids,
            )}
          />
          <ReviewField
            label="Address"
            value={displayValue(location.address)}
            className="md:col-span-2"
          />
        </dl>
      </ReviewSection>

      <ReviewSection title="Property Details">
        <dl className={propertyFormGridClasses}>
          <ReviewField
            label="Bedrooms"
            value={optionLabel(bedroomOptions, propertyDetails.bedrooms)}
          />
          <ReviewField
            label="Bathrooms"
            value={optionLabel(bathroomOptions, propertyDetails.bathrooms)}
          />
          <ReviewField
            label={builtUpAreaLabel(measurementUnit)}
            value={displayValue(propertyDetails.built_up_area)}
          />
          <ReviewField
            label="Parking Spaces"
            value={optionLabel(parkingSpaceOptions, propertyDetails.parking_spaces)}
          />
          <ReviewField
            label="Property Age"
            value={optionLabel(propertyAgeOptions, propertyDetails.property_age)}
          />
          <ReviewField
            label="Completion Status"
            value={optionLabel(
              completionStatusOptions,
              propertyDetails.completion_status,
            )}
          />
          <ReviewField
            label="Total Floor"
            value={displayValue(propertyDetails.total_floor)}
          />
          <ReviewField
            label="Occupancy"
            value={optionLabel(occupancyOptions, propertyDetails.occupancy)}
          />
          <ReviewField
            label="Ownership Type"
            value={optionLabel(ownershipTypeOptions, propertyDetails.ownership_type)}
          />
          <ReviewField
            label="Orientation"
            value={optionLabel(orientationOptions, propertyDetails.orientation)}
          />
          <ReviewField
            label="Reference Number"
            value={displayValue(propertyDetails.reference_number)}
          />
          <ReviewField
            label="Permit / DLD Number"
            value={displayValue(propertyDetails.permit_dld_number)}
          />
        </dl>
      </ReviewSection>

      <ReviewSection title="Owner Information">
        {ownerInfo.owners.length === 0 ? (
          <span className={textBodySmClasses}>{EMPTY_VALUE}</span>
        ) : (
          ownerInfo.owners.map((owner, index) => (
            <OwnerReviewFields
              key={`owner-review-${index}`}
              owner={owner}
              index={index}
              hasMultipleOwners={ownerInfo.owners.length > 1}
            />
          ))
        )}
      </ReviewSection>

      <ReviewSection title="Pricing">
        <dl className={propertyFormGridClasses}>
          <ReviewField label="Price" value={formatPriceField(pricing.price, pricingCurrency)} />
          <ReviewField
            label="Service Charge"
            value={formatPriceField(pricing.service_charge, pricingCurrency)}
          />
          <ReviewField
            label="Maintenance Fee"
            value={formatPriceField(pricing.maintenance_fee, pricingCurrency)}
          />
        </dl>
      </ReviewSection>

      <ReviewSection title="Features & Amenities">
        <dl className={propertyFormStackClasses}>
          <ReviewField
            label="Features"
            value={<ReviewChipList items={selectedFeatures} />}
          />
          <ReviewField
            label="Amenities"
            value={<ReviewChipList items={selectedAmenities} />}
          />
        </dl>
      </ReviewSection>

      <ReviewSection title="Media & Documents">
        <dl className={propertyFormStackClasses}>
          <ReviewField
            label="Media"
            value={<MediaPreviewGrid mediaFiles={media.media_files} />}
          />
          <ReviewField
            label="YouTube URL"
            value={displayValue(media.youtube_url)}
          />
          <ReviewField
            label="Virtual Tour URL"
            value={displayValue(media.virtual_tour_url)}
          />
          <ReviewField
            label="Documents"
            value={<DocumentList documents={media.documents} />}
          />
        </dl>
      </ReviewSection>

      <ReviewSection
        title={
          <span className="inline-flex items-center gap-2">
            <FileText className="size-5 shrink-0 text-secondary" aria-hidden />
            {TERMS_SECTION_TITLE}
          </span>
        }
      >
        <ul
          className={cn(
            "list-disc space-y-2 ps-5 text-text",
            textBodySmClasses,
          )}
        >
          {TERMS_BULLETS.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <div className="mt-4 border-t border-secondary/10 pt-4">
          <Checkbox
            name="terms_accept_all"
            label={TERMS_AGREE_LABEL}
            checked={allTermsAccepted}
            disabled={!canEdit}
            onChange={(checked) => {
              onTermsAcceptanceChange(
                checked ? createAcceptedTermsValues() : createDeclinedTermsValues(),
              );
            }}
          />
        </div>
      </ReviewSection>
    </div>
  );
}
