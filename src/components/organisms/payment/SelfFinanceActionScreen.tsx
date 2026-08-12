"use client";

import { BookingProcessingScreen } from "@/components/organisms/BookingProcessingScreen";
import { PAYMENT_CHOOSE_ASSETS } from "@/components/organisms/payment/payment-choose-assets";
import { ProformaInvoiceCard } from "@/components/organisms/payment/ProformaInvoiceCard";

const HEADLINE_LINE_1 = "Your proforma invoice";
const HEADLINE_LINE_2 = "is ready";

const SUBLINE =
  "Take this to your bank to get your loan sanctioned. This part runs on your clock. The sooner the bank confirms, the sooner your delivery locks. Come back with the sanctioned amount.";

/**
 * Self finance — “action” step after confirmation (`/payment/self-finance-confirmed`). Same shell as
 * {@link PaymentDefaultScreen}: processing hero + What’s next + primary CTA.
 */
export function SelfFinanceActionScreen() {
  return (
    <BookingProcessingScreen
      headline={HEADLINE_LINE_1}
      headlineLine2={HEADLINE_LINE_2}
      subline={SUBLINE}
      heroIllustrationSrc={PAYMENT_CHOOSE_ASSETS.documentsReceived}
      heroSummaryCard={<ProformaInvoiceCard />}
      nextHref="/payment/enter-disbursement-amount"
      prefetchHref="/payment/enter-disbursement-amount"
      nextCtaLabel="I have my loan amount"
      manageBookingShowVehicleIdentification
    />
  );
}
