import { Suspense } from "react";

import { LoanApplicationReferencesScreen } from "@/components/organisms/payment/loan-application/LoanApplicationReferencesScreen";
import { LoanApplicationShell } from "@/components/organisms/payment/loan-application/LoanApplicationShell";

export default function LoanApplicationReferencesPage() {
  return (
    <Suspense fallback={null}>
      <LoanApplicationShell currentRoute="references">
        <LoanApplicationReferencesScreen />
      </LoanApplicationShell>
    </Suspense>
  );
}
