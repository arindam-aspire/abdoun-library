import { mapAgentApiStatus } from "./agentStatus";
import type { Agent } from "./types";

/** Shape returned by the agents list API. */
export type AgentApiListing = {
  id: string;
  email: string;
  status: string;
  /** ISO timestamp for last review / activity. */
  reviewedAt: string;
  fullName?: string | null;
  phone?: string | null;
  serviceArea?: string | null;
};

export function mapAgentApiListingToAgent(listing: AgentApiListing): Agent {
  return {
    id: listing.id,
    email: listing.email.trim(),
    status: mapAgentApiStatus(listing.status),
    activityDate: listing.reviewedAt.trim(),
    name: listing.fullName?.trim() || undefined,
    phone: listing.phone?.trim() || undefined,
    city: listing.serviceArea?.trim() || undefined,
  };
}

export function mapAgentApiListingsToAgents(listings: AgentApiListing[]): Agent[] {
  return listings.map(mapAgentApiListingToAgent);
}
