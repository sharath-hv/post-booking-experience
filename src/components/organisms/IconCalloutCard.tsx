"use client";

import type { MouseEvent, ReactNode } from "react";

import { IconWell, type IconWellTone } from "@/components/atoms/icon/IconWell";
import { OVERLAY_GLASS_CARD_CLASS } from "@/helpers/overlay-glass-card";
import { cn } from "@/utils/utils";
import styles from "./IconCalloutCard.module.scss";

export type IconCalloutCardCta = {
  label: string;
  href?: string;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
};

export type IconCalloutCardProps = {
  /** Already-sized icon node (next/image at 20px — default IconWell glyph). */
  icon: ReactNode;
  title: string;
  body: string;
  /** Omit for OTP / next-step callouts with no link. */
  cta?: IconCalloutCardCta;
  /** `glass` — frosted overlay surface; `default` — white elevated card. */
  variant?: "default" | "glass";
  /** IconWell tone — default grey; OTP/call uses amber. */
  iconTone?: IconWellTone;
  ariaLabel?: string;
};

/**
 * Shared artifact callout: IconWell + title + body, optional text/hyperlink CTA.
 * Domain wrappers (`NextStepCard`, document/location cards) supply icon + copy.
 */
export function IconCalloutCard({
  icon,
  title,
  body,
  cta,
  variant = "default",
  iconTone = "grey",
  ariaLabel,
}: IconCalloutCardProps) {
  const isGlass = variant === "glass";

  return (
    <section
      className={cn(
        styles.card,
        isGlass ? OVERLAY_GLASS_CARD_CLASS : [styles.cardSolid, "card-elevated"],
      )}
      aria-label={ariaLabel ?? title}
    >
      <div className={styles.row}>
        <IconWell as="div" tone={iconTone} aria-hidden>
          {icon}
        </IconWell>
        <div className={styles.copy}>
          <div className={styles.titleBlock}>
            <p className={styles.title}>{title}</p>
            <p className={styles.body}>{body}</p>
          </div>
          {cta ? (
            <a
              href={cta.href ?? "#"}
              onClick={cta.onClick}
              className={styles.cta}
            >
              {cta.label}
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
