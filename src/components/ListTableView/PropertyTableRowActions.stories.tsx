import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Mail, Phone, Trash2 } from "lucide-react";
import { WhatsAppIcon } from "../ui/WhatsAppIcon";
import { buildRowActionsFromListingDescriptors } from "./buildListingRowActions";
import { listTableStoryListings } from "./listTableStoryData";
import { submissionApiListTableListings } from "./submissionApiListTableStoryData";
import { PropertyTableRowActions } from "./PropertyTableRowActions";
import { demoWorkflowActions } from "./workflowActionsStoryConfig";

const listing = listTableStoryListings[0]!;

const meta = {
  title: "ListTableView/PropertyTableRowActions",
  component: PropertyTableRowActions,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    listing,
    buttonSize: "md",
    rowActions: [
      {
        id: "email",
        label: "Email",
        icon: <Mail className="size-4 shrink-0" aria-hidden />,
        onClick: fn(),
      },
      {
        id: "call",
        label: "Call",
        icon: <Phone className="size-4 shrink-0" aria-hidden />,
        onClick: fn(),
      },
      {
        id: "whatsapp",
        label: "WhatsApp",
        icon: <WhatsAppIcon className="size-4 shrink-0" />,
        onClick: fn(),
      },
      {
        id: "delete",
        label: "Remove listing",
        icon: <Trash2 className="size-4 shrink-0" aria-hidden />,
        tone: "danger",
        onClick: fn(),
      },
    ],
  },
} satisfies Meta<typeof PropertyTableRowActions>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const FromListingJson: Story = {
  args: {
    listing: submissionApiListTableListings[0]!,
    rowActions: (listing) =>
      buildRowActionsFromListingDescriptors(listing, {
        actionHandlers: demoWorkflowActions,
      }),
  },
  parameters: {
    docs: {
      description: {
        story:
          "Row actions resolved from `listing.actions` in API JSON, with handlers from `workflowActions`.",
      },
    },
  },
};

export const MobileIconButtons: Story = {
  parameters: {
    viewport: { defaultViewport: "mobile1" },
    docs: {
      description: {
        story:
          "Below `sm`: each row action is an `IconButton`. From `sm` up: actions open in the overflow menu.",
      },
    },
  },
};
