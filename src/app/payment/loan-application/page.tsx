import { Suspense } from "react";

import { LoanApplicationLegacyRedirect } from "@/components/molecules/LoanApplicationLegacyRedirect";

export default function LoanApplicationIndexPage() {
  return (
    <Suspense fallback={null}>
      <LoanApplicationLegacyRedirect step="entry" />
    </Suspense>
  );
}
