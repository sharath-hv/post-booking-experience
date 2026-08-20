"use client";

import { useCallback, useEffect, useId, useState } from "react";

import { PrimaryCta } from "@/components/atoms/cta/PrimaryCta";
import { Checkbox } from "@/components/atoms/selection/Checkbox";
import { ModalFrame } from "@/components/molecules/modal/ModalFrame";
import { useCtaNavigation } from "@/hooks/use-cta-navigation";
import {
  CANCEL_BOOKING_REASON_OPTIONS,
  CANCEL_BOOKING_REASON_SHEET_CTA,
  CANCEL_BOOKING_REASON_SHEET_TITLE,
  type CancelBookingReasonId,
} from "@/constants/cancel-booking-content";
import { cn } from "@/utils/utils";

import styles from "./CancelBookingReasonBottomSheet.module.scss";

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
      <Checkbox checked={selected} />
      <span className={styles.min_w_0_2}>{label}</span>
    </button>
  );
}

export type CancelBookingReasonBottomSheetProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: (reasonId: CancelBookingReasonId) => void;
  /** False when confirm stays on the same page (e.g. concierge cancel phase). */
  navigatesOnConfirm?: boolean;
};

/**
 * Cancel reason picker — Figma Post-booking-experience / node 2711:21013.
 */
export function CancelBookingReasonBottomSheet({
  open,
  onClose,
  onConfirm,
  navigatesOnConfirm = true,
}: CancelBookingReasonBottomSheetProps) {
  const titleId = useId();
  const [selectedReason, setSelectedReason] = useState<CancelBookingReasonId | null>(null);
  const { loading, start, reset } = useCtaNavigation();

  useEffect(() => {
    if (!open) {
      reset();
      return;
    }
    setSelectedReason(null);
  }, [open, reset]);

  const handleConfirm = useCallback(() => {
    if (selectedReason == null) return;
    if (navigatesOnConfirm) {
      start(() => onConfirm(selectedReason));
      return;
    }
    onConfirm(selectedReason);
  }, [navigatesOnConfirm, onConfirm, selectedReason, start]);

  return (
    <ModalFrame
      open={open}
      onClose={loading ? () => {} : onClose}
      constrainHeight={false}
      aria-labelledby={titleId}
    >
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
        <PrimaryCta
          onClick={handleConfirm}
          disabled={selectedReason == null}
          loading={navigatesOnConfirm && loading}
          className={styles.primary_cta_9}
        >
          {CANCEL_BOOKING_REASON_SHEET_CTA}
        </PrimaryCta>
      </div>
    </ModalFrame>
  );
}
