"use client";

import Image from "next/image";
import { useCallback, useEffect, useId, useRef, useState } from "react";

import checkboxSelected from "@/assets/Checkbox selected.svg";
import checkboxUnselected from "@/assets/Checkbox unselected.svg";
import { BOTTOM_SHEET_OVERLAY_Z_CLASS } from "@/components/ui/bottom-sheet-layout";
import { BottomSheetCloseIcon } from "@/components/ui/BottomSheetCloseIcon";
import { BottomSheetPortal } from "@/components/ui/BottomSheetPortal";
import {
  CANCEL_BOOKING_REASON_OPTIONS,
  CANCEL_BOOKING_REASON_SHEET_CTA,
  CANCEL_BOOKING_REASON_SHEET_TITLE,
  type CancelBookingReasonId,
} from "@/lib/cancel-booking-content";
import { cn } from "@/lib/utils";
import styles from "./CancelBookingReasonBottomSheet.module.scss";


const SHEET_TRANSITION_MS = 280;

type CancelBookingReasonOptionRowProps = {
  label: string;
  selected: boolean;
  onSelect: () => void;
};

function CancelBookingReasonOptionRow({
  label,
  selected,
  onSelect,
}: CancelBookingReasonOptionRowProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        styles.flex_10,
        selected
          ? styles.border_121212__11
          : styles.border_e8e8e8__12,
      )}
    >
      <span className={styles.relative_0} aria-hidden>
        <Image
          src={selected ? checkboxSelected : checkboxUnselected}
          alt=""
          fill
          className={styles.object_contain_1}
          unoptimized
          sizes="16px"
        />
      </span>
      <span className={styles.min_w_0_2}>{label}</span>
    </button>
  );
}

export type CancelBookingReasonBottomSheetProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: (reasonId: CancelBookingReasonId) => void;
};

/**
 * Cancel reason picker — Figma Post-booking-experience / node 2711:21013.
 */
export function CancelBookingReasonBottomSheet({
  open,
  onClose,
  onConfirm,
}: CancelBookingReasonBottomSheetProps) {
  const titleId = useId();
  const [mounted, setMounted] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const [selectedReason, setSelectedReason] = useState<CancelBookingReasonId | null>(null);
  const exitTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!open) return;
    setSelectedReason(null);
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
    if (selectedReason == null) return;
    onConfirm(selectedReason);
  }, [onConfirm, selectedReason]);

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
          className={cn(styles.absolute_2, "sheet-elevated", animateIn ? styles.translate_y_0_2 : styles.translate_y_full_2)}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
        >
          <div className={styles.relative_3}>
            <button
              type="button"
              onClick={onClose}
              className={[styles.cta_ghost_4, "cta-ghost"].filter(Boolean).join(" ")}
              aria-label="Close"
            >
              <BottomSheetCloseIcon />
            </button>

            <div className={styles.px_5_5}>
              <h2
                id={titleId}
                className={styles.pr_10_6}
              >
                {CANCEL_BOOKING_REASON_SHEET_TITLE}
              </h2>

              <div
                className={styles.mt_4_7}
                role="group"
                aria-label="Cancellation reason"
              >
                {CANCEL_BOOKING_REASON_OPTIONS.map((option) => (
                  <CancelBookingReasonOptionRow
                    key={option.id}
                    label={option.label}
                    selected={selectedReason === option.id}
                    onSelect={() =>
                      setSelectedReason((current) =>
                        current === option.id ? null : option.id,
                      )
                    }
                  />
                ))}
              </div>
            </div>

            <div className={styles.shrink_0_8}>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={selectedReason == null}
                className={[styles.primary_cta_9, "primary-cta"].filter(Boolean).join(" ")}
              >
                {CANCEL_BOOKING_REASON_SHEET_CTA}
              </button>
            </div>
          </div>
        </div>
      </div>
    </BottomSheetPortal>
  );
}
