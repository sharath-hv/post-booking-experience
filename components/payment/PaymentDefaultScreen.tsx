"use client";

import { KycBookingProcessingScreen } from "@/components/kyc/KycBookingProcessingScreen";
import { KYC_ASSETS } from "@/components/kyc/kyc-assets";
import { DownPaymentSummaryCard } from "@/components/payment/DownPaymentSummaryCard";
import { BOOKING_PAYMENT_SUMMARY_INR } from "@/lib/payment-summary-demo";

const PAYMENT_DEFAULT_HEADLINE = "How would you like to pay, Sharath?";

const HERO_SUBTEXT =
  "Choose from ACKO Drive Finance, Self Finance or Full Cash. More details on the next screen.";

const PAYMENT_WARNING_LINE = "Confirm by 24 Apr, 3:00 PM to avoid cancellation";

/**
 * Payment default — same shell and motion as `KycBookingProcessingScreen` (e.g. `/car-allocation/pending`):
 * nav + manage booking sheet, payment hero illustration, primary CTA.
 */
export function PaymentDefaultScreen() {
  return (
    <KycBookingProcessingScreen
      headline={PAYMENT_DEFAULT_HEADLINE}
      subline={HERO_SUBTEXT}
      heroSummaryCard={
        <DownPaymentSummaryCard
          variant="booking_payment"
          downPaymentTotalInr={BOOKING_PAYMENT_SUMMARY_INR.ackoDrivePriceInr}
          amountPaidInr={BOOKING_PAYMENT_SUMMARY_INR.bookingAmountPaidInr}
          remainingAmountInr={BOOKING_PAYMENT_SUMMARY_INR.amountToPayInr}
        />
      }
      heroIllustrationSrc={KYC_ASSETS.paymentHero}
      nextHref="/payment/choose"
      prefetchHref="/payment/choose"
      ctaWarningLine={PAYMENT_WARNING_LINE}
      nextCtaLabel="Choose how to pay"
      manageBookingShowVehicleIdentification
    />
  );
}
