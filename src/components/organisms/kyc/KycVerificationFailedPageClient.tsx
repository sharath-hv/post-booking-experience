"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { ConciergeVerificationFailedScreen } from "@/components/organisms/concierge/ConciergeVerificationFailedScreen";
import { ConciergeVerificationCancelledScreen } from "@/components/organisms/concierge/ConciergeVerificationCancelledScreen";
import { hasExhaustedKycVerificationRetries } from "@/helpers/kyc-verification-attempts";
import {
  isVerificationFailedFlow,
  KYC_VERIFICATION_HAPPY_HREF,
} from "@/helpers/kyc-verification-outcome";

/**
 * Routes first failure → retry screen; second failure → cancelled + refund (demo).
 */
export function KycVerificationFailedPageClient() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [exhausted, setExhausted] = useState(false);

  useEffect(() => {
    if (!isVerificationFailedFlow()) {
      router.replace(KYC_VERIFICATION_HAPPY_HREF);
      return;
    }
    setExhausted(hasExhaustedKycVerificationRetries());
    setReady(true);
  }, [router]);

  if (!ready) return null;

  if (exhausted) {
    return <ConciergeVerificationCancelledScreen />;
  }

  return <ConciergeVerificationFailedScreen />;
}
