import { Suspense } from "react";

import { LoanApplicationLoanDetailsScreen } from "@/components/organisms/payment/loan-application/LoanApplicationLoanDetailsScreen";
import { LoanApplicationShell } from "@/components/organisms/payment/loan-application/LoanApplicationShell";

export default function LoanApplicationLoanDetailsPage() {
  return (
    <Suspense fallback={null}>
      <LoanApplicationShell currentRoute="loan-details">
        <LoanApplicationLoanDetailsScreen />
      </LoanApplicationShell>
    </Suspense>
  );
}
