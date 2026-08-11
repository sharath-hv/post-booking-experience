"use client";

import Image from "next/image";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";

import termsIcon from "@/assets/terms and condition.svg";
import tickIcon from "@/assets/tick.svg";
import { BottomSheetCloseIcon } from "@/components/atoms/BottomSheetCloseIcon";
import { BottomSheetPortal } from "@/components/molecules/BottomSheetPortal";
import { SelfFinanceHowItWorksCard } from "@/components/payment/SelfFinanceHowItWorksCard";
import type { SelfFinanceHowItWorksStep } from "@/components/payment/self-finance-confirmed-content";
import {
  LOAN_APPLICATION_TERMS_CTA,
  LOAN_APPLICATION_TERMS_POINTS,
  LOAN_APPLICATION_TERMS_TITLE,
} from "@/lib/loan-application-content";
import {
  BOTTOM_SHEET_BODY_BEFORE_CTA_CLASS,
  BOTTOM_SHEET_CTA_STRIP_TOP_CLASS,
  BOTTOM_SHEET_MAX_HEIGHT_CLASS,
  BOTTOM_SHEET_OVERLAY_Z_CLASS,
} from "@/lib/layout/bottom-sheet-layout";
import { bottomSheetTitleWidthWithIllustration } from "@/lib/layout/bottom-sheet-title-layout";
import { cn } from "@/lib/utils";
import styles from "./LoanApplicationTermsBottomSheet.module.scss";

const SHEET_TRANSITION_MS = 280;

type LoanApplicationTermsBottomSheetProps = {
  open: boolean;
  onClose: () => void;
  /** User agreed to terms — continue to application submitted. */
  onConfirm: () => void;
};

/**
 * Terms gate before final loan application submit.
 * Shell aligned with {@link AckoDriveFinanceEligibilityBottomSheet}.
 */
export function LoanApplicationTermsBottomSheet({
  open,
  onClose,
  onConfirm,
}: LoanApplicationTermsBottomSheetProps) {
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

  const termSteps: readonly SelfFinanceHowItWorksStep[] = useMemo(
    () =>
      LOAN_APPLICATION_TERMS_POINTS.map((description) => ({
        description,
        icon: tickIcon,
      })),
    [],
  );

  if (!mounted) return null;

  return (
    <BottomSheetPortal>
      <div className={cn(styles.overlay, BOTTOM_SHEET_OVERLAY_Z_CLASS)}>
        <button
          type="button"
          className={cn(styles.backdrop, animateIn ? styles.backdrop_visible : styles.backdrop_hidden)}
          onClick={onClose}
          aria-label="Dismiss"
        />
        <div
          className={cn(
            styles.sheet,
            BOTTOM_SHEET_MAX_HEIGHT_CLASS,
            "sheet-elevated",
            animateIn ? styles.sheet_in : styles.sheet_out,
          )}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={listId}
        >
          <div className={styles.sheet_inner}>
            <button
              type="button"
              onClick={onClose}
              className={[styles.close, "cta-ghost"].filter(Boolean).join(" ")}
              aria-label="Close"
            >
              <BottomSheetCloseIcon />
            </button>

            <div className={cn(styles.body, BOTTOM_SHEET_BODY_BEFORE_CTA_CLASS)}>
              <div className={styles.icon_well} aria-hidden>
                <Image
                  src={termsIcon}
                  alt=""
                  width={72}
                  height={72}
                  className={styles.icon}
                  unoptimized
                  sizes="72px"
                />
              </div>

              <h2
                id={titleId}
                className={cn(styles.title, bottomSheetTitleWidthWithIllustration)}
              >
                {LOAN_APPLICATION_TERMS_TITLE}
              </h2>

              <div id={listId} className={styles.terms_list}>
                <SelfFinanceHowItWorksCard
                  showTitle={false}
                  variant="embedded"
                  steps={termSteps}
                />
              </div>
            </div>

            <div className={cn(styles.cta_strip, BOTTOM_SHEET_CTA_STRIP_TOP_CLASS)}>
              <button
                type="button"
                onClick={handleConfirm}
                className={[styles.primary_cta, "primary-cta"].filter(Boolean).join(" ")}
              >
                {LOAN_APPLICATION_TERMS_CTA}
              </button>
            </div>
          </div>
        </div>
      </div>
    </BottomSheetPortal>
  );
}
