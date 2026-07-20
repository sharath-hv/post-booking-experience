import { Suspense } from "react";

import { LoanAdditionalDocumentsScreen } from "@/components/payment/LoanAdditionalDocumentsScreen";

/**
 * Bank mid-review — additional document requested (demo branch off loan processing).
 */
export default function LoanAdditionalDocumentsPage() {
  return (
    <Suspense fallback={null}>
      <LoanAdditionalDocumentsScreen />
    </Suspense>
  );
}
