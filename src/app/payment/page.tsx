import { Suspense } from "react";

import { PaymentCheckoutScreen } from "@/components/organisms/payment/PaymentCheckoutScreen";

/**
 * Mock Razorpay-style checkout for demos — booking lock, down payment, or insurance premium.
 */
export default function PaymentPage() {
  return (
    <Suspense fallback={null}>
      <PaymentCheckoutScreen />
    </Suspense>
  );
}
