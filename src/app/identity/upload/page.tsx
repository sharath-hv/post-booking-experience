import { Suspense } from "react";

import { LegacyPathRedirect } from "@/components/molecules/LegacyPathRedirect";
import { JOURNEY_PATHS } from "@/helpers/journey-routes";

/**
 * Legacy — document upload now happens inline on the `/identity` turn
 * (verification-failed re-upload links land here too).
 */
export default function LegacyIdentityUploadPage() {
  return (
    <Suspense fallback={null}>
      <LegacyPathRedirect to={JOURNEY_PATHS.identity.hub} />
    </Suspense>
  );
}
