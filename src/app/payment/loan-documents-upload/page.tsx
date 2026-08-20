import { Suspense } from "react";

import { LoanApplicationLegacyRedirect } from "@/components/molecules/LoanApplicationLegacyRedirect";

/**
 * Legacy route — redirects into the loan application wizard (documents step).
 */
export default function LoanDocumentsUploadPage() {
  return (
    <Suspense fallback={null}>
      <LoanApplicationLegacyRedirect step="documents" />
    </Suspense>
  );
}
