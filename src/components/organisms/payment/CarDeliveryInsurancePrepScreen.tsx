"use client";

import { useSearchParams } from "next/navigation";

import { BookingProcessingScreen } from "@/components/organisms/BookingProcessingScreen";
import { KYC_ASSETS } from "@/utils/kyc-assets";
import { useFullPaymentJourney } from "@/hooks/use-full-payment-journey";
import { ShieldPolicyCard } from "@/components/organisms/payment/ShieldPolicyCard";
import {
  parseInsuranceAddonIds,
  type InsuranceTenureId,
} from "@/components/organisms/payment/insurance-coverage-content";
import { DEMO_NAV_CTA_LABEL } from "@/constants/demo-nav-cta";

const HEADLINE = "Your Creta is covered, Sharath";

/** Policy issued instantly (ACKO is the insurer) — news turn, then on to the RTO wait. */
export function CarDeliveryInsurancePrepScreen() {
  const { withBank } = useFullPaymentJourney();
  const searchParams = useSearchParams();
  const tenure = (searchParams.get("tenure") ?? "1+3") as InsuranceTenureId;
  const selectedAddonIds = parseInsuranceAddonIds(searchParams.get("addons"));
  const subline =
    selectedAddonIds.length > 0
      ? `Zero depreciation cover plus your ${selectedAddonIds.length} add-on${selectedAddonIds.length === 1 ? "" : "s"}, active from today. Next, I'll take your registration file to the RTO.`
      : "Zero depreciation cover, active from today. Next, I'll take your registration file to the RTO.";

  return (
    <BookingProcessingScreen
      headline={HEADLINE}
      subline={subline}
      callLabel="Questions about coverage? I can call you"
      heroIllustrationSrc={KYC_ASSETS.insuranceInProgressHero}
      nextHref={withBank("/delivery/rto")}
      prefetchHref={withBank("/delivery/rto")}
      nextCtaLabel={DEMO_NAV_CTA_LABEL}
      timeSkipLabel="RTO registration"
      suppressEcho
      heroSummaryCard={
        <ShieldPolicyCard mode="active" tenure={tenure} selectedAddonIds={selectedAddonIds} />
      }
      manageBookingShowVehicleIdentification
    />
  );
}
