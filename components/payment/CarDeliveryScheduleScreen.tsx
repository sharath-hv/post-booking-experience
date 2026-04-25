"use client";

import { KycBookingProcessingScreen } from "@/components/kyc/KycBookingProcessingScreen";
import { LoanProcessingWhatsNext } from "@/components/payment/LoanProcessingWhatsNext";

const HEADLINE = "Pick a delivery date when you're ready, Sharath!";
const SUBLINE =
  "Your car is registered and ready for delivery. Choose a convenient time to receive it.";

/**
 * Final pre-delivery step in this demo — scheduling (timeline: insurance + RTO done; date selection active).
 */
export function CarDeliveryScheduleScreen() {
  return (
    <KycBookingProcessingScreen
      headline={HEADLINE}
      subline={SUBLINE}
      nextHref="/kyc"
      prefetchHref="/kyc"
      nextCtaLabel="Schedule delivery"
      whatsNextCard={<LoanProcessingWhatsNext variant="delivery_schedule_prep" />}
    />
  );
}
