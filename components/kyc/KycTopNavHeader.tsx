"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

const SCROLL_SOLID_THRESHOLD_PX = 8;

export function BackChevron() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="block h-6 w-6" aria-hidden>
      <path
        d="M15 18l-6-6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export type KycTopNavHeaderProps = {
  /** Optional label after back (e.g. checkout title). */
  title?: string;
  /** Content after back with 24px gap (e.g. buying-guide progress). */
  afterBack?: ReactNode;
  /** Optional right-side control (e.g. “Get help” pill). */
  endSlot?: ReactNode;
  /** No solid fill — use over gradients/animations; stays above layers via z-index. */
  transparent?: boolean;
  /** White controls on dark hero backgrounds (loan application header). */
  inverted?: boolean;
  /** Override default `router.back()` for the back chevron. */
  onBack?: () => void;
  className?: string;
};

/**
 * Sticky top bar with back control — Post-booking-experience (Figma 1890:7978):
 * 56px height, 14px left / 20px right padding, max width 640px, 24×24 chevron.
 */
export function KycTopNavHeader({
  title,
  afterBack,
  endSlot,
  transparent = false,
  inverted = false,
  onBack,
  className,
}: KycTopNavHeaderProps = {}) {
  const router = useRouter();
  const [solidOnScroll, setSolidOnScroll] = useState(false);

  useEffect(() => {
    if (!transparent || inverted) {
      return;
    }
    const onScroll = () => {
      setSolidOnScroll(window.scrollY > SCROLL_SOLID_THRESHOLD_PX);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [transparent, inverted]);

  return (
    <header
      className={cn(
        "sticky top-0 mx-auto flex h-14 w-full max-w-[640px] shrink-0 items-center justify-between gap-2 pl-3.5 pr-5",
        transparent || inverted ? "z-20" : "z-10",
        className
      )}
    >
      {!inverted ? (
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-x-0 top-0 -z-[1] h-[84px] bg-[linear-gradient(to_bottom,#F7FAFF_50%,rgba(247,250,255,0)_100%)] transition-opacity duration-200 ease-out",
            transparent && !solidOnScroll ? "opacity-0" : "opacity-100"
          )}
        />
      ) : null}
      <div
        className={cn(
          "flex min-h-0 min-w-0 flex-1 items-center",
          afterBack != null ? "gap-6" : "gap-2"
        )}
      >
        <button
          type="button"
          onClick={() => (onBack != null ? onBack() : router.back())}
          className={cn(
            "cta-ghost -ml-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg focus-visible:outline focus-visible:ring-2 focus-visible:ring-offset-2",
            inverted
              ? "text-white focus-visible:ring-white/30"
              : "text-[#121212] focus-visible:ring-[#121212]/20"
          )}
          aria-label="Go back"
        >
          <BackChevron />
        </button>
        {afterBack != null ? (
          <div className="flex min-h-0 min-w-0 flex-1 items-center">{afterBack}</div>
        ) : null}
        {title ? (
          <h1
            className={cn(
              "min-w-0 truncate text-base font-semibold leading-6",
              inverted ? "text-white" : "text-[#121212]"
            )}
          >
            {title}
          </h1>
        ) : null}
      </div>
      {endSlot ? <div className="flex shrink-0 items-center">{endSlot}</div> : null}
    </header>
  );
}
