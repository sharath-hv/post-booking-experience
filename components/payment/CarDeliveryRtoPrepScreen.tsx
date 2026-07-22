"use client";

import { CarSummaryCardLite } from "@/components/concierge/artifacts";
import {
  BOOKING_CAR_COLOR,
  BOOKING_CAR_TITLE,
  BOOKING_CAR_VARIANT,
} from "@/components/kyc/booking-car-card-content";
import {
  DEMO_VEHICLE_CHASSIS_NO,
  DEMO_VEHICLE_ENGINE_NO,
} from "@/components/kyc/demo-vehicle-identification";
import { KycBookingProcessingScreen } from "@/components/kyc/KycBookingProcessingScreen";
import { KYC_ASSETS } from "@/components/kyc/kyc-assets";
import { useFullPaymentJourney } from "@/components/payment/use-full-payment-journey";
import { RtoRegistrationStatusCard } from "@/components/payment/RtoRegistrationStatusCard";
import { CAR_SOURCE_DETAIL, CAR_SOURCE_NAME } from "@/lib/dealer-attribution-content";
import styles from "./CarDeliveryRtoPrepScreen.module.scss";

const HEADLINE = "Your file is at the RTO, Sharath.";
const SUBLINE =
  "I've submitted your registration paperwork. The RTO usually takes a few working days — I'll stay on it and update you the moment there's news.";

/**
 * After insurance is set up — RTO is the active delivery milestone (see What&apos;s next nested rail).
 */
export function CarDeliveryRtoPrepScreen() {
  const { withBank } = useFullPaymentJourney();

  return (
    <KycBookingProcessingScreen
      headline={HEADLINE}
      subline={SUBLINE}
      callLabel="Want an update? I can call you"
      heroIllustrationSrc={KYC_ASSETS.rtoRegistrationProcessHero}
      nextHref={withBank("/payment/car-delivery-schedule")}
      prefetchHref={withBank("/payment/car-delivery-schedule")}
      nextCtaLabel="Next"
      heroSummaryCard={
        <div className={styles.flex_0}>
          <RtoRegistrationStatusCard />
          <CarSummaryCardLite
            title={BOOKING_CAR_TITLE}
            variant={BOOKING_CAR_VARIANT}
            colour={BOOKING_CAR_COLOR}
            dealerName={CAR_SOURCE_NAME}
            dealerDetail={CAR_SOURCE_DETAIL}
            engineNo={DEMO_VEHICLE_ENGINE_NO}
            chassisNo={DEMO_VEHICLE_CHASSIS_NO}
          />
        </div>
      }
      manageBookingShowVehicleIdentification
    />
  );
}
