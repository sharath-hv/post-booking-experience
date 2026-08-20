import { Suspense } from "react";

import { LegacyPathRedirect } from "@/components/molecules/LegacyPathRedirect";

function RedirectInner() {
  return <LegacyPathRedirect to="/identity" />;
}

/** Legacy upload URL — identity collect is inline on `/identity`. */
export default function LegacyKycUploadRedirectPage() {
  return (
    <Suspense fallback={null}>
      <RedirectInner />
    </Suspense>
  );
}
