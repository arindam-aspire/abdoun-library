import { fn } from "storybook/test";
import { buildAgentStatusRowActions } from "./agentStatusRowActions";
import type { AgentWorkflowActionsConfig } from "./agentStatusRowActions";

export const demoAgentWorkflowActionHandlers: AgentWorkflowActionsConfig = {
  activate: fn(),
  approve: fn(),
  deactivate: fn(),
  decline: fn(),
  grant_admin: fn(),
  remove: fn(),
};

export const demoAgentStatusRowActions = buildAgentStatusRowActions(
  demoAgentWorkflowActionHandlers,
);
