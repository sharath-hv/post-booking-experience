import { Suspense } from "react";

import { LoanApplicationDocumentsScreen } from "@/components/organisms/payment/loan-application/LoanApplicationDocumentsScreen";
import { LoanApplicationShell } from "@/components/organisms/payment/loan-application/LoanApplicationShell";

export default function LoanApplicationDocumentsPage() {
  return (
    <Suspense fallback={null}>
      <LoanApplicationShell currentRoute="documents">
        <LoanApplicationDocumentsScreen />
      </LoanApplicationShell>
    </Suspense>
  );
}
