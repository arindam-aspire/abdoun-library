export type {
  AgentRowAction as OwnerRowAction,
  AgentRowActionTone as OwnerRowActionTone,
  AgentRowActionsDisplay as OwnerRowActionsDisplay,
  AgentRowActionsInput as OwnerRowActionsInput,
  AgentMobileRowActionsConfig as OwnerMobileRowActionsConfig,
  AgentMobileRowActionsPlacement as OwnerMobileRowActionsPlacement,
  AgentMobileRowActionsVariant as OwnerMobileRowActionsVariant,
} from "../AgentListView/rowActionTypes";

export {
  DEFAULT_AGENT_MOBILE_ROW_ACTIONS as DEFAULT_OWNER_MOBILE_ROW_ACTIONS,
  resolveAgentMobileRowActionsConfig as resolveOwnerMobileRowActionsConfig,
  resolveAgentRowActions as resolveOwnerRowActions,
  isAgentRowActionDisabled as isOwnerRowActionDisabled,
  isAgentRowActionLoading as isOwnerRowActionLoading,
} from "../AgentListView/rowActionTypes";
