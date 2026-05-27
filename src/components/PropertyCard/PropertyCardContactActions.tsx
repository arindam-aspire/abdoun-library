"use client";

import { Mail, Phone } from "lucide-react";
import { Button } from "../ui/Button";
import type { ButtonSize } from "../ui/Button/types";
import { IconButton } from "../ui/IconButton";
import { WhatsAppIcon } from "./WhatsAppIcon";

type PropertyCardContactLayout = "grid" | "list";

const layoutConfig: Record<
  PropertyCardContactLayout,
  { buttonClasses: string; size: ButtonSize; truncateEmail: boolean }
> = {
  grid: {
    buttonClasses: "min-h-[38px] min-w-0 shrink-0 gap-2 px-4 py-2 text-sm flex-1",
    size: "sm",
    truncateEmail: true,
  },
  list: {
    buttonClasses: "min-h-[38px] min-w-[7.5rem] gap-2 px-4 py-2 text-sm sm:flex-none",
    size: "md",
    truncateEmail: false,
  },
};

export function PropertyCardContactActions({
  layout,
  onEmail,
  onCall,
  onWhatsApp,
}: {
  layout: PropertyCardContactLayout;
  onEmail: () => void;
  onCall: () => void;
  onWhatsApp: () => void;
}) {
  const { buttonClasses, size, truncateEmail } = layoutConfig[layout];

  const buttons = (
    <>
      <Button
        color="primary"
        variant="solid"
        size={size}
        onClick={onEmail}
        className={buttonClasses}
        iconStart={<Mail className="size-4 shrink-0" aria-hidden />}
      >
        {truncateEmail ? (
          <span className="truncate">Email</span>
        ) : (
          <span>Email</span>
        )}
      </Button>
      <Button
        color="inherit"
        variant="outline"
        size={size}
        onClick={onCall}
        className={buttonClasses}
        iconStart={<Phone className="size-4 shrink-0" aria-hidden />}
      >
        {truncateEmail ? (
          <span className="truncate">Call</span>
        ) : (
          <span>Call</span>
        )}
      </Button>
      <IconButton
        color="inherit"
        variant="outline"
        size={size}
        onClick={onWhatsApp}
        className="size-[38px] shrink-0"
        icon={<WhatsAppIcon className="size-5" />}
        aria-label="WhatsApp"
      />
    </>
  );

  if (layout === "list") {
    return (
      <div className="mt-auto pt-4">
        <div className="flex flex-wrap justify-end gap-2 border-t border-secondary/15 pt-5">
          {buttons}
        </div>
      </div>
    );
  }

  return <div className="mt-auto flex gap-2 pt-4">{buttons}</div>;
}
