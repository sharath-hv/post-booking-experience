import { Suspense } from "react";

import { LoanDocumentUploadScreen } from "@/components/payment/LoanDocumentUploadScreen";

/**
 * ACKO Drive finance — loan document upload (duplicated from KYC upload; preview only).
 */
export default function LoanDocumentsUploadPage() {
  return (
    <Suspense fallback={null}>
      <LoanDocumentUploadScreen />
    </Suspense>
  );
}
