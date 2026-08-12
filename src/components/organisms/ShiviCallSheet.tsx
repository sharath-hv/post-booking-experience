"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import shiviAvatar from "@/assets/Shivi image.png";
import { BottomSheetShell } from "@/components/organisms/BottomSheetShell";
import {
  SHIVI_BUSINESS_HOUR_END,
  SHIVI_BUSINESS_HOUR_START,
  isShiviWithinBusinessHours,
} from "@/helpers/shivi-business-hours";
import { cn } from "@/utils/utils";

import styles from "./ShiviCallSheet.module.scss";

function formatHourLabel(hour24: number): string {
  const period = hour24 >= 12 ? "PM" : "AM";
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return `${hour12} ${period}`;
}

const BUSINESS_HOURS_LABEL = `${formatHourLabel(SHIVI_BUSINESS_HOUR_START)}–${formatHourLabel(SHIVI_BUSINESS_HOUR_END)}`;

export type ShiviCallSheetProps = {
  open: boolean;
  onClose: () => void;
};

/**
 * “Call me” confirmation — tapping a call affordance gets an immediate,
 * personal commitment from Shivi instead of a ticket number.
 */
export function ShiviCallSheet({ open, onClose }: ShiviCallSheetProps) {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    if (!open) return;
    setIsOnline(isShiviWithinBusinessHours());
  }, [open]);

  return (
    <BottomSheetShell
      open={open}
      onClose={onClose}
      showCloseButton={false}
      constrainHeight={false}
      aria-labelledby="shivi-call-sheet-title"
    >
      <div className={styles.flex_0}>
        <div className={styles.avatarWrap}>
          <div className={styles.relative_1}>
            <Image
              src={shiviAvatar}
              alt=""
              fill
              className={styles.object_cover_2}
              unoptimized
              sizes="64px"
              priority
            />
          </div>
          <span
            className={cn(
              styles.statusDot,
              isOnline ? styles.statusOnline : styles.statusOffline,
            )}
            aria-label={isOnline ? "Shivi is online" : "Shivi is offline"}
            title={
              isOnline
                ? `Online · ${BUSINESS_HOURS_LABEL} IST`
                : `Away · back ${BUSINESS_HOURS_LABEL} IST`
            }
          />
        </div>

        <h2 id="shivi-call-sheet-title" className={styles.mt_5_3}>
          {isOnline
            ? "On it. I'll call you within 10 minutes."
            : "I'll call you once I'm back online."}
        </h2>
        <p className={styles.mt_2_4}>
          {isOnline
            ? "The call comes from ACKO Drive on your number ending in 21. Keep your phone handy."
            : `I'm away outside business hours (${BUSINESS_HOURS_LABEL} IST). Expect my call when we're open. It comes from ACKO Drive on your number ending in 21.`}
        </p>

        <button
          type="button"
          className={cn(styles.primary_cta_5, "primary-cta")}
          onClick={onClose}
        >
          Got it
        </button>
      </div>
    </BottomSheetShell>
  );
}
