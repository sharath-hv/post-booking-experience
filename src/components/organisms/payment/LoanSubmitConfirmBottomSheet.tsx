"use client";

import Image from "next/image";
import { useCallback, useEffect, type ReactNode } from "react";

import { PrimaryCta } from "@/components/atoms/cta/PrimaryCta";
import { ModalFrame } from "@/components/molecules/modal/ModalFrame";
import { useCtaNavigation } from "@/hooks/use-cta-navigation";
import { BottomSheetConfirmBulletList } from "@/components/molecules/BottomSheetConfirmBulletList";
import {
  BOTTOM_SHEET_BODY_BEFORE_CTA_CLASS,
  BOTTOM_SHEET_CTA_STRIP_TOP_CLASS,
} from "@/lib/layout/bottom-sheet-layout";
import { bottomSheetTitleWidthWithIllustration } from "@/lib/layout/bottom-sheet-title-layout";
import { FULL_PAYMENT_INSURANCE_INR } from "@/constants/loan-amount-demo-constants";
import { publicAssetPath } from "@/utils/public-asset-path";
import { cn } from "@/utils/utils";

import styles from "./LoanSubmitConfirmBottomSheet.module.scss";

/** Illustration from `public/assets` (`doc search.svg`); list ticks use `@/assets/tick.svg`. */
const SHEET_ASSETS = {
  hero: publicAssetPath("doc search.svg"),
} as const;

function formatInr(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

const BEFORE_YOU_CONTINUE_POINTS: readonly ReactNode[] = [
  <>
    Down payment must be completed{" "}
    <span className={styles.font_semibold_0}>before 31 March 2026</span>
  </>,
  <>
    You may pay the down payment in a{" "}
    <span className={styles.font_semibold_0}>single payment or multiple instalments</span>
  </>,
  <>
    The insurance amount of{" "}
    <span className={styles.font_semibold_0}>{formatInr(FULL_PAYMENT_INSURANCE_INR)}</span> is due just
    before delivery, for RTO registration
  </>,
  <>
    The bank will disburse the loan amount to the dealer after down payment is completed
  </>,
];

type LoanSubmitConfirmBottomSheetProps = {
  open: boolean;
  onClose: () => void;
  /** User tapped “Agree and continue” — e.g. navigate to pay-down-payment. */
  onConfirm: () => void;
};

/**
 * “Things to know before you continue!” — informational sheet before continuing (loan / payment).
 * Behaviour aligned with {@link BankLoanDetailBottomSheet}.
 */
export function LoanSubmitConfirmBottomSheet({
  open,
  onClose,
  onConfirm,
}: LoanSubmitConfirmBottomSheetProps) {
  const { loading, start, reset } = useCtaNavigation();

  useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  const handleConfirm = useCallback(() => {
    start(onConfirm);
  }, [onConfirm, start]);

  return (
    <ModalFrame
      open={open}
      onClose={loading ? () => {} : onClose}
      aria-labelledby="loan-before-proceed-title"
      aria-describedby="loan-before-proceed-list"
    >
      <div className={cn(styles.min_h_0_3, BOTTOM_SHEET_BODY_BEFORE_CTA_CLASS)}>
        <div className={styles.relative_3} aria-hidden>
          <Image
            src={SHEET_ASSETS.hero}
            alt=""
            width={72}
            height={72}
            className={styles.h_72px__4}
            unoptimized
            sizes="72px"
          />
        </div>

        <h2
          id="loan-before-proceed-title"
          className={cn(styles.mt_6_4, bottomSheetTitleWidthWithIllustration, styles.text_left_4)}
        >
          Things to know before you continue!
        </h2>

        <BottomSheetConfirmBulletList
          id="loan-before-proceed-list"
          points={BEFORE_YOU_CONTINUE_POINTS}
        />
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
    </ModalFrame>
  );
}
