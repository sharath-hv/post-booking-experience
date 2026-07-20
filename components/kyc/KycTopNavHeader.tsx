"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import styles from "./KycTopNavHeader.module.scss";


const SCROLL_SOLID_THRESHOLD_PX = 8;

export function BackChevron() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={styles.block_0} aria-hidden>
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
  /** Disable sticky positioning — use when the header is inside a non-scrolling hero block. */
  noSticky?: boolean;
  /** Override default `router.back()` for the back chevron. */
  onBack?: () => void;
  /** Sticky fade matches page surface — modify-selection routes use white. */
  surface?: "default" | "white";
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
  noSticky = false,
  onBack,
  surface = "default",
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
        styles.mx_auto_3,
        !noSticky && styles.sticky_4,
        transparent || inverted ? styles.z_20_5 : styles.z_10_6,
        className
      )}
    >
      {!inverted ? (
        <span
          aria-hidden
          className={cn(
            styles.pointer_events_none_7,
            surface === "white"
              ? styles.bg_linear_gradient_to_bo_0
              : styles.bg_linear_gradient_to_bo_0_0,
            transparent && !solidOnScroll ? styles.opacity0 : styles.opacity100,
          )}
        />
      ) : null}
      <div
        className={cn(
          styles.flex_1,
          afterBack != null ? styles.gap_6_9 : styles.gap_2_10
        )}
      >
        <button
          type="button"
          onClick={() => (onBack != null ? onBack() : router.back())}
          className={cn(
            styles.cta_ghost_11, "cta-ghost",
            inverted
              ? styles.text_white_12
              : styles.text_121212__13
          )}
          aria-label="Go back"
        >
          <BackChevron />
        </button>
        {afterBack != null ? (
          <div className={styles.flex_1}>{afterBack}</div>
        ) : null}
        {title ? (
          <h1
            className={cn(
              styles.min_w_0_14,
              inverted ? styles.text_white_15 : styles.text_121212__16
            )}
          >
            {title}
          </h1>
        ) : null}
      </div>
      {endSlot ? <div className={styles.flex_2}>{endSlot}</div> : null}
    </header>
  );
}
