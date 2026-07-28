"use client";

import { cn } from "@/lib/utils";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";

import {
  INSURANCE_TENURE_COMPARE_SHEET_TITLE,
  insuranceTenureCompareRowsForSelection,
  type InsuranceAddonId,
  type InsuranceTenureCompareRow,
} from "@/components/payment/insurance-coverage-content";
import { BottomSheetCloseIcon } from "@/components/ui/BottomSheetCloseIcon";
import { BottomSheetPortal } from "@/components/ui/BottomSheetPortal";
import styles from "./InsuranceTenureCompareBottomSheet.module.scss";

import {
  BOTTOM_SHEET_BODY_BEFORE_CTA_CLASS,
  BOTTOM_SHEET_CTA_STRIP_TOP_CLASS,
  BOTTOM_SHEET_MAX_HEIGHT_CLASS,
  BOTTOM_SHEET_OVERLAY_Z_CLASS,
} from "@/components/ui/bottom-sheet-layout";

/** Enter/exit slide duration — keep in sync with `InsuranceCoverageBottomSheet` */
const SHEET_TRANSITION_MS = 280;

function CompareYearCell({ years }: { years: number }) {
  return (
    <div className={styles.flex_0}>
      <p className={styles.text_040222__1}>
        <span className={styles.text_base_2}>{years}</span>
        <span className={styles.text_xs_3}> year</span>
      </p>
    </div>
  );
}

function CompareTable({ rows }: { rows: readonly InsuranceTenureCompareRow[] }) {
  return (
    <div className={styles.overflow_hidden_10}>
      {/* Use relative positioning so the Extended column gradient can be an absolute overlay */}
      <div className={styles.relative_11}>
        {/* Extended column full-height purple gradient overlay */}
        <div
          aria-hidden
          className={styles.pointer_events_none_12}
        />

        {/* Header row */}
        <div className={styles.border_b_13}>
          <p className={styles.text_sm_8}>
            Coverage
            <br />
            type
          </p>
        </div>
        <div className={styles.border_b_14}>
          <p className={styles.text_center_15}>
            Standard
            <br />
            cover
          </p>
        </div>
        <div className={styles.relative_16}>
          <p className={styles.text_center_17}>
            Extended
            <br />
            Cover
          </p>
        </div>

        {/* Data rows — base Shield + selected add-ons */}
        {rows.map((row) => (
          <Fragment key={row.id}>
            <div className={styles.flex_18}>
              {row.lines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
            <div className={styles.border_l_19}>
              <CompareYearCell years={row.standardYears} />
            </div>
            <div className={styles.relative_20}>
              <CompareYearCell years={row.extendedYears} />
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  );
}

export type InsuranceTenureCompareBottomSheetProps = {
  open: boolean;
  onClose: () => void;
  /** Optional add-ons on this quote — appended as compare-table rows. */
  selectedAddonIds?: readonly InsuranceAddonId[];
};

/**
 * Standard vs extended tenure compare sheet —
 * [Figma 322:5666](https://www.figma.com/design/FEPATa8H2Eflz7FZm5LKuL/3-3-insurance-upsell?node-id=322-5666).
 */
export function InsuranceTenureCompareBottomSheet({
  open,
  onClose,
  selectedAddonIds = [],
}: InsuranceTenureCompareBottomSheetProps) {
  const [mounted, setMounted] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const exitTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const compareRows = insuranceTenureCompareRowsForSelection(selectedAddonIds);

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

  const onBackdropClick = useCallback(() => {
    onClose();
  }, [onClose]);

  if (!mounted) return null;

  return (
    <BottomSheetPortal>
      <div className={cn(styles.fixed_0, BOTTOM_SHEET_OVERLAY_Z_CLASS)}>
        <button
          type="button"
          className={cn(styles.absolute_1, animateIn ? styles.opacity_100_1 : styles.opacity_0_1)}
          onClick={onBackdropClick}
          aria-label="Dismiss"
        />
        <div
          className={cn(styles.absolute_2, BOTTOM_SHEET_MAX_HEIGHT_CLASS, styles.w_full_2, "sheet-elevated", animateIn ? styles.translate_y_0_2 : styles.translate_y_full_2)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="insurance-tenure-compare-sheet-title"
        >
          <div className={styles.relative_21}>
            <header className={styles.relative_22}>
              <div className={styles.flex_23}>
                <h2
                  id="insurance-tenure-compare-sheet-title"
                  className={styles.min_w_0_24}
                >
                  {INSURANCE_TENURE_COMPARE_SHEET_TITLE}
                </h2>
                <button
                  type="button"
                  onClick={onClose}
                  className={[styles.cta_ghost_25, "cta-ghost"].filter(Boolean).join(" ")}
                  aria-label="Close"
                >
                  <BottomSheetCloseIcon />
                </button>
              </div>
              <div
                aria-hidden
                className={styles.pointer_events_none_26}
              />
            </header>

            <div
              className={cn(styles.min_h_0_3, BOTTOM_SHEET_BODY_BEFORE_CTA_CLASS)}
            >
              <div className={styles.flex_27}>
                <CompareTable rows={compareRows} />
              </div>
            </div>

            <div
              className={cn(styles.relative_4, BOTTOM_SHEET_CTA_STRIP_TOP_CLASS)}
            >
              <div
                aria-hidden
                className={styles.pointer_events_none_31}
              />
              <button type="button" onClick={onClose} className={[styles.primary_cta_32, "primary-cta"].filter(Boolean).join(" ")}>
                Okay
              </button>
            </div>
          </div>
        </div>
      </div>
    </BottomSheetPortal>
  );
}
