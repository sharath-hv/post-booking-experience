"use client";

import Image from "next/image";
import { useCallback, type MouseEvent } from "react";

import locationIcon from "@/assets/Location.svg";
import { OVERLAY_GLASS_CARD_CLASS } from "@/lib/overlay-glass-card";
import { cn } from "@/lib/utils";
import styles from "./PartnerGarageCard.module.scss";

export type PartnerGarageCardProps = {
  /** Garage / dealership name. */
  name?: string;
  /** Address or locality line. */
  detail?: string;
  /** Optional maps / directions URL. Prevents navigation when omitted. */
  directionsHref?: string;
  /** `glass` — frosted gradient surface used on confirmation / overlay stacks. */
  variant?: "default" | "glass";
};

/**
 * Partner garage callout — same card pattern as {@link ProformaInvoiceCard}.
 */
export function PartnerGarageCard({
  name = "Advaith Hyundai",
  detail = "Whitefield · Bengaluru",
  directionsHref,
  variant = "default",
}: PartnerGarageCardProps) {
  const onPlaceholderClick = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      if (!directionsHref) e.preventDefault();
    },
    [directionsHref],
  );

  const isGlass = variant === "glass";

  return (
    <section
      className={cn(
        styles.card,
        isGlass ? OVERLAY_GLASS_CARD_CLASS : [styles.cardSolid, "card-elevated"],
      )}
      aria-label="Partner garage"
    >
      <div className={styles.row}>
        <div className={styles.iconWell} aria-hidden>
          <Image
            src={locationIcon}
            alt=""
            width={24}
            height={24}
            className={styles.icon}
            unoptimized
          />
        </div>
        <div className={styles.copy}>
          <div className={styles.titleBlock}>
            <p className={styles.title}>{name}</p>
            <p className={styles.subtitle}>{detail}</p>
          </div>
          <a
            href={directionsHref ?? "#"}
            onClick={onPlaceholderClick}
            className={styles.cta}
          >
            Get directions
          </a>
        </div>
      </div>
    </section>
  );
}
