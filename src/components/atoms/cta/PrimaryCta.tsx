"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

import { CtaLottieLoader } from "@/components/atoms/cta/CtaLottieLoader";
import { cn } from "@/utils/utils";

type PrimaryCtaProps = {
  children: ReactNode;
  loading?: boolean;
  /** Screen-reader label while the Lottie replaces the visible text. */
  loadingLabel?: string;
  className?: string;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">;

/**
 * Primary CTA that swaps its label for the in-button loader while navigating.
 * Does not use native `disabled` during loading (that greys the button).
 */
export function PrimaryCta({
  children,
  loading = false,
  loadingLabel = "Loading",
  className,
  disabled,
  type = "button",
  ...props
}: PrimaryCtaProps) {
  return (
    <button
      type={type}
      {...props}
      disabled={loading ? false : disabled}
      aria-busy={loading || undefined}
      aria-label={loading ? loadingLabel : props["aria-label"]}
      className={cn("primary-cta", loading && "cta-navigating", className)}
    >
      <span className={loading ? "cta-label-hold" : undefined}>{children}</span>
      {loading ? (
        <span className="cta-loader-slot" aria-hidden>
          <CtaLottieLoader />
        </span>
      ) : null}
    </button>
  );
}
