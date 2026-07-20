"use client";

import { useMemo } from "react";

import { KycBookingProcessingScreen } from "@/components/kyc/KycBookingProcessingScreen";
import { PAYMENT_CHOOSE_ASSETS } from "@/components/payment/payment-choose-assets";
import { ProformaInvoiceCard } from "@/components/payment/ProformaInvoiceCard";
import { ShimmerInfoCard } from "@/components/ui/ShimmerInfoCard";
import styles from "./SelfFinanceActionScreen.module.scss";


const HEADLINE_LINE_1 = "Your proforma invoice";
const HEADLINE_LINE_2 = "is ready";

const SUBLINE =
  "Take this to your bank to get your loan sanctioned. This part runs on your clock. The sooner the bank confirms, the sooner your delivery locks. Come back with the sanctioned amount.";

const CTA_WARNING_LINE =
  "Banks run on their own clock. Start today and your delivery date stays safe.";

/**
 * Self finance — “action” step after confirmation (`/payment/self-finance-confirmed`). Same shell as
 * {@link PaymentDefaultScreen}: processing hero + What’s next + primary CTA.
 */
export function SelfFinanceActionScreen() {
  const heroSummaryCard = useMemo(
    () => (
      <div className={styles.flex_0}>
        <ProformaInvoiceCard />
        <ShimmerInfoCard icon="info">{CTA_WARNING_LINE}</ShimmerInfoCard>
      </div>
    ),
    [],
  );

  return (
    <KycBookingProcessingScreen
      headline={HEADLINE_LINE_1}
      headlineLine2={HEADLINE_LINE_2}
      subline={SUBLINE}
      heroIllustrationSrc={PAYMENT_CHOOSE_ASSETS.documentsReceived}
      heroSummaryCard={heroSummaryCard}
      nextHref="/payment/enter-disbursement-amount"
      prefetchHref="/payment/enter-disbursement-amount"
      nextCtaLabel="I have my loan amount"
      manageBookingShowVehicleIdentification
    />
  );
}
