"use client";

import Image from "next/image";
import { useCallback, useEffect, useId, useState } from "react";

import checkboxSelected from "@/assets/Checkbox selected.svg";
import checkboxUnselected from "@/assets/Checkbox unselected.svg";
import { BottomSheetShell } from "@/components/organisms/BottomSheetShell";
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
  const [selectedReason, setSelectedReason] = useState<CancelBookingReasonId | null>(null);

  useEffect(() => {
    if (!open) return;
    setSelectedReason(null);
  }, [open]);

  const handleConfirm = useCallback(() => {
    if (selectedReason == null) return;
    onConfirm(selectedReason);
  }, [onConfirm, selectedReason]);

  return (
    <BottomSheetShell
      open={open}
      onClose={onClose}
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
        <button
          type="button"
          onClick={handleConfirm}
          disabled={selectedReason == null}
          className={[styles.primary_cta_9, "primary-cta"].filter(Boolean).join(" ")}
        >
          {CANCEL_BOOKING_REASON_SHEET_CTA}
        </button>
      </div>
    </BottomSheetShell>
  );
}
