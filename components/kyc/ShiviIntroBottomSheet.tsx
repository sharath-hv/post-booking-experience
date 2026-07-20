"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useRef, useState } from "react";

import shiviAvatar from "@/assets/Shivi small.png";
import { BOTTOM_SHEET_OVERLAY_Z_CLASS } from "@/components/ui/bottom-sheet-layout";
import { ShiviIntroCoachmark } from "@/components/kyc/ShiviIntroCoachmark";
import styles from "./ShiviIntroBottomSheet.module.scss";


/** Parity with `ManageBookingBottomSheet`. */
const SHEET_TRANSITION_MS = 280;

const USER_NAME = "Sharath";

export type ShiviIntroBottomSheetProps = {
  open: boolean;
  onClose: () => void;
};

/**
 * Shivi RM intro — [Figma 2479:7600](https://www.figma.com/design/nW5SWmJdxxsCEDlqBN7C0L/Post-booking-experience?node-id=2479-7600).
 */
export function ShiviIntroBottomSheet({ open, onClose }: ShiviIntroBottomSheetProps) {
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

  const onGotIt = useCallback(() => {
    onClose();
  }, [onClose]);

  if (!mounted) return null;

  return (
    <div className={cn(styles.fixed_0, BOTTOM_SHEET_OVERLAY_Z_CLASS, styles.flex_0_0)}>
      <div
        className={cn(styles.absolute_1, animateIn ? styles.opacity_100_1 : styles.opacity_0_1)}
        aria-hidden
      />
      {animateIn ? <ShiviIntroCoachmark /> : null}
      <div
        className={cn(styles.relative_2, "sheet-elevated", animateIn ? styles.translate_y_0_2 : styles.translate_y_full_2)}
        role="dialog"
        aria-modal="true"
        aria-labelledby="shivi-intro-sheet-title"
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
            id="shivi-intro-sheet-title"
            className={styles.mt_6_3}
          >
            Hi {USER_NAME},
          </h2>
          <p className={styles.mt_2_4}>
            Meet Shivi, your relationship manager. She will guide you through every step and is
            always available if you need help.
          </p>

          <button
            type="button"
            className={[styles.primary_cta_5, "primary-cta"].filter(Boolean).join(" ")}
            onClick={onGotIt}
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
