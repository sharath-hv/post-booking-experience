"use client";

import { useRouter } from "next/navigation";
import { cn } from "@/utils/utils";
import { useCallback, useEffect, useState } from "react";

import { LoanApplicationApplicantEyebrow } from "@/components/organisms/payment/loan-application/LoanApplicationApplicantEyebrow";
import { LoanApplicationFixedCta } from "@/components/organisms/payment/loan-application/LoanApplicationFixedCta";
import { LoanApplicationFormField } from "@/components/organisms/payment/loan-application/LoanApplicationFormField";
import {
  LOAN_APPLICATION_FIELD_STACK_GAP_CLASS,
  LOAN_APPLICATION_MAIN_CLASS,
  LOAN_APPLICATION_SECTION_DIVIDER_CLASS,
  LOAN_APPLICATION_SECTION_GAP_CLASS,
  LOAN_APPLICATION_SECTION_LABEL_CLASS,
  LOAN_APPLICATION_STAGGER_MS,
  LOAN_APPLICATION_TITLE_TO_CARD_GAP_CLASS,
  loanApplicationStaggerAfterCard,
} from "@/components/organisms/payment/loan-application/loan-application-layout";
import { LoanApplicationPageStagger } from "@/components/organisms/payment/loan-application/LoanApplicationPageStagger";
import { LoanApplicationTermsBottomSheet } from "@/components/organisms/payment/loan-application/LoanApplicationTermsBottomSheet";
import { useLoanApplicationApplicant } from "@/hooks/use-loan-application-applicant";
import { useLoanApplicationBank } from "@/hooks/use-loan-application-bank";
import { useLoanApplicationState } from "@/hooks/use-loan-application-state";
import { emptyReference, type LoanApplicationReference } from "@/helpers/loan-application-state";
import { loanApplicationNextPath } from "@/helpers/loan-application-urls";

function isReferenceComplete(ref: LoanApplicationReference) {
  return (
    ref.fullName.trim().length > 0 &&
    ref.phone.trim().length >= 10 &&
    ref.address.trim().length > 0
  );
}

type ReferenceFieldsProps = {
  prefix: string;
  value: LoanApplicationReference;
  onChange: (next: LoanApplicationReference) => void;
  /** Applied to the first field below a section label. */
  firstFieldClassName?: string;
};

function ReferenceFields({
  prefix,
  value,
  onChange,
  firstFieldClassName = "",
}: ReferenceFieldsProps) {
  const set =
    (key: keyof LoanApplicationReference) => (field: string) =>
      onChange({ ...value, [key]: field });

  const field = {
    variant: "placeholder" as const,
  };

  return (
    <>
      <LoanApplicationFormField
        {...field}
        id={`${prefix}-name`}
        label="Name"
        value={value.fullName}
        onChange={set("fullName")}
        autoComplete="name"
        className={firstFieldClassName}
      />

      <LoanApplicationFormField
        {...field}
        id={`${prefix}-phone`}
        label="Phone number"
        type="tel"
        value={value.phone}
        onChange={set("phone")}
        autoComplete="tel"
        className={LOAN_APPLICATION_FIELD_STACK_GAP_CLASS}
      />

      <LoanApplicationFormField
        {...field}
        id={`${prefix}-address`}
        label="Address"
        value={value.address}
        onChange={set("address")}
        autoComplete="street-address"
        multiline
        className={LOAN_APPLICATION_FIELD_STACK_GAP_CLASS}
      />
    </>
  );
}

export function LoanApplicationReferencesScreen() {
  const router = useRouter();
  const { bankId } = useLoanApplicationBank();
  const { state, hydrated, updateApplicant } = useLoanApplicationState();
  const { applicant, profile, showApplicantEyebrow, isCoApplicantPass } =
    useLoanApplicationApplicant(state);
  const [ref1, setRef1] = useState(profile.references[0]);
  const [ref2, setRef2] = useState(profile.references[1]);
  const [termsSheetOpen, setTermsSheetOpen] = useState(false);

  useEffect(() => {
    if (!hydrated) return;
    setRef1(profile.references[0]);
    setRef2(profile.references[1]);
  }, [hydrated, profile.references]);

  const canSubmit = isReferenceComplete(ref1) && isReferenceComplete(ref2);
  const isFinalPass =
    applicant === "co" || state.includeCoApplicant !== true;

  const persistReferences = useCallback(() => {
    const normalized: [LoanApplicationReference, LoanApplicationReference] = [
      {
        fullName: ref1.fullName.trim(),
        phone: ref1.phone.trim(),
        address: ref1.address.trim(),
      },
      {
        fullName: ref2.fullName.trim(),
        phone: ref2.phone.trim(),
        address: ref2.address.trim(),
      },
    ];
    updateApplicant(applicant, { references: normalized });
  }, [applicant, ref1, ref2, updateApplicant]);

  const navigateAfterReferences = useCallback(() => {
    router.push(
      loanApplicationNextPath(bankId, "references", {
        applicant,
        includeCoApplicant: state.includeCoApplicant,
      }),
    );
  }, [applicant, bankId, router, state.includeCoApplicant]);

  const onCtaClick = useCallback(() => {
    if (!canSubmit) return;
    persistReferences();
    if (!isFinalPass) {
      navigateAfterReferences();
      return;
    }
    setTermsSheetOpen(true);
  }, [canSubmit, isFinalPass, navigateAfterReferences, persistReferences]);

  const onAgreeAndSubmit = useCallback(() => {
    navigateAfterReferences();
  }, [navigateAfterReferences]);

  const title = isCoApplicantPass
    ? "Two people who can vouch for your co-applicant."
    : "Two people who can vouch for you. The bank's standard ask.";

  return (
    <>
      <main className={LOAN_APPLICATION_MAIN_CLASS}>
        <LoanApplicationPageStagger delayMs={LOAN_APPLICATION_STAGGER_MS.title}>
          <LoanApplicationApplicantEyebrow
            applicant={applicant}
            show={showApplicantEyebrow}
            title={title}
          />
        </LoanApplicationPageStagger>

        <LoanApplicationPageStagger
          delayMs={LOAN_APPLICATION_STAGGER_MS.subtitle}
          className={LOAN_APPLICATION_SECTION_GAP_CLASS}
        >
          <p className={LOAN_APPLICATION_SECTION_LABEL_CLASS}>First reference</p>
          <ReferenceFields
            prefix="ref1"
            value={ref1 ?? emptyReference()}
            onChange={setRef1}
            firstFieldClassName={LOAN_APPLICATION_TITLE_TO_CARD_GAP_CLASS}
          />
        </LoanApplicationPageStagger>

        <LoanApplicationPageStagger delayMs={loanApplicationStaggerAfterCard(1)}>
          <div className={LOAN_APPLICATION_SECTION_DIVIDER_CLASS} role="separator" />

          <p className={cn(LOAN_APPLICATION_SECTION_GAP_CLASS, LOAN_APPLICATION_SECTION_LABEL_CLASS)}>
            Second reference
          </p>
          <ReferenceFields
            prefix="ref2"
            value={ref2 ?? emptyReference()}
            onChange={setRef2}
            firstFieldClassName={LOAN_APPLICATION_TITLE_TO_CARD_GAP_CLASS}
          />
        </LoanApplicationPageStagger>
      </main>

      <LoanApplicationFixedCta
        label={isFinalPass ? "Submit loan application" : "Continue to co-applicant"}
        onClick={onCtaClick}
        disabled={!canSubmit}
        showsLoader={!isFinalPass}
        staggerDelayMs={loanApplicationStaggerAfterCard(2)}
      />

      <LoanApplicationTermsBottomSheet
        open={termsSheetOpen}
        onClose={() => setTermsSheetOpen(false)}
        onConfirm={onAgreeAndSubmit}
      />
    </>
  );
}
