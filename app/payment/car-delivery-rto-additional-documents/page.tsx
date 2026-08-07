import { Suspense } from "react";

import { CarDeliveryRtoAdditionalDocumentsScreen } from "@/components/payment/CarDeliveryRtoAdditionalDocumentsScreen";

/**
 * RTO mid-registration — additional document requested (demo branch).
 */
export default function CarDeliveryRtoAdditionalDocumentsPage() {
  return (
    <Suspense fallback={null}>
      <CarDeliveryRtoAdditionalDocumentsScreen />
    </Suspense>
  );
}
