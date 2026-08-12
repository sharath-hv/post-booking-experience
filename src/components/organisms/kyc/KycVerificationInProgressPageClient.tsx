"use client";

import { useEffect, useState } from "react";

import { KycVerificationInProgressScreen } from "@/components/organisms/kyc/KycVerificationInProgressScreen";
import { isCancelNoChargesFlow } from "@/helpers/experience-flow";
import { getKycVerificationNextHref } from "@/helpers/kyc-verification-outcome";

/** Resolves Express vs verification-failed fork for the Next CTA. */
export function KycVerificationInProgressPageClient() {
  const [hideDemoCta, setHideDemoCta] = useState(false);

  useEffect(() => {
    setHideDemoCta(isCancelNoChargesFlow());
  }, []);

  return (
    <KycVerificationInProgressScreen
      nextHref={getKycVerificationNextHref()}
      hideDemoCta={hideDemoCta}
    />
  );
}
