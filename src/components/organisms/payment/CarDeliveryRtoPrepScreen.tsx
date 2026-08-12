"use client";

import { CarSummaryCardLite } from "@/components/organisms/artifacts";
import {
  BOOKING_CAR_COLOR,
  BOOKING_CAR_TITLE,
  BOOKING_CAR_VARIANT,
} from "@/constants/booking-car-card-content";
import {
  DEMO_VEHICLE_CHASSIS_NO,
  DEMO_VEHICLE_ENGINE_NO,
} from "@/constants/demo-vehicle-identification";
import { BookingProcessingScreen } from "@/components/organisms/BookingProcessingScreen";
import { KYC_ASSETS } from "@/utils/kyc-assets";
import { useFullPaymentJourney } from "@/hooks/use-full-payment-journey";
import { CAR_SOURCE_DETAIL, CAR_SOURCE_NAME } from "@/constants/dealer-attribution-content";

const HEADLINE = "Your file is at the RTO, Sharath.";
const SUBLINE =
  "I've submitted your registration paperwork. The RTO usually takes a few working days — I'll stay on it and update you the moment there's news.";

/**
 * After insurance is set up — RTO is the active delivery milestone (see What&apos;s next nested rail).
 */
export function CarDeliveryRtoPrepScreen() {
  const { withBank } = useFullPaymentJourney();

  return (
    <BookingProcessingScreen
      headline={HEADLINE}
      subline={SUBLINE}
      callLabel="Want an update? I can call you"
      heroIllustrationSrc={KYC_ASSETS.rtoRegistrationProcessHero}
      nextHref={withBank("/delivery/schedule")}
      prefetchHref={withBank("/delivery/schedule")}
      nextCtaLabel="Next"
      altTimeSkip={{
        label: "More docs needed",
        href: withBank("/delivery/rto/additional-documents"),
      }}
      heroSummaryCard={
        <CarSummaryCardLite
          title={BOOKING_CAR_TITLE}
          variant={BOOKING_CAR_VARIANT}
          colour={BOOKING_CAR_COLOR}
          dealerName={CAR_SOURCE_NAME}
          dealerDetail={CAR_SOURCE_DETAIL}
          engineNo={DEMO_VEHICLE_ENGINE_NO}
          chassisNo={DEMO_VEHICLE_CHASSIS_NO}
        />
      }
      manageBookingShowVehicleIdentification
    />
  );
}
