"use client";

import { useSearchParams } from "next/navigation";

import { BookingProcessingScreen } from "@/components/organisms/BookingProcessingScreen";
import { withInsuranceDeliveryQuery } from "@/helpers/paymentUrls";
import { KYC_ASSETS } from "@/utils/kyc-assets";
import { ShieldPolicyCard } from "@/components/organisms/payment/ShieldPolicyCard";
import {
  insurancePremiumForSelection,
  parseInsuranceAddonIds,
  type InsuranceTenureId,
} from "@/components/organisms/payment/insurance-coverage-content";
import { DEMO_NAV_CTA_LABEL } from "@/constants/demo-nav-cta";

const HEADLINE = "I'm getting your Creta insured, Sharath";

/**
 * Insurance is not instant — Shivi is waiting on the insurer. Demo time-skip
 * lands on the issued-policy turn once cover is active.
 */
export function CarDeliveryInsurancePendingScreen() {
  const searchParams = useSearchParams();
  const tenure = (searchParams.get("tenure") ?? "1+3") as InsuranceTenureId;
  const selectedAddonIds = parseInsuranceAddonIds(searchParams.get("addons"));
  const issuedHref = withInsuranceDeliveryQuery("/delivery/insurance-prep", searchParams);
  const subline =
    selectedAddonIds.length > 0
      ? `Zero depreciation cover plus your ${selectedAddonIds.length} add-on${selectedAddonIds.length === 1 ? "" : "s"} is with the insurer. I'll update you the moment it's active — then I'll take your registration file to the RTO.`
      : "This policy needs a little longer than usual. I'll update you the moment it's active — then I'll take your registration file to the RTO.";

  return (
    <BookingProcessingScreen
      headline={HEADLINE}
      subline={subline}
      callLabel="Want an update?"
      heroIllustrationSrc={KYC_ASSETS.insuranceInProgressHero}
      nextHref={issuedHref}
      prefetchHref={issuedHref}
      nextCtaLabel={DEMO_NAV_CTA_LABEL}
      timeSkipLabel="When the policy is issued"
      suppressEcho
      heroSummaryCard={
        <ShieldPolicyCard
          mode="quote"
          tenure={tenure}
          premiumInr={insurancePremiumForSelection(tenure, selectedAddonIds)}
          selectedAddonIds={selectedAddonIds}
        />
      }
      manageBookingShowVehicleIdentification
    />
  );
}
