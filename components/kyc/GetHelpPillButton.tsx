"use client";

import Image from "next/image";

import { KYC_ASSETS } from "@/components/kyc/kyc-assets";
import { cn } from "@/lib/utils";

type GetHelpPillButtonProps = {
  /** Coachmark state — Shivi intro on KYC pending ([Figma 2479:7600](https://www.figma.com/design/nW5SWmJdxxsCEDlqBN7C0L/Post-booking-experience?node-id=2479-7600)). */
  highlighted?: boolean;
  /** Translucent pill on dark loan-application header ([Figma 2841:8477](https://www.figma.com/design/nW5SWmJdxxsCEDlqBN7C0L/Post-booking-experience?node-id=2841-8477)). */
  variant?: "default" | "onDark";
  onClick?: () => void;
};

/** Nav “Get help” pill — aligned with `/kyc` (KycPendingScreen) and booking-processing shell. */
export function GetHelpPillButton({
  highlighted = false,
  variant = "default",
  onClick,
}: GetHelpPillButtonProps) {
  const onDark = variant === "onDark";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={highlighted ? "true" : undefined}
      className={cn(
        "flex h-8 shrink-0 items-center gap-2 rounded-[32px] pl-0.5 transition-colors focus-visible:outline focus-visible:ring-2 focus-visible:ring-offset-2",
        onDark
          ? "bg-white/20 pr-3 text-white hover:bg-white/25 focus-visible:ring-white/30"
          : "border bg-white pr-3 text-[#121212] hover:bg-[#fafafa] focus-visible:ring-[#121212]/20",
        !onDark &&
          (highlighted
            ? "relative z-[1] border-[#121212] shadow-[0_4px_16px_rgba(0,0,0,0.12)]"
            : "border-[#e8e8e8]")
      )}
    >
      <span
        className={cn(
          "relative h-7 shrink-0 overflow-hidden rounded-[15.75px]",
          onDark ? "w-9 bg-[#f5f5f5]" : "w-9"
        )}
        aria-hidden
      >
        <Image
          src={KYC_ASSETS.avatarSmall}
          alt=""
          fill
          className="object-cover"
          unoptimized
          sizes="36px"
        />
      </span>
      <span className={cn("text-xs font-medium leading-[18px]", onDark && "text-white")}>
        Get help
      </span>
    </button>
  );
}
