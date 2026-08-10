"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, type ReactNode } from "react";

import { ShiviCallSheet } from "@/components/organisms/ShiviCallSheet";
import { GetHelpPillButton } from "@/components/molecules/GetHelpPillButton";
import { TopNavHeader } from "@/components/organisms/TopNavHeader";
import { LoanApplicationMilestoneRail } from "@/components/payment/loan-application/LoanApplicationMilestoneRail";
import {
  LOAN_APPLICATION_HEADER_CLASS,
  LOAN_APPLICATION_HERO_MILESTONE_CLASS,
} from "@/components/payment/loan-application/loan-application-layout";
import { useLoanApplicationBank } from "@/components/payment/loan-application/use-loan-application-bank";
import { useLoanApplicationState } from "@/components/payment/loan-application/use-loan-application-state";
import type { LoanApplicationRoute } from "@/lib/loan-application-content";
import {
  loanApplicationPrevPath,
  parseLoanApplicationApplicant,
} from "@/lib/loan-application-urls";
import styles from "./LoanApplicationShell.module.scss";


type LoanApplicationShellProps = {
  currentRoute: LoanApplicationRoute;
  children: ReactNode;
};

export function LoanApplicationShell({ currentRoute, children }: LoanApplicationShellProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { bankId } = useLoanApplicationBank();
  const { state } = useLoanApplicationState();
  const [callSheetOpen, setCallSheetOpen] = useState(false);
  const applicant = parseLoanApplicationApplicant(searchParams.get("applicant"));

  const handleBack = useCallback(() => {
    const prev = loanApplicationPrevPath(bankId, currentRoute, {
      applicant,
      includeCoApplicant: state.includeCoApplicant,
    });
    if (prev != null) router.push(prev);
    else router.back();
  }, [applicant, bankId, currentRoute, router, state.includeCoApplicant]);

  return (
    <div className={styles.relative_0}>
      <div className={styles.relative_1}>
        <div className={LOAN_APPLICATION_HEADER_CLASS}>
          <TopNavHeader
            inverted
            noSticky
            onBack={handleBack}
            endSlot={
              <GetHelpPillButton
                variant="onDark"
                onClick={() => setCallSheetOpen(true)}
              />
            }
          />
          <div className={LOAN_APPLICATION_HERO_MILESTONE_CLASS}>
            <LoanApplicationMilestoneRail currentRoute={currentRoute} theme="dark" />
          </div>
        </div>
        {children}
      </div>
      <ShiviCallSheet open={callSheetOpen} onClose={() => setCallSheetOpen(false)} />
    </div>
  );
}
