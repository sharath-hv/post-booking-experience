"use client";

import { KycBookingProcessingScreen } from "@/components/kyc/KycBookingProcessingScreen";
import { LoanProcessingWhatsNext } from "@/components/payment/LoanProcessingWhatsNext";
import { ZeroDepInsuranceCoverageCard } from "@/components/payment/ZeroDepInsuranceCoverageCard";

const HEADLINE = "Your car is getting prepared for delivery, Sharath!";
const SUBLINE =
  "We're setting up your car insurance now. We'll update you as things progress.";

/** After down-payment / disbursement messaging — delivery prep + insurance (hero card + timeline). */
export function CarDeliveryInsurancePrepScreen() {
  return (
    <KycBookingProcessingScreen
      headline={HEADLINE}
      subline={SUBLINE}
      nextHref="/payment/car-delivery-rto"
      prefetchHref="/payment/car-delivery-rto"
      nextCtaLabel="Next"
      heroSummaryCard={<ZeroDepInsuranceCoverageCard />}
      whatsNextCard={<LoanProcessingWhatsNext variant="delivery_insurance_prep" />}
    />
  );
}
