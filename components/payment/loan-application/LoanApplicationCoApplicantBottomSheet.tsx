"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useRef, useState } from "react";

import coApplicantIcon from "@/assets/co-applicant.svg";
import { LoanApplicationSegmentChip } from "@/components/payment/loan-application/LoanApplicationSegmentChip";
import {
  BOTTOM_SHEET_BODY_BEFORE_CTA_CLASS,
  BOTTOM_SHEET_CTA_STRIP_TOP_CLASS,
  BOTTOM_SHEET_MAX_HEIGHT_CLASS,
  BOTTOM_SHEET_OVERLAY_Z_CLASS,
} from "@/lib/layout/bottom-sheet-layout";
import { bottomSheetTitleWidthWithIllustration } from "@/lib/layout/bottom-sheet-title-layout";
import { BottomSheetCloseIcon } from "@/components/atoms/BottomSheetCloseIcon";
import styles from "./LoanApplicationCoApplicantBottomSheet.module.scss";


/** Enter/exit slide duration — keep in sync with confirm sheets */
const SHEET_TRANSITION_MS = 280;

type CoApplicantChoice = "yes" | "no";

type LoanApplicationCoApplicantBottomSheetProps = {
  open: boolean;
  onClose: () => void;
  /** User confirmed a choice — start the loan application wizard. */
  onConfirm: (includeCoApplicant: boolean) => void;
};

/**
 * Co-applicant yes/no gate — opens from “Start my loan application” before the wizard.
 * Shell aligned with {@link AckoDriveFinanceEligibilityBottomSheet}.
 */
export function LoanApplicationCoApplicantBottomSheet({
  open,
  onClose,
  onConfirm,
}: LoanApplicationCoApplicantBottomSheetProps) {
  const [mounted, setMounted] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const [choice, setChoice] = useState<CoApplicantChoice | null>(null);
  const exitTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!open) return;
    if (exitTimeoutRef.current) {
      clearTimeout(exitTimeoutRef.current);
      exitTimeoutRef.current = null;
    }
    setMounted(true);
    setAnimateIn(false);
    setChoice(null);
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
    if (choice == null) return;
    onConfirm(choice === "yes");
  }, [choice, onConfirm]);

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
        aria-labelledby="loan-co-applicant-title"
        aria-describedby="loan-co-applicant-body"
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
                src={coApplicantIcon}
                alt=""
                width={72}
                height={72}
                className={styles.h_72px__4}
                unoptimized
                sizes="72px"
              />
            </div>

            <h2
              id="loan-co-applicant-title"
              className={cn(styles.mt_6_4, bottomSheetTitleWidthWithIllustration, styles.text_left_4)}
            >
              {"Are you applying with a co\u2011applicant?"}
            </h2>

            <p id="loan-co-applicant-body" className={cn(styles.mt_3_4, styles.body)}>
              You&apos;ll complete your details first, then repeat the same steps for your
              co-applicant.
            </p>

            <div className={cn(styles.mt_6_4, styles.grid)}>
              <LoanApplicationSegmentChip
                label="Yes, add co-applicant"
                selected={choice === "yes"}
                onClick={() => setChoice("yes")}
                size="employment"
              />
              <LoanApplicationSegmentChip
                label="No, just me"
                selected={choice === "no"}
                onClick={() => setChoice("no")}
                size="employment"
              />
            </div>
          </div>

          <div className={cn(styles.shrink_0_5, BOTTOM_SHEET_CTA_STRIP_TOP_CLASS)}>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={choice == null}
              className={[styles.primary_cta_5, "primary-cta"].filter(Boolean).join(" ")}
            >
              {choice === "yes" ? "Start with co-applicant" : "Start application"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
