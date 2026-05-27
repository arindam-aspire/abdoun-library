"use client";

import { useCallback } from "react";
import type { PropertyCardProps } from "./types";

type ContactAction = "email" | "call" | "whatsapp";

type UsePropertyCardContactOptions = Pick<
  PropertyCardProps,
  "isAuthenticated" | "onEmail" | "onCall" | "onWhatsApp"
> & {
  propertyId: number;
};

export function usePropertyCardContact({
  propertyId,
  isAuthenticated = false,
  onEmail,
  onCall,
  onWhatsApp,
}: UsePropertyCardContactOptions) {
  return useCallback(
    (action: ContactAction) => {
      if (!isAuthenticated) return;
      if (action === "email") onEmail?.(propertyId);
      if (action === "call") onCall?.(propertyId);
      if (action === "whatsapp") onWhatsApp?.(propertyId);
    },
    [isAuthenticated, onCall, onEmail, onWhatsApp, propertyId],
  );
}
