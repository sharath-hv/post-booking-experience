"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

import {
  BOTTOM_SHEET_BODY_BEFORE_CTA_CLASS,
  BOTTOM_SHEET_CTA_STRIP_TOP_CLASS,
  BOTTOM_SHEET_MAX_HEIGHT_CLASS,
  BOTTOM_SHEET_OVERLAY_Z_CLASS,
} from "@/components/ui/bottom-sheet-layout";
import { bottomSheetTitleWidthWithIllustration } from "@/components/ui/bottom-sheet-title-layout";
import { BottomSheetCloseIcon } from "@/components/ui/BottomSheetCloseIcon";
import { BottomSheetConfirmBulletList } from "@/components/ui/BottomSheetConfirmBulletList";
import { BottomSheetPortal } from "@/components/ui/BottomSheetPortal";
import { FULL_PAYMENT_INSURANCE_INR } from "@/components/payment/loan-amount-demo-constants";
import { publicAssetPath } from "@/lib/public-asset-path";
import styles from "./LoanSubmitConfirmBottomSheet.module.scss";


/** Enter/exit slide duration — keep in sync with `BankLoanDetailBottomSheet` */
const SHEET_TRANSITION_MS = 280;

/** Illustration + list marker from `public/assets` (`doc search.svg` + `tick.svg`). */
const SHEET_ASSETS = {
  hero: publicAssetPath("doc search.svg"),
} as const;

function formatInr(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

const BEFORE_YOU_CONTINUE_POINTS: readonly ReactNode[] = [
  <>
    Down payment must be completed{" "}
    <span className={styles.font_semibold_0}>before 31 March 2026</span>
  </>,
  <>
    You may pay the down payment in a{" "}
    <span className={styles.font_semibold_0}>single payment or multiple instalments</span>
  </>,
  <>
    The insurance amount of{" "}
    <span className={styles.font_semibold_0}>{formatInr(FULL_PAYMENT_INSURANCE_INR)}</span> is due just
    before delivery, for RTO registration
  </>,
  <>
    The bank will disburse the loan amount to the dealer after down payment is completed
  </>,
];

type LoanSubmitConfirmBottomSheetProps = {
  open: boolean;
  onClose: () => void;
  /** User tapped “Agree and continue” — e.g. navigate to pay-down-payment. */
  onConfirm: () => void;
};

/**
 * “Things to know before you continue!” — informational sheet before continuing (loan / payment).
 * Behaviour aligned with {@link BankLoanDetailBottomSheet}.
 */
export function LoanSubmitConfirmBottomSheet({
  open,
  onClose,
  onConfirm,
}: LoanSubmitConfirmBottomSheetProps) {
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
        className={cn(styles.absolute_2, BOTTOM_SHEET_MAX_HEIGHT_CLASS, styles.w_full_2, "sheet-elevated", animateIn ? styles.translate_y_0_2 : styles.translate_y_full_2)}
        role="dialog"
        aria-modal="true"
        aria-labelledby="loan-before-proceed-title"
        aria-describedby="loan-before-proceed-list"
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
                src={SHEET_ASSETS.hero}
                alt=""
                width={72}
                height={72}
                className={styles.h_72px__4}
                unoptimized
                sizes="72px"
              />
            </div>

            <h2
              id="loan-before-proceed-title"
              className={cn(styles.mt_6_4, bottomSheetTitleWidthWithIllustration, styles.text_left_4)}
            >
              Things to know before you continue!
            </h2>

            <BottomSheetConfirmBulletList
              id="loan-before-proceed-list"
              points={BEFORE_YOU_CONTINUE_POINTS}
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
    </BottomSheetPortal>
  );
}
