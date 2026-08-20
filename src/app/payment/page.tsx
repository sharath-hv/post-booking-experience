import { Suspense } from "react";

import { PaymentCheckoutScreen } from "@/components/organisms/payment/PaymentCheckoutScreen";
import { TopNavHeader } from "@/components/organisms/TopNavHeader";

/**
 * Mock Razorpay-style checkout for demos — booking lock, down payment, or insurance premium.
 * Header is composed here; the checkout body/footer live in the payment organism.
 */
export default function PaymentPage() {
  return (
    <Suspense fallback={null}>
      <PaymentCheckoutScreen
        header={<TopNavHeader title="Checkout" solid />}
      />
    </Suspense>
  );
}
