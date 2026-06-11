import type { StaticImageData } from "next/image";

import buyingGuideStep01 from "@/assets/onboarding/Step 01.png";
import buyingGuideStep02 from "@/assets/onboarding/Step 02.png";
import buyingGuideStep03 from "@/assets/onboarding/Step 03.png";

/**
 * Buying process onboarding — Figma:
 * [Step 1](https://www.figma.com/design/nW5SWmJdxxsCEDlqBN7C0L/Post-booking-experience?node-id=2460-7661) ·
 * [Step 2](https://www.figma.com/design/nW5SWmJdxxsCEDlqBN7C0L/Post-booking-experience?node-id=2460-7772) ·
 * [Step 3](https://www.figma.com/design/nW5SWmJdxxsCEDlqBN7C0L/Post-booking-experience?node-id=2460-7801) (payment + delivery) → `/kyc`
 */
export const BUYING_GUIDE_STEP_COUNT = 3;

export type BuyingGuideStep = {
  step: number;
  title: string;
  body: string;
  ctaLabel: string;
  /** Optional hero illustration — add when assets are ready. */
  imageSrc?: StaticImageData | string;
};

export const BUYING_GUIDE_STEPS: readonly BuyingGuideStep[] = [
  {
    step: 1,
    title: "First, let me verify who you are",
    body: "I need your PAN and Aadhaar to get started. Takes 2 minutes. Once done, I will start working on your Creta right away.",
    ctaLabel: "Next",
    imageSrc: buyingGuideStep01,
  },
  {
    step: 2,
    title: "Then I will find and confirm your car",
    body: "I will find the best dealer who has your exact Creta in stock and confirm your booking with them.",
    ctaLabel: "Next",
    imageSrc: buyingGuideStep02,
  },
  {
    step: 3,
    title: "Finally, pay and get your Creta delivered",
    body: "I will help you choose how to pay, then you pick a date and I will confirm the dealer and location for delivery.",
    ctaLabel: "Let's get started",
    imageSrc: buyingGuideStep03,
  },
] as const;

export function getBuyingGuideStep(step: number): BuyingGuideStep | undefined {
  return BUYING_GUIDE_STEPS.find((item) => item.step === step);
}

export function isBuyingGuideStep(value: number): value is 1 | 2 | 3 {
  return Number.isInteger(value) && value >= 1 && value <= BUYING_GUIDE_STEP_COUNT;
}
