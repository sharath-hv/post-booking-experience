"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { LoanApplicationApplicantEyebrow } from "@/components/payment/loan-application/LoanApplicationApplicantEyebrow";
import { LoanApplicationDocumentUploadSections } from "@/components/payment/loan-application/LoanApplicationDocumentUploadSections";
import { LoanApplicationFixedCta } from "@/components/payment/loan-application/LoanApplicationFixedCta";
import {
  LOAN_APPLICATION_MAIN_CLASS,
  LOAN_APPLICATION_STAGGER_MS,
} from "@/components/payment/loan-application/loan-application-layout";
import { LoanApplicationPageStagger } from "@/components/payment/loan-application/LoanApplicationPageStagger";
import { useLoanApplicationApplicant } from "@/components/payment/loan-application/use-loan-application-applicant";
import { useLoanApplicationBank } from "@/components/payment/loan-application/use-loan-application-bank";
import { useLoanApplicationState } from "@/components/payment/loan-application/use-loan-application-state";
import { areLoanApplicationDocumentsComplete } from "@/lib/loan-application-documents-state";
import { loanApplicationNextPath } from "@/lib/loan-application-urls";

export function LoanApplicationDocumentsScreen() {
  const router = useRouter();
  const { bankId } = useLoanApplicationBank();
  const { state, hydrated, updateApplicant } = useLoanApplicationState();
  const { applicant, profile, showApplicantEyebrow, isCoApplicantPass } =
    useLoanApplicationApplicant(state);
  const [uploads, setUploads] = useState(profile.documents);

  useEffect(() => {
    if (!hydrated) return;
    setUploads(profile.documents);
  }, [hydrated, profile.documents]);

  const canContinue = areLoanApplicationDocumentsComplete(uploads);

  const onContinue = useCallback(() => {
    if (!canContinue) return;
    updateApplicant(applicant, { documents: uploads });
    router.push(
      loanApplicationNextPath(bankId, "documents", {
        applicant,
        includeCoApplicant: state.includeCoApplicant,
      }),
    );
  }, [
    applicant,
    bankId,
    canContinue,
    router,
    state.includeCoApplicant,
    updateApplicant,
    uploads,
  ]);

  const title = isCoApplicantPass
    ? "Last bits of paper."
    : "Last bits of paper. What the bank needs from you.";

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

        <LoanApplicationDocumentUploadSections uploads={uploads} onUploadsChange={setUploads} />
      </main>

      <LoanApplicationFixedCta
        label="Continue"
        onClick={onContinue}
        disabled={!canContinue}
        staggerDelayMs={LOAN_APPLICATION_STAGGER_MS.cta}
      />
    </>
  );
}
