import { Suspense } from "react";

import { LoanApplicationReferencesScreen } from "@/components/organisms/payment/loan-application/LoanApplicationReferencesScreen";

export default function LoanApplicationReferencesPage() {
  return (
    <Suspense fallback={null}>
      <LoanApplicationReferencesScreen />
    </Suspense>
  );
}
