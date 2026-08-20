import { Suspense } from "react";

import { LegacyPathRedirect } from "@/components/molecules/LegacyPathRedirect";
import { JOURNEY_PATHS } from "@/helpers/journey-routes";

/**
 * Legacy — the cancellation success is now a phase of the cancel turn itself.
 */
export default function LegacyCancelBookingSuccessPage() {
  return (
    <Suspense fallback={null}>
      <LegacyPathRedirect to={JOURNEY_PATHS.booking.cancel} />
    </Suspense>
  );
}
