export type ImageLightBoxProps = {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  activeIndex: number;
  onActiveIndexChange: (index: number) => void;
  alt: string;
  /** Accessible name for the dialog. Defaults to "Image viewer". */
  ariaLabel?: string;
};
