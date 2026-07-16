import { Suspense } from "react";

import { BankSelectionScreen } from "@/components/payment/BankSelectionScreen";

export default function ChooseBankPage() {
  return (
    <Suspense fallback={null}>
      <BankSelectionScreen />
    </Suspense>
  );
}
