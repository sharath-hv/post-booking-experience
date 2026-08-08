"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

import shiviAvatar from "@/assets/Shivi image.png";
import { BOTTOM_SHEET_OVERLAY_Z_CLASS } from "@/lib/layout/bottom-sheet-layout";
import { BottomSheetPortal } from "@/components/molecules/BottomSheetPortal";
import {
  SHIVI_BUSINESS_HOUR_END,
  SHIVI_BUSINESS_HOUR_START,
  isShiviWithinBusinessHours,
} from "@/lib/shivi-business-hours";
import styles from "./ShiviCallSheet.module.scss";


/** Parity with the other bottom sheets. */
const SHEET_TRANSITION_MS = 280;

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
  const [mounted, setMounted] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const exitTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!open) return;
    if (exitTimeoutRef.current) {
      clearTimeout(exitTimeoutRef.current);
      exitTimeoutRef.current = null;
    }
    setIsOnline(isShiviWithinBusinessHours());
    setMounted(true);
    setAnimateIn(false);
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setAnimateIn(true));
    });
    return () => cancelAnimationFrame(id);
  }, [open]);

  useEffect(() => {
    if (open || !mounted) return;
    setAnimateIn(false);
    exitTimeoutRef.current = setTimeout(() => {
      exitTimeoutRef.current = null;
      setMounted(false);
    }, SHEET_TRANSITION_MS);
    return () => {
      if (exitTimeoutRef.current) {
        clearTimeout(exitTimeoutRef.current);
        exitTimeoutRef.current = null;
      }
    };
  }, [open, mounted]);

  useEffect(() => {
    if (!mounted) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <BottomSheetPortal>
      <div className={cn(styles.fixed_0, BOTTOM_SHEET_OVERLAY_Z_CLASS, styles.flex_0_0)}>
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className={cn(styles.absolute_1, animateIn ? styles.opacity_100_1 : styles.opacity_0_1)}
        />
        <div
          className={cn(styles.relative_2, "sheet-elevated", animateIn ? styles.translate_y_0_2 : styles.translate_y_full_2)}
          role="dialog"
          aria-modal="true"
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

            <h2
              id="shivi-call-sheet-title"
              className={styles.mt_5_3}
            >
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
              className={[styles.primary_cta_5, "primary-cta"].filter(Boolean).join(" ")}
              onClick={onClose}
            >
              Got it
            </button>
          </div>
        </div>
      </div>
    </BottomSheetPortal>
  );
}
