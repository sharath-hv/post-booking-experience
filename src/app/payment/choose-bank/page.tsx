import { Suspense } from "react";

import { BankSelectionScreen } from "@/components/organisms/payment/BankSelectionScreen";

export default function ChooseBankPage() {
  return (
    <Suspense fallback={null}>
      <BankSelectionScreen />
    </Suspense>
  );
}
