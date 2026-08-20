import { Suspense } from "react";

import { LegacyPathRedirect } from "@/components/molecules/LegacyPathRedirect";

export default function Home() {
  return (
    <Suspense fallback={null}>
      <LegacyPathRedirect to="/quote" />
    </Suspense>
  );
}
