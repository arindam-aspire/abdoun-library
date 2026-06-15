import type { ReactNode } from "react";
import { Mail, Phone, Trash2 } from "lucide-react";
import { WhatsAppIcon } from "../ui/WhatsAppIcon";
import type { PropertyListing } from "../PropertyCardList/types";
import {
  resolvePropertyTableRowActions,
  type PropertyTableRowAction,
} from "./rowActionTypes";
import type {
  PropertyTableWorkflowActionId,
  PropertyTableWorkflowActionsConfig,
} from "./propertyTableWorkflowActions";
import {
  getDefaultWorkflowActionHidden,
  getWorkflowActionPresentation,
  isPropertyTableWorkflowActionId,
} from "./propertyTableWorkflowActions";

type ContactActionHandlers = {
  onClickEmail?: (listing: PropertyListing) => void;
  onClickCall?: (listing: PropertyListing) => void;
  onClickWhatsApp?: (listing: PropertyListing) => void;
  canViewDelete?: boolean;
  onClickDelete?: (listing: PropertyListing) => void;
};

export type BuildListingRowActionsOptions = ContactActionHandlers & {
  actionHandlers?: PropertyTableWorkflowActionsConfig;
  onRowAction?: (actionId: string, listing: PropertyListing) => void;
};

const CONTACT_ACTION_LABELS: Record<string, string> = {
  email: "Email",
  call: "Call",
  whatsapp: "WhatsApp",
  delete: "Remove listing",
};

const CONTACT_ACTION_ICONS: Record<string, ReactNode> = {
  email: <Mail className="size-4 shrink-0" aria-hidden />,
  call: <Phone className="size-4 shrink-0" aria-hidden />,
  whatsapp: <WhatsAppIcon className="size-4 shrink-0" />,
  delete: <Trash2 className="size-4 shrink-0" aria-hidden />,
};

function resolveListingActionHandler(
  actionId: string,
  listing: PropertyListing,
  options: BuildListingRowActionsOptions,
): ((listing: PropertyListing) => void) | undefined {
  if (isPropertyTableWorkflowActionId(actionId)) {
    const workflowHandler = options.actionHandlers?.[actionId]?.onClick;
    if (workflowHandler) {
      return workflowHandler;
    }
  }

  switch (actionId) {
    case "email":
      return options.onClickEmail;
    case "call":
      return options.onClickCall;
    case "whatsapp":
      return options.onClickWhatsApp;
    case "delete":
      return options.canViewDelete ? options.onClickDelete : undefined;
    default:
      break;
  }

  if (options.onRowAction) {
    return () => options.onRowAction!(actionId, listing);
  }

  return undefined;
}

function resolveListingActionPresentation(
  actionId: string,
  workflowConfig:
    | PropertyTableWorkflowActionsConfig[PropertyTableWorkflowActionId]
    | undefined,
) {
  if (workflowConfig?.label || workflowConfig?.icon) {
    return {
      label: workflowConfig.label,
      icon: workflowConfig.icon,
    };
  }

  if (isPropertyTableWorkflowActionId(actionId)) {
    return getWorkflowActionPresentation(actionId);
  }

  return {
    label: CONTACT_ACTION_LABELS[actionId],
    icon: CONTACT_ACTION_ICONS[actionId],
  };
}

/** Builds interactive row actions from `listing.actions` JSON plus host handlers. */
export function buildRowActionsFromListingDescriptors(
  listing: PropertyListing,
  options: BuildListingRowActionsOptions,
): PropertyTableRowAction[] {
  if (!listing.actions?.length) {
    return [];
  }

  const actions = listing.actions.flatMap((descriptor) => {
    if (descriptor.hidden) {
      return [];
    }

    const workflowConfig = isPropertyTableWorkflowActionId(descriptor.id)
      ? options.actionHandlers?.[descriptor.id]
      : undefined;

    const onClick = resolveListingActionHandler(
      descriptor.id,
      listing,
      options,
    );
    if (!onClick) {
      return [];
    }

    const presentation = resolveListingActionPresentation(
      descriptor.id,
      workflowConfig,
    );

    const defaultTone =
      descriptor.id === "reject" || descriptor.id === "delete"
        ? "danger"
        : "default";

    return [
      {
        id: descriptor.id,
        label:
          descriptor.label ?? presentation.label ?? descriptor.id,
        icon: presentation.icon,
        onClick,
        tone: descriptor.tone ?? defaultTone,
        hidden:
          workflowConfig?.hidden ??
          (isPropertyTableWorkflowActionId(descriptor.id)
            ? getDefaultWorkflowActionHidden(descriptor.id)
            : undefined),
        disabled: descriptor.disabled ?? workflowConfig?.disabled,
        loading:
          descriptor.loading ??
          workflowConfig?.loading ??
          (descriptor.id === "delete"
            ? (row: PropertyListing) => Boolean(row.is_delete_loading)
            : undefined),
        loadingLabel:
          descriptor.loadingLabel ??
          workflowConfig?.loadingLabel ??
          (descriptor.id === "delete" ? "Removing…" : undefined),
      } satisfies PropertyTableRowAction,
    ];
  });

  return resolvePropertyTableRowActions(listing, actions);
}

export function createListingActionsResolver(
  options: BuildListingRowActionsOptions,
) {
  return (listing: PropertyListing) =>
    buildRowActionsFromListingDescriptors(listing, options);
}
