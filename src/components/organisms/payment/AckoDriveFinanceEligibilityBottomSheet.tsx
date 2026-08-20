"use client";

import Image from "next/image";
import { useCallback, useEffect } from "react";

import close01Icon from "@/assets/Close 01.svg";
import identityIcon from "@/assets/Identity.svg";
import { PrimaryCta } from "@/components/atoms/cta/PrimaryCta";
import { ModalFrame } from "@/components/molecules/modal/ModalFrame";
import { useCtaNavigation } from "@/hooks/use-cta-navigation";
import { PAYMENT_CHOOSE_ASSETS } from "@/components/organisms/payment/payment-choose-assets";
import { SelfFinanceHowItWorksCard } from "@/components/organisms/payment/SelfFinanceHowItWorksCard";
import type { SelfFinanceHowItWorksStep } from "@/components/organisms/payment/self-finance-confirmed-content";
import {
  BOTTOM_SHEET_BODY_BEFORE_CTA_CLASS,
  BOTTOM_SHEET_CTA_STRIP_TOP_CLASS,
} from "@/lib/layout/bottom-sheet-layout";
import { bottomSheetTitleWidthWithIllustration } from "@/lib/layout/bottom-sheet-title-layout";
import { cn } from "@/utils/utils";

import styles from "./AckoDriveFinanceEligibilityBottomSheet.module.scss";

/** Same eligibility lines — rendered with the embedded how-it-works icon treatment. */
const ELIGIBILITY_STEPS: readonly SelfFinanceHowItWorksStep[] = [
  {
    description:
      "We finance salaried and self-employed applicants who register the car in their own name.",
    icon: identityIcon,
  },
  {
    description: "We don't finance cars registered in a company's name.",
    icon: close01Icon,
  },
  {
    description: "We don’t finance cars leased from your company.",
    icon: close01Icon,
  },
];

type AckoDriveFinanceEligibilityBottomSheetProps = {
  open: boolean;
  onClose: () => void;
  /** User tapped “Agree and continue” — navigate to bank selection. */
  onConfirm: () => void;
};

/**
 * Eligibility gate before ACKO Drive bank options.
 */
export function AckoDriveFinanceEligibilityBottomSheet({
  open,
  onClose,
  onConfirm,
}: AckoDriveFinanceEligibilityBottomSheetProps) {
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
      aria-labelledby="acko-drive-finance-eligibility-title"
      aria-describedby="acko-drive-finance-eligibility-list"
    >
      <div className={cn(styles.min_h_0_3, BOTTOM_SHEET_BODY_BEFORE_CTA_CLASS)}>
        <div className={styles.relative_3} aria-hidden>
          <Image
            src={PAYMENT_CHOOSE_ASSETS.ackoDriveFinance}
            alt=""
            width={72}
            height={72}
            className={styles.h_72px__4}
            unoptimized
            sizes="72px"
          />
        </div>

        <h2
          id="acko-drive-finance-eligibility-title"
          className={cn(styles.mt_6_4, bottomSheetTitleWidthWithIllustration, styles.text_left_4)}
        >
          Things to know before you continue!
        </h2>

        <div id="acko-drive-finance-eligibility-list" className={styles.mt_5_4}>
          <SelfFinanceHowItWorksCard
            showTitle={false}
            variant="embedded"
            steps={ELIGIBILITY_STEPS}
          />
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
    </ModalFrame>
  );
}
