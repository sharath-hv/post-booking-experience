"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { ConciergeVerificationFailedScreen } from "@/components/concierge/ConciergeVerificationFailedScreen";
import { ConciergeVerificationCancelledScreen } from "@/components/concierge/ConciergeVerificationCancelledScreen";
import { hasExhaustedKycVerificationRetries } from "@/lib/kyc-verification-attempts";
import {
  isVerificationFailedFlow,
  KYC_VERIFICATION_HAPPY_HREF,
} from "@/lib/kyc-verification-outcome";

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
