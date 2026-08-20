"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

import { CtaLottieLoader } from "@/components/atoms/cta/CtaLottieLoader";
import { cn } from "@/utils/utils";

export type CtaButtonVariant = "primary" | "secondary" | "outline";

const VARIANT_CLASS: Record<CtaButtonVariant, string> = {
  primary: "primary-cta",
  secondary: "reply-soft-cta",
  outline: "demo-nav-cta",
};

export type CtaButtonProps = {
  children: ReactNode;
  variant?: CtaButtonVariant;
  loading?: boolean;
  /** Screen-reader label while the Lottie replaces the visible text. */
  loadingLabel?: string;
  className?: string;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">;

/**
 * Shared 48px CTA chrome. Variants map to existing global classes so visuals stay identical.
 */
export function CtaButton({
  children,
  variant = "primary",
  loading = false,
  loadingLabel = "Loading",
  className,
  disabled,
  type = "button",
  ...props
}: CtaButtonProps) {
  const loaderTone = variant === "primary" ? "onDark" : "onLight";

  return (
    <button
      type={type}
      {...props}
      disabled={loading ? false : disabled}
      aria-busy={loading || undefined}
      aria-label={loading ? loadingLabel : props["aria-label"]}
      className={cn(VARIANT_CLASS[variant], loading && "cta-navigating", className)}
    >
      <span className={loading ? "cta-label-hold" : undefined}>{children}</span>
      {loading ? (
        <span className="cta-loader-slot" aria-hidden>
          <CtaLottieLoader tone={loaderTone} />
        </span>
      ) : null}
    </button>
  );
}
