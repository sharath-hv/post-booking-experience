"use client";

import { useCallback, useEffect, useState } from "react";

import {
  createDefaultLoanApplicationState,
  patchApplicantProfile,
  patchLoanApplicationState,
  readLoanApplicationState,
  writeLoanApplicationState,
  type LoanApplicationApplicantProfile,
  type LoanApplicationState,
} from "@/helpers/loan-application-state";
import type { LoanApplicationApplicant } from "@/constants/loan-application-content";

export function useLoanApplicationState() {
  const [state, setState] = useState<LoanApplicationState>(createDefaultLoanApplicationState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(readLoanApplicationState());
    setHydrated(true);
  }, []);

  const persist = useCallback((next: LoanApplicationState) => {
    setState(next);
    writeLoanApplicationState(next);
  }, []);

  const update = useCallback(
    (patch: Partial<LoanApplicationState>) => {
      const next = patchLoanApplicationState(patch);
      setState(next);
      return next;
    },
    [],
  );

  const updateApplicant = useCallback(
    (applicant: LoanApplicationApplicant, patch: Partial<LoanApplicationApplicantProfile>) => {
      const next = patchApplicantProfile(applicant, patch);
      setState(next);
      return next;
    },
    [],
  );

  return { state, hydrated, persist, update, updateApplicant };
}
