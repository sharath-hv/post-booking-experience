import { Suspense } from "react";

import { LegacyBuyingGuideStepRedirect } from "@/components/molecules/LegacyBuyingGuideStepRedirect";

export function generateStaticParams() {
  return [{ step: "1" }, { step: "2" }, { step: "3" }];
}

export default function LegacyBuyingGuideRedirectPage() {
  return (
    <Suspense fallback={null}>
      <LegacyBuyingGuideStepRedirect />
    </Suspense>
  );
}
