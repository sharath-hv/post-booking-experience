import { Suspense } from "react";

import { LegacyPrefixRedirect } from "@/components/molecules/LegacyPrefixRedirect";
import { getModifySelectionCarModelStaticParams } from "@/constants/modify-selection-car-models-content";

export function generateStaticParams() {
  return getModifySelectionCarModelStaticParams();
}

export default function LegacyPrefixRedirectPage() {
  return (
    <Suspense fallback={null}>
      <LegacyPrefixRedirect fromPrefix="/kyc/modify-selection" toPrefix="/booking/modify" />
    </Suspense>
  );
}
