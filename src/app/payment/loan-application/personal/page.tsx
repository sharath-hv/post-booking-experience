import { Suspense } from "react";

import { LoanApplicationPersonalScreen } from "@/components/organisms/payment/loan-application/LoanApplicationPersonalScreen";

export default function LoanApplicationPersonalPage() {
  return (
    <Suspense fallback={null}>
      <LoanApplicationPersonalScreen />
    </Suspense>
  );
}
