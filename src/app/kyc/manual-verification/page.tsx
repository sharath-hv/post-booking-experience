"use client";

import { Suspense } from "react";

import { KycManualVerificationPageClient } from "@/components/organisms/kyc/KycManualVerificationPageClient";
import { ModifyNoChargesGatedPage } from "@/components/organisms/kyc/ModifyNoChargesGatedPage";

/**
 * Manual KYC review waiting turn — kyc_failed demo branch from
 * `/kyc/documents-received` ("If manual review is needed · demo").
 */
export default function KycManualVerificationPage() {
  return (
    <ModifyNoChargesGatedPage>
      <Suspense fallback={null}>
        <KycManualVerificationPageClient />
      </Suspense>
    </ModifyNoChargesGatedPage>
  );
}
