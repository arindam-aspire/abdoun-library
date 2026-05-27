import type { PropertyOwner } from "./types";

export function PropertyCardOwners({ owners }: { owners: PropertyOwner[] }) {
  return (
    <div className="mt-4 space-y-2">
      {owners.map((owner) => (
        <div
          key={owner.owner_id}
          className="rounded-lg bg-surface px-2 py-1.5 ring-1 ring-secondary/10 dark:bg-page"
        >
          {owner.full_name ? (
            <p className="text-sm text-text">{owner.full_name}</p>
          ) : null}
          {owner.phone ? (
            <p className="text-xs text-text/60">{owner.phone}</p>
          ) : null}
        </div>
      ))}
    </div>
  );
}
