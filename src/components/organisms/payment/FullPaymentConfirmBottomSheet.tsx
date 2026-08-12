"use client";

import Image from "next/image";
import { useCallback } from "react";

import { BottomSheetShell } from "@/components/organisms/BottomSheetShell";
import { PAYMENT_CHOOSE_ASSETS } from "@/components/organisms/payment/payment-choose-assets";
import { FULL_PAYMENT_HOW_IT_WORKS_STEPS } from "@/components/organisms/payment/full-payment-confirmed-content";
import { SelfFinanceHowItWorksCard } from "@/components/organisms/payment/SelfFinanceHowItWorksCard";
import {
  BOTTOM_SHEET_BODY_BEFORE_CTA_CLASS,
  BOTTOM_SHEET_CTA_STRIP_TOP_CLASS,
} from "@/lib/layout/bottom-sheet-layout";
import { bottomSheetTitleWidthWithIllustration } from "@/lib/layout/bottom-sheet-title-layout";
import { cn } from "@/utils/utils";

import styles from "./FullPaymentConfirmBottomSheet.module.scss";

type FullPaymentConfirmBottomSheetProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

/**
 * Full payment — confirm before navigating to checkout.
 */
export function FullPaymentConfirmBottomSheet({
  open,
  onClose,
  onConfirm,
}: FullPaymentConfirmBottomSheetProps) {
  const handleConfirm = useCallback(() => {
    onConfirm();
  }, [onConfirm]);

  return (
    <BottomSheetShell
      open={open}
      onClose={onClose}
      aria-labelledby="full-payment-things-to-know-title"
      aria-describedby="full-payment-how-it-works"
    >
      <div className={cn(styles.min_h_0_3, BOTTOM_SHEET_BODY_BEFORE_CTA_CLASS)}>
        <div className={styles.relative_3} aria-hidden>
          <Image
            src={PAYMENT_CHOOSE_ASSETS.fullCash}
            alt=""
            width={72}
            height={72}
            className={styles.h_72px__4}
            unoptimized
            sizes="72px"
          />
        </div>

        <h2
          id="full-payment-things-to-know-title"
          className={cn(styles.mt_6_4, bottomSheetTitleWidthWithIllustration, styles.text_left_4)}
        >
          Here is how paying in full works
        </h2>

        <div id="full-payment-how-it-works" className={styles.mt_5_4}>
          <SelfFinanceHowItWorksCard
            showTitle={false}
            variant="embedded"
            steps={FULL_PAYMENT_HOW_IT_WORKS_STEPS}
          />
        </div>
      </div>

      <div className={cn(styles.shrink_0_5, BOTTOM_SHEET_CTA_STRIP_TOP_CLASS)}>
        <button
          type="button"
          onClick={handleConfirm}
          className={cn(styles.primary_cta_5, "primary-cta")}
        >
          Agree and continue
        </button>
      </div>
    </BottomSheetShell>
  );
}
