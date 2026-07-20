"use client";

import Image, { type StaticImageData } from "next/image";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useId, useRef, useState } from "react";

import {
  BOTTOM_SHEET_BODY_BEFORE_CTA_CLASS,
  BOTTOM_SHEET_CTA_STRIP_TOP_CLASS,
  BOTTOM_SHEET_MAX_HEIGHT_CLASS,
  BOTTOM_SHEET_OVERLAY_Z_CLASS,
} from "@/components/ui/bottom-sheet-layout";
import {
  BottomSheetConfirmBulletList,
  type BottomSheetConfirmBulletPoint,
} from "@/components/ui/BottomSheetConfirmBulletList";
import { bottomSheetTitleWidthWithIllustration } from "@/components/ui/bottom-sheet-title-layout";
import { BottomSheetCloseIcon } from "@/components/ui/BottomSheetCloseIcon";
import { BottomSheetPortal } from "@/components/ui/BottomSheetPortal";
import styles from "./ModifySelectionConfirmBottomSheet.module.scss";


/** Enter/exit slide duration — keep in sync with `FullPaymentConfirmBottomSheet` */
const SHEET_TRANSITION_MS = 280;

type ModifySelectionConfirmBottomSheetProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  header: string;
  points: readonly BottomSheetConfirmBulletPoint[];
  iconSrc: StaticImageData | string;
  confirmCtaLabel: string;
};

/**
 * Modify booking — confirm before continuing to colour / variant / car flow.
 * Content-hug height + bullet list — aligned with {@link FullPaymentConfirmBottomSheet}.
 */
export function ModifySelectionConfirmBottomSheet({
  open,
  onClose,
  onConfirm,
  header,
  points,
  iconSrc,
  confirmCtaLabel,
}: ModifySelectionConfirmBottomSheetProps) {
  const titleId = useId();
  const listId = useId();
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

  const handleConfirm = useCallback(() => {
    onConfirm();
  }, [onConfirm]);

  if (!mounted) return null;

  return (
    <BottomSheetPortal>
      <div className={cn(styles.fixed_0, BOTTOM_SHEET_OVERLAY_Z_CLASS)}>
        <button
          type="button"
          className={cn(styles.absolute_1, animateIn ? styles.opacity_100_1 : styles.opacity_0_1)}
          onClick={onClose}
          aria-label="Dismiss"
        />
        <div
          className={cn(styles.absolute_2, "sheet-elevated", BOTTOM_SHEET_MAX_HEIGHT_CLASS, animateIn ? styles.translate_y_0_2 : styles.translate_y_full_2)}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={listId}
        >
          <div className={styles.relative_0}>
            <button
              type="button"
              onClick={onClose}
              className={[styles.cta_ghost_1, "cta-ghost"].filter(Boolean).join(" ")}
              aria-label="Close"
            >
              <BottomSheetCloseIcon />
            </button>

            <div
              className={cn(styles.overflow_y_auto_3, BOTTOM_SHEET_BODY_BEFORE_CTA_CLASS)}
            >
              <div className={styles.relative_2} aria-hidden>
                <Image
                  src={iconSrc}
                  alt=""
                  width={72}
                  height={72}
                  className={styles.h_72px__3}
                  unoptimized
                  sizes="72px"
                />
              </div>

              <h2
                id={titleId}
                className={cn(styles.mt_6_4, bottomSheetTitleWidthWithIllustration, styles.text_left_4)}
              >
                {header}
              </h2>

              <BottomSheetConfirmBulletList id={listId} points={points} />
            </div>

            <div
              className={cn(styles.shrink_0_5, BOTTOM_SHEET_CTA_STRIP_TOP_CLASS)}
            >
              <button type="button" onClick={handleConfirm} className={[styles.primary_cta_4, "primary-cta"].filter(Boolean).join(" ")}>
                {confirmCtaLabel}
              </button>
            </div>
          </div>
        </div>
      </div>
    </BottomSheetPortal>
  );
}
