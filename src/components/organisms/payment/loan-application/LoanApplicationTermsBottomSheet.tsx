"use client";

import Image from "next/image";
import { useCallback, useId, useMemo } from "react";

import termsIcon from "@/assets/terms and condition.svg";
import tickIcon from "@/assets/tick.svg";
import { BottomSheetShell } from "@/components/organisms/BottomSheetShell";
import { SelfFinanceHowItWorksCard } from "@/components/organisms/payment/SelfFinanceHowItWorksCard";
import type { SelfFinanceHowItWorksStep } from "@/components/organisms/payment/self-finance-confirmed-content";
import {
  LOAN_APPLICATION_TERMS_CTA,
  LOAN_APPLICATION_TERMS_POINTS,
  LOAN_APPLICATION_TERMS_TITLE,
} from "@/constants/loan-application-content";
import {
  BOTTOM_SHEET_BODY_BEFORE_CTA_CLASS,
  BOTTOM_SHEET_CTA_STRIP_TOP_CLASS,
} from "@/lib/layout/bottom-sheet-layout";
import { bottomSheetTitleWidthWithIllustration } from "@/lib/layout/bottom-sheet-title-layout";
import { cn } from "@/utils/utils";

import styles from "./LoanApplicationTermsBottomSheet.module.scss";

type LoanApplicationTermsBottomSheetProps = {
  open: boolean;
  onClose: () => void;
  /** User agreed to terms — continue to application submitted. */
  onConfirm: () => void;
};

/**
 * Terms gate before final loan application submit.
 * Shell aligned with {@link AckoDriveFinanceEligibilityBottomSheet}.
 */
export function LoanApplicationTermsBottomSheet({
  open,
  onClose,
  onConfirm,
}: LoanApplicationTermsBottomSheetProps) {
  const titleId = useId();
  const listId = useId();

  const handleConfirm = useCallback(() => {
    onConfirm();
  }, [onConfirm]);

  const termSteps: readonly SelfFinanceHowItWorksStep[] = useMemo(
    () =>
      LOAN_APPLICATION_TERMS_POINTS.map((description) => ({
        description,
        icon: tickIcon,
      })),
    [],
  );

  return (
    <BottomSheetShell
      open={open}
      onClose={onClose}
      aria-labelledby={titleId}
      aria-describedby={listId}
    >
      <div className={cn(styles.body, BOTTOM_SHEET_BODY_BEFORE_CTA_CLASS)}>
        <div className={styles.icon_well} aria-hidden>
          <Image
            src={termsIcon}
            alt=""
            width={72}
            height={72}
            className={styles.icon}
            unoptimized
            sizes="72px"
          />
        </div>

        <h2
          id={titleId}
          className={cn(styles.title, bottomSheetTitleWidthWithIllustration)}
        >
          {LOAN_APPLICATION_TERMS_TITLE}
        </h2>

        <div id={listId} className={styles.terms_list}>
          <SelfFinanceHowItWorksCard
            showTitle={false}
            variant="embedded"
            steps={termSteps}
          />
        </div>
      </div>

      <div className={cn(styles.cta_strip, BOTTOM_SHEET_CTA_STRIP_TOP_CLASS)}>
        <button
          type="button"
          onClick={handleConfirm}
          className={[styles.primary_cta, "primary-cta"].filter(Boolean).join(" ")}
        >
          {LOAN_APPLICATION_TERMS_CTA}
        </button>
      </div>
    </BottomSheetShell>
  );
}
