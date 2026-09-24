"use client";

import { FileText } from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
  type SyntheticEvent,
} from "react";
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
import {
  getMediaDisplayUri,
  isImageMedia,
  isVideoMedia,
} from "../ui/MediaInput/utils";
import { formatPriceValue } from "../ui/PriceInput/utils";
import {
  getFilteredFeaturesAndAmenitiesCatalog,
  isAmenityGroup,
  isFeatureGroup,
  resolveSelectedCatalogItems,
} from "./amenitiesFormOptions";
import { occupancyOptions, ownershipTypeOptions } from "./propertyDetailsFormOptions";
import {
  optionLabel,
  optionLabels,
  type ResolvedPropertyFormConfig,
} from "./propertyFormConfig";
import {
  getIdentificationFieldValue,
  getPricingFieldValue,
} from "./propertyFormDefaults";
import { sortPropertyMediaForDisplay } from "./propertyFormMedia";
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
  PropertyMediaFile,
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

function displayValue(value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === "") {
    return EMPTY_VALUE;
  }

  return String(value);
}

function formatPriceField(value: string, currency: string): string {
  if (!value.trim()) {
    return EMPTY_VALUE;
  }

  return `${formatPriceValue(value)} ${currency}`;
}

function builtUpAreaLabel(unit: "SQFT" | "SQM"): string {
  return unit === "SQM"
    ? "Built-up Area (sq. m.)"
    : "Built-up Area (sq. ft.)";
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

function resolveAreaName(
  locationTaxonomy: LocationTaxonomyCity[],
  cityId: number | null,
  areaId: number | null,
): string {
  if (areaId == null) {
    return EMPTY_VALUE;
  }

  const city = locationTaxonomy.find((item) => item.id === cityId);
  return city?.areas.find((area) => area.id === areaId)?.name ?? String(areaId);
}

function ReviewMediaThumbnail({ file }: { file: PropertyMediaFile }) {
  const [activePreviewUri, setActivePreviewUri] = useState(() =>
    getMediaDisplayUri(file),
  );
  const [previewFailed, setPreviewFailed] = useState(false);
  const isImage = isImageMedia(file);
  const isVideo = isVideoMedia(file);
  const hasPreview = Boolean(activePreviewUri) && !previewFailed;

  useEffect(() => {
    setPreviewFailed(false);
    setActivePreviewUri(getMediaDisplayUri(file));
  }, [file.name, file.previewUri, file.uri]);

  const handlePreviewError = (
    event: SyntheticEvent<HTMLImageElement | HTMLVideoElement>,
  ) => {
    event.currentTarget.onerror = null;

    if (
      file.previewUri &&
      activePreviewUri === file.previewUri &&
      file.uri &&
      file.uri !== file.previewUri
    ) {
      setActivePreviewUri(file.uri);
      return;
    }

    setPreviewFailed(true);
  };

  if (hasPreview && isVideo) {
    return (
      <video
        src={activePreviewUri}
        controls
        playsInline
        preload="metadata"
        onLoadedData={(event) => {
          event.currentTarget.pause();
        }}
        onError={handlePreviewError}
        className="size-full object-cover"
      />
    );
  }

  if (hasPreview && isImage) {
    return (
      <img
        src={activePreviewUri}
        alt={file.name}
        onError={handlePreviewError}
        className="size-full object-cover"
      />
    );
  }

  return (
    <div className="flex size-full items-center justify-center bg-secondary/5 text-muted">
      <span className={textMetaMediumClasses}>Media</span>
    </div>
  );
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

function MediaPreviewGrid({ mediaFiles }: { mediaFiles: PropertyMediaFile[] }) {
  const sortedMedia = sortPropertyMediaForDisplay(mediaFiles);

  if (sortedMedia.length === 0) {
    return <span>{EMPTY_VALUE}</span>;
  }

  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
      {sortedMedia.map((file) => (
        <li
          key={`${file.name}-${file.uri}-${file.previewUri ?? ""}`}
          className="overflow-hidden rounded-lg border border-secondary/10 bg-page-ghost/40"
        >
          <div className="relative aspect-[4/3] bg-surface">
            <ReviewMediaThumbnail file={file} />
            {file.is_primary ? (
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
  nationalityOptions,
  ownerModeLabel,
}: {
  owner: OwnerInfoItem;
  index: number;
  hasMultipleOwners: boolean;
  nationalityOptions: { value: string; label: string }[];
  ownerModeLabel?: string;
}) {
  return (
    <div
      className={cn(
        index > 0 && "border-t border-secondary/15 pt-4",
        hasMultipleOwners && index > 0 && "mt-4",
      )}
    >
      {hasMultipleOwners || ownerModeLabel ? (
        <h4 className={cn("mb-4 font-semibold text-secondary", textBodySmClasses)}>
          {ownerModeLabel ?? `Owner ${index + 1}`}
        </h4>
      ) : null}

      <dl className={propertyFormGridClasses}>
        <ReviewField
          label="Owner Name"
          value={displayValue(owner.full_name || owner.owner_name)}
        />
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
          value={optionLabel(nationalityOptions, owner.nationality, EMPTY_VALUE)}
        />
        <ReviewField
          label="Social Security ID"
          value={displayValue(owner.ssi || owner.social_security_id)}
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
  resolvedConfig: ResolvedPropertyFormConfig;
  visiblePricingFields: {
    key: string;
    label: string;
  }[];
  /** When false, the terms agreement checkbox is disabled. */
  canEdit?: boolean;
  /**
   * @deprecated Use `pricing.price_currency` and fee currency fields instead.
   * Retained so existing consumers can migrate without a prop change.
   */
  pricingCurrency?: string;
  /**
   * @deprecated Use `propertyDetails.built_up_area_unit` instead.
   * Retained so existing consumers can migrate without a prop change.
   */
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
  resolvedConfig,
  visiblePricingFields,
  canEdit = true,
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
            label={resolvedConfig.listingPurposeLabel}
            value={optionLabels(
              resolvedConfig.listingPurposeOptions,
              basicInfo.listing_purposes ?? [],
              EMPTY_VALUE,
            )}
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
            label={resolvedConfig.areaLabel}
            value={resolveAreaName(
              locationTaxonomy,
              location.city_id,
              location.area_id,
            )}
          />
          <ReviewField
            label={resolvedConfig.mapLocationLabels.latitude}
            value={displayValue(location.latitude)}
          />
          <ReviewField
            label={resolvedConfig.mapLocationLabels.longitude}
            value={displayValue(location.longitude)}
          />
          {resolvedConfig.identificationFields.map((field) => (
            <ReviewField
              key={field.key}
              label={field.label}
              value={displayValue(
                getIdentificationFieldValue(location, field.key),
              )}
            />
          ))}
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
            value={displayValue(propertyDetails.bedrooms)}
          />
          <ReviewField
            label="Bathrooms"
            value={displayValue(propertyDetails.bathrooms)}
          />
          <ReviewField
            label={builtUpAreaLabel(propertyDetails.built_up_area_unit)}
            value={displayValue(propertyDetails.built_up_area)}
          />
          <ReviewField
            label="Parking Spaces"
            value={displayValue(propertyDetails.parking_spaces)}
          />
          <ReviewField
            label={resolvedConfig.yearBuiltLabel}
            value={displayValue(propertyDetails.year_built)}
          />
          <ReviewField
            label={resolvedConfig.furnishingStatusLabel}
            value={optionLabel(
              resolvedConfig.furnishingStatusOptions,
              propertyDetails.furnishing_status,
              EMPTY_VALUE,
            )}
          />
          <ReviewField
            label="Completion Status"
            value={optionLabel(
              resolvedConfig.completionStatusOptions,
              propertyDetails.completion_status,
              EMPTY_VALUE,
            )}
          />
          <ReviewField
            label={resolvedConfig.floorLevelLabel}
            value={optionLabel(
              resolvedConfig.floorLevelOptions,
              propertyDetails.floor_level,
              EMPTY_VALUE,
            )}
          />
          <ReviewField
            label="Total Floor"
            value={displayValue(propertyDetails.total_floor)}
          />
          <ReviewField
            label="Occupancy"
            value={optionLabel(occupancyOptions, propertyDetails.occupancy, EMPTY_VALUE)}
          />
          <ReviewField
            label="Ownership Type"
            value={optionLabel(
              ownershipTypeOptions,
              propertyDetails.ownership_type,
              EMPTY_VALUE,
            )}
          />
          <ReviewField
            label="Orientation"
            value={optionLabel(
              resolvedConfig.orientationOptions,
              propertyDetails.orientation,
              EMPTY_VALUE,
            )}
          />
          <ReviewField
            label="Reference Number"
            value={displayValue(propertyDetails.reference_number)}
          />
          {resolvedConfig.enableLegacyPermitDld ? (
            <ReviewField
              label="Permit / DLD Number"
              value={displayValue(propertyDetails.permit_dld_number)}
            />
          ) : null}
          <ReviewField
            label="Guard Name"
            value={displayValue(propertyDetails.guard_name)}
          />
          <ReviewField
            label="Guard Phone Number"
            value={displayValue(
              propertyDetails.guard_phone_number
                ? `${propertyDetails.guard_country_code} ${propertyDetails.guard_phone_number}`.trim()
                : "",
            )}
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
              nationalityOptions={resolvedConfig.nationalityOptions}
              ownerModeLabel={
                owner.owner_id || ownerInfo.owner_id
                  ? resolvedConfig.ownerModeLabels.selectedOwner
                  : ownerInfo.owner_mode === "create"
                    ? resolvedConfig.ownerModeLabels.createNew
                    : undefined
              }
            />
          ))
        )}
      </ReviewSection>

      <ReviewSection title="Pricing">
        <dl className={propertyFormGridClasses}>
          {visiblePricingFields.map((field) => (
            <ReviewField
              key={field.key}
              label={field.label}
              value={formatPriceField(
                getPricingFieldValue(pricing, field.key),
                pricing.price_currency,
              )}
            />
          ))}
          {visiblePricingFields.length === 0 ? (
            <ReviewField
              label={resolvedConfig.pricingFieldLabels.price}
              value={formatPriceField(pricing.price, pricing.price_currency)}
            />
          ) : null}
          <ReviewField
            label={resolvedConfig.pricingFieldLabels.serviceCharge}
            value={formatPriceField(
              pricing.service_charge,
              pricing.service_charge_currency,
            )}
          />
          <ReviewField
            label={resolvedConfig.pricingFieldLabels.maintenanceFee}
            value={formatPriceField(
              pricing.maintenance_fee,
              pricing.maintenance_fee_currency,
            )}
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
