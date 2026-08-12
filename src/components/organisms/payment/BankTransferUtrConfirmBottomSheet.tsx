"use client";

import Image from "next/image";
import { useCallback } from "react";

import { BottomSheetShell } from "@/components/organisms/BottomSheetShell";
import { PAYMENT_CHOOSE_ASSETS } from "@/components/organisms/payment/payment-choose-assets";
import { BOTTOM_SHEET_CTA_STRIP_TOP_CLASS } from "@/lib/layout/bottom-sheet-layout";
import { bottomSheetTitleWidthWithIllustration } from "@/lib/layout/bottom-sheet-title-layout";
import { NAMED_DEALER_LABEL } from "@/constants/dealer-attribution-content";
import { cn } from "@/utils/utils";

import styles from "./BankTransferUtrConfirmBottomSheet.module.scss";

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
  const handleConfirm = useCallback(() => {
    onConfirm();
  }, [onConfirm]);

  return (
    <BottomSheetShell
      open={open}
      onClose={onClose}
      aria-labelledby="bank-transfer-confirm-title"
      aria-describedby="bank-transfer-confirm-body"
    >
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
        <p id="bank-transfer-confirm-body" className={styles.mt_3_5}>
          I will check with {NAMED_DEALER_LABEL} and confirm the transfer on your behalf.
        </p>
      </div>

      <div className={cn(styles.shrink_0_4, BOTTOM_SHEET_CTA_STRIP_TOP_CLASS)}>
        <button
          type="button"
          onClick={handleConfirm}
          className={[styles.primary_cta_6, "primary-cta"].filter(Boolean).join(" ")}
        >
          Yes, bank has transferred
        </button>
      </div>
    </BottomSheetShell>
  );
}
