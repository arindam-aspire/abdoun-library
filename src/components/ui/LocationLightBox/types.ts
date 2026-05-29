export type LocationLightBoxProps = {
  isOpen: boolean;
  onClose: () => void;
  latitude?: number | null;
  longitude?: number | null;
  mapEmbedUrl?: string | null;
  mapsOpenUrl?: string | null;
  locationLabel?: string;
  /** Accessible name for the dialog. Defaults to "Location map viewer". */
  ariaLabel?: string;
};
