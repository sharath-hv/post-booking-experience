import { Suspense } from "react";

import { LoanApplicationAddressScreen } from "@/components/organisms/payment/loan-application/LoanApplicationAddressScreen";
import { LoanApplicationShell } from "@/components/organisms/payment/loan-application/LoanApplicationShell";

export default function LoanApplicationAddressPage() {
  return (
    <Suspense fallback={null}>
      <LoanApplicationShell currentRoute="address">
        <LoanApplicationAddressScreen />
      </LoanApplicationShell>
    </Suspense>
  );
}
