import { fn } from "storybook/test";
import type { PropertyTableWorkflowActionsConfig } from "./propertyTableWorkflowActions";

export const demoWorkflowActions: PropertyTableWorkflowActionsConfig = {
  view: { onClick: fn() },
  approve: { onClick: fn() },
  reject: { onClick: fn() },
  continue: { onClick: fn() },
  assign: {
    onClick: fn(),
    hidden: (listing) => !listing.agent,
  },
  reassign: { onClick: fn() },
  unassign: {
    onClick: fn(),
    hidden: (listing) => !listing.agent,
  },
};
