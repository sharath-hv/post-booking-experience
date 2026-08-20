"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

import coApplicantIcon from "@/assets/co-applicant.svg";
import { PrimaryCta } from "@/components/atoms/cta/PrimaryCta";
import { ModalFrame } from "@/components/molecules/modal/ModalFrame";
import { useCtaNavigation } from "@/hooks/use-cta-navigation";
import { LoanApplicationSegmentChip } from "@/components/organisms/payment/loan-application/LoanApplicationSegmentChip";
import {
  BOTTOM_SHEET_BODY_BEFORE_CTA_CLASS,
  BOTTOM_SHEET_CTA_STRIP_TOP_CLASS,
} from "@/lib/layout/bottom-sheet-layout";
import { bottomSheetTitleWidthWithIllustration } from "@/lib/layout/bottom-sheet-title-layout";
import { cn } from "@/utils/utils";

import styles from "./LoanApplicationCoApplicantBottomSheet.module.scss";

type CoApplicantChoice = "yes" | "no";

type LoanApplicationCoApplicantBottomSheetProps = {
  open: boolean;
  onClose: () => void;
  /** User confirmed a choice — start the loan application wizard. */
  onConfirm: (includeCoApplicant: boolean) => void;
};

/**
 * Co-applicant yes/no gate — opens from “Start my loan application” before the wizard.
 */
export function LoanApplicationCoApplicantBottomSheet({
  open,
  onClose,
  onConfirm,
}: LoanApplicationCoApplicantBottomSheetProps) {
  const [choice, setChoice] = useState<CoApplicantChoice | null>(null);
  const { loading, start, reset } = useCtaNavigation();

  useEffect(() => {
    if (!open) return;
    setChoice(null);
    reset();
  }, [open, reset]);

  const handleConfirm = useCallback(() => {
    if (choice == null || loading) return;
    start(() => onConfirm(choice === "yes"));
  }, [choice, loading, onConfirm, start]);

  return (
    <ModalFrame
      open={open}
      onClose={loading ? () => {} : onClose}
      aria-labelledby="loan-co-applicant-title"
      aria-describedby="loan-co-applicant-body"
    >
      <div className={cn(styles.min_h_0_3, BOTTOM_SHEET_BODY_BEFORE_CTA_CLASS)}>
        <div className={styles.relative_3} aria-hidden>
          <Image
            src={coApplicantIcon}
            alt=""
            width={72}
            height={72}
            className={styles.h_72px__4}
            unoptimized
            sizes="72px"
          />
        </div>

        <h2
          id="loan-co-applicant-title"
          className={cn(styles.mt_6_4, bottomSheetTitleWidthWithIllustration, styles.text_left_4)}
        >
          {"Are you applying with a co\u2011applicant?"}
        </h2>

        <p id="loan-co-applicant-body" className={cn(styles.mt_3_4, styles.body)}>
          You&apos;ll complete your details first, then repeat the same steps for your
          co-applicant.
        </p>

        <div className={cn(styles.mt_6_4, styles.grid)}>
          <LoanApplicationSegmentChip
            label="No, just me"
            selected={choice === "no"}
            onClick={() => {
              if (loading) return;
              setChoice("no");
            }}
            size="employment"
          />
          <LoanApplicationSegmentChip
            label="Yes, add co-applicant"
            selected={choice === "yes"}
            onClick={() => {
              if (loading) return;
              setChoice("yes");
            }}
            size="employment"
          />
        </div>
      </div>

      <div className={cn(styles.shrink_0_5, BOTTOM_SHEET_CTA_STRIP_TOP_CLASS)}>
        <PrimaryCta
          onClick={handleConfirm}
          disabled={choice == null}
          loading={loading}
          loadingLabel="Starting application"
          className={styles.primary_cta_5}
        >
          {choice === "yes" ? "Start with co-applicant" : "Start application"}
        </PrimaryCta>
      </div>
    </ModalFrame>
  );
}
