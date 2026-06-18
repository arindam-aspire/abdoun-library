import { fn } from "storybook/test";
import type { AgentWorkflowActionsConfig } from "./agentStatusRowActions";

export const demoAgentWorkflowActionHandlers: AgentWorkflowActionsConfig = {
  activate: fn(),
  approve: fn(),
  deactivate: fn(),
  decline: fn(),
  grant_admin: fn(),
  resend: fn(),
  revoke: fn(),
  remove: fn(),
};
