import type { ReactNode } from "react";

export type Locale = keyof LocalizedText;

export type ApplicationKey = "abdoun_web" | "mls_web";

export type PropertyDetailsProps = {
  applicationKey?: ApplicationKey;
  propertyDetails: PropertyDetails;
  isLoading?: boolean;
  className?: string;
  locale?: Locale;

  isAuthenticated?: boolean;
  isFavourite?: boolean;
  isFavouriteLoading?: boolean;
  showOwners?: boolean;
  showAgents?: boolean;
  showBadges?: boolean;
  /** Shown under owner name in the sidebar. */
  ownerCompanyLabel?: string;
  role?: PropertyDetailsRole;

  /** Override visible tabs; defaults from `role` when omitted. */
  tabOptions?: PropertyDetailsTabOption[];
  /** Controlled active tab when used with `onTabChange`. */
  activeTab?: PropertyDetailsTabValue;
  /** Uncontrolled initial tab when `activeTab` is omitted. */
  defaultTab?: PropertyDetailsTabValue;
  onTabChange?: (value: PropertyDetailsTabValue) => void;

  onEmail?: (propertyId: number) => void;
  onPhone?: (propertyId: number) => void;
  onWhatsApp?: (propertyId: number) => void;
  onFavourite?: (propertyId: number) => void;
  onOwnerEmail?: (propertyId: number, ownerId: number) => void;
  onOwnerPhone?: (propertyId: number, ownerId: number) => void;
  onOwnerWhatsApp?: (propertyId: number, ownerId: number) => void;
};

export type OverviewTabProps = {
  propertyDetails: PropertyDetails;
  applicationKey?: ApplicationKey;
  locale?: Locale;
  className?: string;
};

export type FeatureTabProps = {
  propertyDetails: PropertyDetails;
  className?: string;
};

export type LocationTabProps = {
  propertyDetails: PropertyDetails;
  locale?: Locale;
  className?: string;
};

export type DocumentsTabProps = {
  propertyDetails: PropertyDetails;
  className?: string;
};

export type PriceAgentSectionProps = {
  propertyDetails: PropertyDetails;
  applicationKey?: ApplicationKey;
  className?: string;
  showAgent?: boolean;
  showOwner?: boolean;
  /** e.g. "Luxury specialist - Abdoun & Dabouq" */
  agentSpecialty?: string;
  /** Shown under owner name; defaults to listing agent / brokerage name. */
  ownerCompanyLabel?: string;
  serviceChargeNote?: string;
  viewingAvailabilityNote?: string;
  conciergeNote?: string;
  onEmail?: () => void;
  onPhone?: () => void;
  onWhatsApp?: () => void;
  onOwnerEmail?: () => void;
  onOwnerPhone?: () => void;
  onOwnerWhatsApp?: () => void;
};

export type PropertyDetailsRole = "agent" | "owner" | "registered_user";

export type PropertyDetailsTabValue =
  | "overview"
  | "features"
  | "locations"
  | "documents";

export type PropertyDetailsTabOption = {
  label: string;
  value: PropertyDetailsTabValue;
  icon?: ReactNode;
};

  export interface PropertyDetails {
    id: number;
    reference_number: string;
    url: string | null;
  
    title: LocalizedText;
    description: LocalizedText;
  
    category: string;
    property_type: string;
    status: string;
    listing_type: "sale" | "rent";
  
    selling_price_amount: number | null;
    selling_price_currency: string | null;
  
    rent_price_amount: number | null;
    rent_price_currency: string | null;
  
    bedrooms: number | null;
    bathrooms: number | null;
    built_up_area: number | null;
  
    more_features: unknown | null;
  
    media: Media;
  
    latitude: number | null;
    longitude: number | null;
    location_name: string | null;
  
    is_exclusive: boolean;
  
    location_detail: LocationDetail;
  
    general: GeneralInfo;
    details: PropertySpecs;
  
    features: Features;
  
    pricing: Pricing;
  
    created_at: string;
    updated_at: string;
    published_at: string | null;
    expires_at: string | null;
    sold_at: string | null;
    rented_at: string | null;
  
    agent: Agent;
    owner: Owner;
    created_by: CreatedBy;
  }
  
  /** ---------------- Shared Types ---------------- */
  
  export interface LocalizedText {
    en: string | null;
    ar: string | null;
    esp: string | null;
    fr: string | null;
  }
  
  export interface Media {
    thumbnail: string | null;
    images: string[];
    videos: string[];
    virtual_tour_url: string | null;
    floor_plan_images: string[];
    documents: string[];
  }
  
  export interface LocationDetail {
    country_id: number;
    country: string;
    city_id: number;
    city: string;
    region_id: number;
    region: string;
    address: LocalizedText;
    latitude: number | null;
    longitude: number | null;
    map_embed_url: string | null;
    local_highlights?: string[];
    lifestyle_description?: string | null;
  }
  
  export interface GeneralInfo {
    floor_type: string | null;
    floor_number: number | null;
    building_status: string | null;
    built_in_year: number | null;
    furniture_status: string | null;
    furniture_condition: string | null;
    garage_type: string | null;
    total_floors_in_building: number | null;
  }
  
  export interface PropertySpecs {
    built_up_area: number | null;
    land_area: number | null;
    garden_area: number | null;
    terrace_area: number | null;
    area_unit: string | null;
  
    bedrooms: number | null;
    master_bedrooms: number | null;
    bathrooms: number | null;
  
    living_rooms: number | null;
    salons: number | null;
    balconies: number | null;
    entrances: number | null;
    kitchens: number | null;
  
    kitchen_type: string | null;
    maid_rooms: number | null;
    driver_rooms: number | null;
    store_rooms: number | null;
  }
  
  export interface Features {
    amenities: string[];
  }
  
  export interface Pricing {
    listing_type: "sale" | "rent";
    selling_price: number | null;
    currency: string | null;
    price_on_request: boolean;
  
    rent_commission_percent: number | null;
    contract_duration: number | null;
    payment_method: string | null;
  
    is_negotiable: boolean;
    installment_available: boolean;
  }
  
  export interface Agent {
    id: number;
    name: string;
    phone: string;
    whatsapp: string;
    email: string;
    photo: string | null;
    license_number: string | null;
  }
  
  export interface Owner {
    id: number;
    name: string;
    phone: string;
    email: string;
    is_private: boolean;
  }
  
  export interface CreatedBy {
    id: number;
    name: string;
    role: string;
  }

  /** ---------------- Hero Section ---------------- */

  export type HeroSectionProps = {
    images: string[];
    title: string;
    location: string;
    listingType: "sale" | "rent";
    isExclusive?: boolean;
    /** Defaults to broker/agency name when exclusive. */
    exclusiveLabel?: string;
    brokerName?: string;
    listingBadgeLabel?: string;
    isAuthenticated?: boolean;
    isFavourite?: boolean;
    isFavouriteLoading?: boolean;
    onFavourite?: () => void;
    className?: string;
  };

  export type HeroSectionLightBoxProps = {
    isOpen: boolean;
    onClose: () => void;
    images: string[];
    activeIndex: number;
    onActiveIndexChange: (index: number) => void;
    title: string;
    ariaLabel?: string;
  };
  