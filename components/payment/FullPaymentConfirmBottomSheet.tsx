"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useRef, useState } from "react";

import phoneIcon from "@/assets/Phone.svg";
import moneyIcon from "@/assets/money.svg";
import { PAYMENT_CHOOSE_ASSETS } from "@/components/payment/payment-choose-assets";
import type { BottomSheetConfirmBulletPoint } from "@/components/ui/BottomSheetConfirmBulletList";
import {
  BOTTOM_SHEET_BODY_BEFORE_CTA_CLASS,
  BOTTOM_SHEET_CTA_STRIP_TOP_CLASS,
  BOTTOM_SHEET_MAX_HEIGHT_CLASS,
  BOTTOM_SHEET_OVERLAY_Z_CLASS,
} from "@/components/ui/bottom-sheet-layout";
import { bottomSheetTitleWidthWithIllustration } from "@/components/ui/bottom-sheet-title-layout";
import { BottomSheetCloseIcon } from "@/components/ui/BottomSheetCloseIcon";
import { BottomSheetConfirmBulletList } from "@/components/ui/BottomSheetConfirmBulletList";
import { PARTNER_DEALER_LABEL_CAPITALIZED } from "@/lib/dealer-attribution-content";
import styles from "./FullPaymentConfirmBottomSheet.module.scss";


/** Enter/exit slide duration — keep in sync with `SelfFinanceConfirmBottomSheet` */
const SHEET_TRANSITION_MS = 280;

const BEFORE_YOU_PROCEED_POINTS: readonly BottomSheetConfirmBulletPoint[] = [
  {
    content: (
      <>
        {PARTNER_DEALER_LABEL_CAPITALIZED} will call you to share the payment details. Transfer the
        car amount directly to them.
      </>
    ),
    icon: phoneIcon,
  },
  {
    content: (
      <>
        Complete your full payment by <span className={styles.font_semibold_0}>30 May</span> to keep your
        booking active.
      </>
    ),
    icon: moneyIcon,
  },
];

type FullPaymentConfirmBottomSheetProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

/**
 * Full payment — confirm before navigating to checkout. Behaviour aligned with
 * {@link SelfFinanceConfirmBottomSheet}.
 */
export function FullPaymentConfirmBottomSheet({
  open,
  onClose,
  onConfirm,
}: FullPaymentConfirmBottomSheetProps) {
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
    <div className={cn(styles.fixed_0, BOTTOM_SHEET_OVERLAY_Z_CLASS)}>
      <button
        type="button"
        className={cn(styles.absolute_1, animateIn ? styles.opacity_100_1 : styles.opacity_0_1)}
        onClick={onClose}
        aria-label="Dismiss"
      />
      <div
        className={cn(styles.absolute_2, BOTTOM_SHEET_MAX_HEIGHT_CLASS, styles.w_full_2, "sheet-elevated", animateIn ? styles.translate_y_0_2 : styles.translate_y_full_2)}
        role="dialog"
        aria-modal="true"
        aria-labelledby="full-payment-things-to-know-title"
        aria-describedby="full-payment-before-proceed-list"
      >
        <div className={styles.relative_1}>
          <button
            type="button"
            onClick={onClose}
            className={[styles.cta_ghost_2, "cta-ghost"].filter(Boolean).join(" ")}
            aria-label="Close"
          >
            <BottomSheetCloseIcon />
          </button>

          <div className={cn(styles.min_h_0_3, BOTTOM_SHEET_BODY_BEFORE_CTA_CLASS)}>
            <div className={styles.relative_3} aria-hidden>
              <Image
                src={PAYMENT_CHOOSE_ASSETS.fullCash}
                alt=""
                width={72}
                height={72}
                className={styles.h_72px__4}
                unoptimized
                sizes="72px"
              />
            </div>

            <h2
              id="full-payment-things-to-know-title"
              className={cn(styles.mt_6_4, bottomSheetTitleWidthWithIllustration, styles.text_left_4)}
            >
              Things to know before you continue!
            </h2>

            <BottomSheetConfirmBulletList
              id="full-payment-before-proceed-list"
              points={BEFORE_YOU_PROCEED_POINTS}
            />
          </div>

          <div
            className={cn(styles.shrink_0_5, BOTTOM_SHEET_CTA_STRIP_TOP_CLASS)}
          >
            <button type="button" onClick={handleConfirm} className={[styles.primary_cta_5, "primary-cta"].filter(Boolean).join(" ")}>
              Agree and continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
