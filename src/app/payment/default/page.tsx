import { Suspense } from "react";

import { LegacyPathRedirect } from "@/components/molecules/LegacyPathRedirect";
import { JOURNEY_PATHS } from "@/helpers/journey-routes";

/**
 * Legacy money-intro URL. Car-assigned + payment amount now live on
 * booking-confirmed / allocation-confirmed; continue straight to options.
 */
export default function PaymentDefaultPage() {
  return (
    <Suspense fallback={null}>
      <LegacyPathRedirect to={JOURNEY_PATHS.payment.choose} />
    </Suspense>
  );
}
