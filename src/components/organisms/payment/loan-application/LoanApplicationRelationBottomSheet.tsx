"use client";

import { useId } from "react";

import { BottomSheetShell } from "@/components/organisms/BottomSheetShell";
import { LoanApplicationSegmentChip } from "@/components/organisms/payment/loan-application/LoanApplicationSegmentChip";
import {
  LOAN_APPLICATION_CO_APPLICANT_RELATION_OPTIONS,
  type LoanApplicationCoApplicantRelation,
} from "@/constants/loan-application-content";

import styles from "./LoanApplicationRelationBottomSheet.module.scss";

type LoanApplicationRelationBottomSheetProps = {
  open: boolean;
  value: LoanApplicationCoApplicantRelation | null;
  onClose: () => void;
  onSelect: (relation: LoanApplicationCoApplicantRelation) => void;
};

/**
 * Co-applicant relation picker — opens from the personal details dropdown field.
 */
export function LoanApplicationRelationBottomSheet({
  open,
  value,
  onClose,
  onSelect,
}: LoanApplicationRelationBottomSheetProps) {
  const titleId = useId();

  return (
    <BottomSheetShell
      open={open}
      onClose={onClose}
      constrainHeight={false}
      aria-labelledby={titleId}
    >
      <div className={styles.body}>
        <h2 id={titleId} className={styles.title}>
          Select relation
        </h2>

        <div
          className={styles.chip_grid}
          role="group"
          aria-labelledby={titleId}
        >
          {LOAN_APPLICATION_CO_APPLICANT_RELATION_OPTIONS.map((option) => (
            <LoanApplicationSegmentChip
              key={option.id}
              label={option.label}
              selected={value === option.id}
              onClick={() => onSelect(option.id)}
              size="employment"
            />
          ))}
        </div>
      </div>
    </BottomSheetShell>
  );
}
