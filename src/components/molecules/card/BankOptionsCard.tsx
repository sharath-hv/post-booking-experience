"use client";

import Image, { type StaticImageData } from "next/image";

import arrowRightIcon from "@/assets/Arrow_right.svg";
import { Badge } from "@/components/atoms/status/Badge";
import { IconWell } from "@/components/atoms/icon/IconWell";
import { cn } from "@/utils/utils";

import styles from "./BankOptionsCard.module.scss";

export type BankOptionsCardProps = {
  name: string;
  logo: StaticImageData | string;
  rateLabel: string;
  ratePrefix?: string;
  rateType?: "Fixed" | "Floating";
  lockInSummary?: string;
  preApproved?: boolean;
  preApprovedLabel?: string;
  onSelect: () => void;
  className?: string;
};

/** Bank picker row — logo, rate, optional lock-in. */
export function BankOptionsCard({
  name,
  logo,
  rateLabel,
  ratePrefix = "Interest rate from ",
  rateType,
  lockInSummary,
  preApproved = false,
  preApprovedLabel = "Pre-approved loan available for you",
  onSelect,
  className,
}: BankOptionsCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(preApproved ? styles.cardPreApproved : styles.card, className)}
      aria-label={preApproved ? `${name}, pre-approved` : undefined}
    >
      {preApproved ? <div className={styles.preApprovedBanner}>{preApprovedLabel}</div> : null}

      <div className={styles.content}>
        <div className={styles.row}>
          <IconWell as="div" aria-hidden>
            <Image src={logo} alt="" width={24} height={24} className={styles.logo} unoptimized />
          </IconWell>
          <div className={styles.copy}>
            <div className={styles.titleRow}>
              <p className={styles.name}>{name}</p>
              {rateType ? <Badge>{rateType === "Fixed" ? "Fixed rate" : "Floating rate"}</Badge> : null}
            </div>
            <p className={styles.rateLine}>
              {ratePrefix}
              <span className={styles.rateValue}>{rateLabel}</span>
            </p>
          </div>
        </div>

        {lockInSummary ? (
          <div className={styles.lockIn}>
            <p className={styles.lockInText}>{lockInSummary}</p>
            <span className={styles.chevron} aria-hidden>
              <Image
                src={arrowRightIcon}
                alt=""
                fill
                className={styles.chevronImage}
                unoptimized
                sizes="20px"
              />
            </span>
          </div>
        ) : null}
      </div>
    </button>
  );
}
