import { mapAgentApiStatus } from "./agentStatus";
import type { Agent } from "./types";

/** Shape returned by the agents list API. */
export type AgentApiListing = {
  id: string;
  email?: string | null;
  fullName: string;
  phone?: string | null;
  serviceArea: string;
  status: string;
  /** ISO timestamp for last review / activity. */
  reviewedAt?: string | null;
};

export function mapAgentApiListingToAgent(listing: AgentApiListing): Agent {
  return {
    id: listing.id,
    name: listing.fullName,
    email: listing.email?.trim() || undefined,
    phone: listing.phone?.trim() || undefined,
    city: listing.serviceArea,
    status: mapAgentApiStatus(listing.status),
    activityDate: listing.reviewedAt ?? "",
  };
}

export function mapAgentApiListingsToAgents(listings: AgentApiListing[]): Agent[] {
  return listings.map(mapAgentApiListingToAgent);
}
