import type { ReactNode } from "react";

import { StatusGlyph, type StatusGlyphState } from "@/components/atoms/status/StatusGlyph";
import { cn } from "@/utils/utils";

import styles from "./StatusLine.module.scss";

export type StatusLineTone = "ink" | "muted" | "success" | "warning" | "eta";

export type StatusLineProps = {
  state: StatusGlyphState;
  children: ReactNode;
  variant?: "item" | "footer";
  tone?: StatusLineTone;
  className?: string;
};

/** One working-feed row: status glyph + copy. */
export function StatusLine({
  state,
  children,
  variant = "item",
  tone = "ink",
  className,
}: StatusLineProps) {
  const toneClass =
    tone === "muted"
      ? styles.muted
      : tone === "success"
        ? styles.success
        : tone === "warning"
          ? styles.warning
          : tone === "eta"
            ? styles.eta
            : styles.ink;

  return (
    <div className={cn(variant === "footer" ? styles.footer : styles.item, "kyc-stagger", className)}>
      <StatusGlyph state={state} />
      <span className={cn(tone === "success" || tone === "warning" || tone === "eta" ? undefined : styles.label, toneClass)}>
        {children}
      </span>
    </div>
  );
}
