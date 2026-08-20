import { Suspense } from "react";

import { LegacyPathRedirect } from "@/components/molecules/LegacyPathRedirect";

function RedirectInner() {
  return <LegacyPathRedirect to="/delivery/rto/additional-documents" />;
}

export default function LegacyRedirectPage() {
  return (
    <Suspense fallback={null}>
      <RedirectInner />
    </Suspense>
  );
}
