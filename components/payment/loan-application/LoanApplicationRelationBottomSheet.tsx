"use client";

import { useEffect, useId, useRef, useState } from "react";

import { BottomSheetCloseIcon } from "@/components/atoms/BottomSheetCloseIcon";
import { BottomSheetPortal } from "@/components/molecules/BottomSheetPortal";
import { LoanApplicationSegmentChip } from "@/components/payment/loan-application/LoanApplicationSegmentChip";
import {
  LOAN_APPLICATION_CO_APPLICANT_RELATION_OPTIONS,
  type LoanApplicationCoApplicantRelation,
} from "@/lib/loan-application-content";
import { BOTTOM_SHEET_OVERLAY_Z_CLASS } from "@/lib/layout/bottom-sheet-layout";
import { cn } from "@/lib/utils";
import styles from "./LoanApplicationRelationBottomSheet.module.scss";

const SHEET_TRANSITION_MS = 280;

type LoanApplicationRelationBottomSheetProps = {
  open: boolean;
  value: LoanApplicationCoApplicantRelation | null;
  onClose: () => void;
  onSelect: (relation: LoanApplicationCoApplicantRelation) => void;
};

/**
 * Co-applicant relation picker — opens from the personal details dropdown field.
 */
export function LoanApplicationRelationBottomSheet({
  open,
  value,
  onClose,
  onSelect,
}: LoanApplicationRelationBottomSheetProps) {
  const titleId = useId();
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
            "sheet-elevated",
            animateIn ? styles.sheet_in : styles.sheet_out,
          )}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
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

            <div className={styles.body}>
              <h2 id={titleId} className={styles.title}>
                Select relation
              </h2>

              <div
                className={styles.chip_grid}
                role="group"
                aria-labelledby={titleId}
              >
                {LOAN_APPLICATION_CO_APPLICANT_RELATION_OPTIONS.map((option) => (
                  <LoanApplicationSegmentChip
                    key={option.id}
                    label={option.label}
                    selected={value === option.id}
                    onClick={() => onSelect(option.id)}
                    size="employment"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </BottomSheetPortal>
  );
}
