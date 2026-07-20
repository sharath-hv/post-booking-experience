"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

import shiviAvatar from "@/assets/Shivi small.png";
import { BOTTOM_SHEET_OVERLAY_Z_CLASS } from "@/components/ui/bottom-sheet-layout";
import { BottomSheetPortal } from "@/components/ui/BottomSheetPortal";
import styles from "./ShiviCallSheet.module.scss";


/** Parity with the other bottom sheets. */
const SHEET_TRANSITION_MS = 280;

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
  const exitTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!open) return;
    if (exitTimeoutRef.current) {
      clearTimeout(exitTimeoutRef.current);
      exitTimeoutRef.current = null;
    }
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

            <h2
              id="shivi-call-sheet-title"
              className={styles.mt_5_3}
            >
              On it. I&apos;ll call you within 10 minutes.
            </h2>
            <p className={styles.mt_2_4}>
              The call comes from ACKO Drive on your number ending in 21. Keep your phone handy.
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
