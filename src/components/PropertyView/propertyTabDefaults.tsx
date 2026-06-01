import { FileText, Info, MapPin, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import type { PropertyViewTabOption } from "./types";

const TAB_ICON_CLASS = "size-4 shrink-0";

const DEFAULT_TAB_ICONS: Record<string, ReactNode> = {
  overview: <Info className={TAB_ICON_CLASS} aria-hidden />,
  features: <Sparkles className={TAB_ICON_CLASS} aria-hidden />,
  locations: <MapPin className={TAB_ICON_CLASS} aria-hidden />,
  documents: <FileText className={TAB_ICON_CLASS} aria-hidden />,
};

/** Maps PropertyView tab options to Tab items with icons resolved. */
export function mapPropertyViewTabOptions(
  tabOptions: PropertyViewTabOption[],
) {
  return tabOptions.map((tab) => ({
    value: tab.value,
    label: tab.label,
    icon:
      tab.icon ??
      tab.iconStart ??
      DEFAULT_TAB_ICONS[tab.value.toLowerCase()],
  }));
}
