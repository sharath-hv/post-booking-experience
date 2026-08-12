import { Suspense } from "react";

import { LegacyPrefixRedirect } from "@/components/molecules/LegacyPrefixRedirect";
import { MODIFY_SELECTION_CAR_BRAND_OPTIONS } from "@/constants/modify-selection-car-brands-content";

export function generateStaticParams() {
  return MODIFY_SELECTION_CAR_BRAND_OPTIONS.map((brand) => ({
    brand: brand.id,
  }));
}

export default function LegacyPrefixRedirectPage() {
  return (
    <Suspense fallback={null}>
      <LegacyPrefixRedirect fromPrefix="/kyc/modify-selection" toPrefix="/booking/modify" />
    </Suspense>
  );
}
