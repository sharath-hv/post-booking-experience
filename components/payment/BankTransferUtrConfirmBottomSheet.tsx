"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useRef, useState } from "react";

import { PAYMENT_CHOOSE_ASSETS } from "@/components/payment/payment-choose-assets";
import {
  BOTTOM_SHEET_CTA_STRIP_TOP_CLASS,
  BOTTOM_SHEET_MAX_HEIGHT_CLASS,
  BOTTOM_SHEET_OVERLAY_Z_CLASS,
} from "@/components/ui/bottom-sheet-layout";
import { bottomSheetTitleWidthWithIllustration } from "@/components/ui/bottom-sheet-title-layout";
import { BottomSheetCloseIcon } from "@/components/ui/BottomSheetCloseIcon";
import styles from "./BankTransferUtrConfirmBottomSheet.module.scss";


const SHEET_TRANSITION_MS = 280;

type BankTransferUtrConfirmBottomSheetProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

/**
 * Self finance — user confirms the bank has transferred the loan amount to the dealer.
 */
export function BankTransferUtrConfirmBottomSheet({
  open,
  onClose,
  onConfirm,
}: BankTransferUtrConfirmBottomSheetProps) {
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
        aria-labelledby="bank-transfer-confirm-title"
        aria-describedby="bank-transfer-confirm-body"
      >
        <div className={styles.relative_0}>
          <button
            type="button"
            onClick={onClose}
            className={[styles.cta_ghost_1, "cta-ghost"].filter(Boolean).join(" ")}
            aria-label="Close"
          >
            <BottomSheetCloseIcon />
          </button>

          <div className={styles.min_h_0_2}>
            <div className={styles.relative_3} aria-hidden>
              <Image
                src={PAYMENT_CHOOSE_ASSETS.loanApproved}
                alt=""
                width={72}
                height={72}
                className={styles.h_72px__4}
                unoptimized
                sizes="72px"
              />
            </div>
            <h2
              id="bank-transfer-confirm-title"
              className={cn(styles.mt_6_3, bottomSheetTitleWidthWithIllustration, styles.text_left_3)}
            >
              Has your bank transferred the amount?
            </h2>
            <p
              id="bank-transfer-confirm-body"
              className={styles.mt_3_5}
            >
              I will check with the dealer and confirm the transfer on your behalf.
            </p>
          </div>

          <div
            className={cn(styles.shrink_0_4, BOTTOM_SHEET_CTA_STRIP_TOP_CLASS)}
          >
            <button
              type="button"
              onClick={handleConfirm}
              className={[styles.primary_cta_6, "primary-cta"].filter(Boolean).join(" ")}
            >
              Yes, bank has transferred
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
