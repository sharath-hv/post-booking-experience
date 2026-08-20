"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { bankForQueryParam } from "@/helpers/acko-drive-finance-bank";
import {
  loanApplicationDocumentsPath,
  loanApplicationEntryPath,
} from "@/helpers/loan-application-urls";

type LoanApplicationLegacyRedirectProps = {
  step: "entry" | "documents";
};

/**
 * Legacy loan-application URLs — map `?bank=` onto the wizard entry or documents step.
 */
export function LoanApplicationLegacyRedirect({
  step,
}: LoanApplicationLegacyRedirectProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const bank = bankForQueryParam(searchParams.get("bank"));
    router.replace(
      step === "documents"
        ? loanApplicationDocumentsPath(bank.id)
        : loanApplicationEntryPath(bank.id),
    );
  }, [router, searchParams, step]);

  return null;
}
