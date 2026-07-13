"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { ConciergeMoment } from "@/components/concierge/ConciergeMoment";
import {
  isVerificationFailedFlow,
  KYC_VERIFICATION_HAPPY_HREF,
} from "@/lib/kyc-verification-outcome";

/**
 * Manual KYC review waiting turn — only reachable in the kyc_failed demo flow.
 */
export function KycManualVerificationPageClient() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isVerificationFailedFlow()) {
      router.replace(KYC_VERIFICATION_HAPPY_HREF);
      return;
    }
    setReady(true);
  }, [router]);

  if (!ready) return null;

  return <ConciergeMoment moment="manualVerification" />;
}
