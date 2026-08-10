"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useRef, useState } from "react";

import close01Icon from "@/assets/Close 01.svg";
import identityIcon from "@/assets/Identity.svg";
import { PAYMENT_CHOOSE_ASSETS } from "@/components/payment/payment-choose-assets";
import { SelfFinanceHowItWorksCard } from "@/components/payment/SelfFinanceHowItWorksCard";
import type { SelfFinanceHowItWorksStep } from "@/components/payment/self-finance-confirmed-content";
import {
  BOTTOM_SHEET_BODY_BEFORE_CTA_CLASS,
  BOTTOM_SHEET_CTA_STRIP_TOP_CLASS,
  BOTTOM_SHEET_MAX_HEIGHT_CLASS,
  BOTTOM_SHEET_OVERLAY_Z_CLASS,
} from "@/lib/layout/bottom-sheet-layout";
import { bottomSheetTitleWidthWithIllustration } from "@/lib/layout/bottom-sheet-title-layout";
import { BottomSheetCloseIcon } from "@/components/atoms/BottomSheetCloseIcon";
import styles from "./AckoDriveFinanceEligibilityBottomSheet.module.scss";


/** Enter/exit slide duration — keep in sync with `SelfFinanceConfirmBottomSheet` */
const SHEET_TRANSITION_MS = 280;

/** Same eligibility lines — rendered with the embedded how-it-works icon treatment. */
const ELIGIBILITY_STEPS: readonly SelfFinanceHowItWorksStep[] = [
  {
    description:
      "We finance salaried and self-employed applicants who register the car in their own name.",
    icon: identityIcon,
  },
  {
    description: "We don't finance cars registered in a company's name.",
    icon: close01Icon,
  },
  {
    description: "We don’t finance cars leased from your company.",
    icon: close01Icon,
  },
];

type AckoDriveFinanceEligibilityBottomSheetProps = {
  open: boolean;
  onClose: () => void;
  /** User tapped “Agree and continue” — navigate to bank selection. */
  onConfirm: () => void;
};

/**
 * Eligibility gate before ACKO Drive bank options. Shell + row icons aligned with
 * {@link SelfFinanceConfirmBottomSheet} / {@link FullPaymentConfirmBottomSheet}.
 */
export function AckoDriveFinanceEligibilityBottomSheet({
  open,
  onClose,
  onConfirm,
}: AckoDriveFinanceEligibilityBottomSheetProps) {
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
        className={cn(
          styles.absolute_2,
          BOTTOM_SHEET_MAX_HEIGHT_CLASS,
          styles.w_full_2,
          "sheet-elevated",
          animateIn ? styles.translate_y_0_2 : styles.translate_y_full_2,
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="acko-drive-finance-eligibility-title"
        aria-describedby="acko-drive-finance-eligibility-list"
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
                src={PAYMENT_CHOOSE_ASSETS.ackoDriveFinance}
                alt=""
                width={72}
                height={72}
                className={styles.h_72px__4}
                unoptimized
                sizes="72px"
              />
            </div>

            <h2
              id="acko-drive-finance-eligibility-title"
              className={cn(styles.mt_6_4, bottomSheetTitleWidthWithIllustration, styles.text_left_4)}
            >
              Things to know before you continue!
            </h2>

            <div id="acko-drive-finance-eligibility-list" className={styles.mt_5_4}>
              <SelfFinanceHowItWorksCard
                showTitle={false}
                variant="embedded"
                steps={ELIGIBILITY_STEPS}
              />
            </div>
          </div>

          <div className={cn(styles.shrink_0_5, BOTTOM_SHEET_CTA_STRIP_TOP_CLASS)}>
            <button
              type="button"
              onClick={handleConfirm}
              className={[styles.primary_cta_5, "primary-cta"].filter(Boolean).join(" ")}
            >
              Agree and continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
