import { Mail, Phone, Trash2 } from "lucide-react";
import { WhatsAppIcon } from "../ui/WhatsAppIcon";
import type { PropertyListing } from "../PropertyCardList/types";
import type { PropertyTableRowAction } from "./rowActionTypes";

type LegacyRowActionHandlers = {
  onClickEmail?: (listing: PropertyListing) => void;
  onClickCall?: (listing: PropertyListing) => void;
  onClickWhatsApp?: (listing: PropertyListing) => void;
  canViewDelete?: boolean;
  onClickDelete?: (listing: PropertyListing) => void;
};

export function buildDefaultPropertyRowActions({
  onClickEmail,
  onClickCall,
  onClickWhatsApp,
  canViewDelete,
  onClickDelete,
}: LegacyRowActionHandlers): PropertyTableRowAction[] | undefined {
  const actions: PropertyTableRowAction[] = [];

  if (onClickEmail) {
    actions.push({
      id: "email",
      label: "Email",
      icon: <Mail className="size-4 shrink-0" aria-hidden />,
      onClick: onClickEmail,
    });
  }

  if (onClickCall) {
    actions.push({
      id: "call",
      label: "Call",
      icon: <Phone className="size-4 shrink-0" aria-hidden />,
      onClick: onClickCall,
    });
  }

  if (onClickWhatsApp) {
    actions.push({
      id: "whatsapp",
      label: "WhatsApp",
      icon: <WhatsAppIcon className="size-4 shrink-0" />,
      onClick: onClickWhatsApp,
    });
  }

  if (canViewDelete && onClickDelete) {
    actions.push({
      id: "delete",
      label: "Remove listing",
      loadingLabel: "Removing…",
      icon: <Trash2 className="size-4 shrink-0" aria-hidden />,
      tone: "danger",
      onClick: onClickDelete,
      loading: (listing) => Boolean(listing.is_delete_loading),
    });
  }

  return actions.length > 0 ? actions : undefined;
}
