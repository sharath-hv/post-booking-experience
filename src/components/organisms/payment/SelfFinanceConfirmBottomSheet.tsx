"use client";

import Image from "next/image";
import { useCallback, useEffect } from "react";

import { PrimaryCta } from "@/components/atoms/cta/PrimaryCta";
import { BottomSheetShell } from "@/components/organisms/BottomSheetShell";
import { useCtaNavigation } from "@/hooks/use-cta-navigation";
import { PAYMENT_CHOOSE_ASSETS } from "@/components/organisms/payment/payment-choose-assets";
import { SelfFinanceHowItWorksCard } from "@/components/organisms/payment/SelfFinanceHowItWorksCard";
import {
  BOTTOM_SHEET_BODY_BEFORE_CTA_CLASS,
  BOTTOM_SHEET_CTA_STRIP_TOP_CLASS,
} from "@/lib/layout/bottom-sheet-layout";
import { bottomSheetTitleWidthWithIllustration } from "@/lib/layout/bottom-sheet-title-layout";
import { cn } from "@/utils/utils";

import styles from "./SelfFinanceConfirmBottomSheet.module.scss";

type SelfFinanceConfirmBottomSheetProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

/**
 * Self finance — confirm before navigating to payment.
 */
export function SelfFinanceConfirmBottomSheet({
  open,
  onClose,
  onConfirm,
}: SelfFinanceConfirmBottomSheetProps) {
  const { loading, start, reset } = useCtaNavigation();

  useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  const handleConfirm = useCallback(() => {
    start(onConfirm);
  }, [onConfirm, start]);

  return (
    <BottomSheetShell
      open={open}
      onClose={loading ? () => {} : onClose}
      aria-labelledby="self-finance-things-to-know-title"
      aria-describedby="self-finance-how-it-works"
    >
      <div className={cn(styles.min_h_0_3, BOTTOM_SHEET_BODY_BEFORE_CTA_CLASS)}>
        <div className={styles.relative_2} aria-hidden>
          <Image
            src={PAYMENT_CHOOSE_ASSETS.selfFinance}
            alt=""
            width={72}
            height={72}
            className={styles.h_72px__3}
            unoptimized
            sizes="72px"
          />
        </div>

        <h2
          id="self-finance-things-to-know-title"
          className={cn(styles.mt_6_4, bottomSheetTitleWidthWithIllustration, styles.text_left_4)}
        >
          Here is how your own bank loan works
        </h2>

        <div id="self-finance-how-it-works" className={styles.mt_5_4}>
          <SelfFinanceHowItWorksCard showTitle={false} variant="embedded" />
        </div>
      </div>

      <div className={cn(styles.shrink_0_5, BOTTOM_SHEET_CTA_STRIP_TOP_CLASS)}>
        <PrimaryCta
          onClick={handleConfirm}
          loading={loading}
          className={styles.primary_cta_5}
        >
          Agree and continue
        </PrimaryCta>
      </div>
    </BottomSheetShell>
  );
}
