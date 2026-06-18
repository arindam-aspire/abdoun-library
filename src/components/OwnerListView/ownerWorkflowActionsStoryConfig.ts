import { fn } from "storybook/test";
import { buildOwnerRowActions } from "./ownerWorkflowActions";
import type { OwnerWorkflowActionsConfig } from "./ownerWorkflowActions";

export const demoOwnerWorkflowActionHandlers: OwnerWorkflowActionsConfig = {
  view: fn(),
  activate: fn(),
  suspend: fn(),
  delete: fn(),
};

export const demoOwnerRowActions = buildOwnerRowActions(
  demoOwnerWorkflowActionHandlers,
);
