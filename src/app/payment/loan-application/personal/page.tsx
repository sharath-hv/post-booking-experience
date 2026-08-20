import { Suspense } from "react";

import { LoanApplicationPersonalScreen } from "@/components/organisms/payment/loan-application/LoanApplicationPersonalScreen";
import { LoanApplicationShell } from "@/components/organisms/payment/loan-application/LoanApplicationShell";

export default function LoanApplicationPersonalPage() {
  return (
    <Suspense fallback={null}>
      <LoanApplicationShell currentRoute="personal">
        <LoanApplicationPersonalScreen />
      </LoanApplicationShell>
    </Suspense>
  );
}
