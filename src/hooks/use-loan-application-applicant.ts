"use client";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

import type { LoanApplicationApplicant } from "@/constants/loan-application-content";
import {
  getApplicantProfile,
  type LoanApplicationApplicantProfile,
  type LoanApplicationState,
} from "@/helpers/loan-application-state";
import { parseLoanApplicationApplicant } from "@/helpers/loan-application-urls";

export function useLoanApplicationApplicant(state: LoanApplicationState) {
  const searchParams = useSearchParams();
  const applicant = useMemo(
    () => parseLoanApplicationApplicant(searchParams.get("applicant")),
    [searchParams],
  );

  const profile: LoanApplicationApplicantProfile = useMemo(
    () => getApplicantProfile(state, applicant),
    [applicant, state],
  );

  const showApplicantEyebrow = state.includeCoApplicant === true;

  return {
    applicant,
    profile,
    showApplicantEyebrow,
    isCoApplicantPass: applicant === "co",
  };
}

export type { LoanApplicationApplicant };
