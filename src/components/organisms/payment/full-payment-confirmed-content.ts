import moneyIcon from "@/assets/money.svg";
import newCarIcon from "@/assets/New car.svg";
import phoneIcon from "@/assets/Phone.svg";
import type { SelfFinanceHowItWorksStep } from "@/components/organisms/payment/self-finance-confirmed-content";
import { PARTNER_DEALER_LABEL_CAPITALIZED } from "@/constants/dealer-attribution-content";
import { FULL_PAYMENT_CAR_DUE_LABEL } from "@/constants/loan-amount-demo-constants";

export type FullPaymentHowItWorksStep = SelfFinanceHowItWorksStep;

/** Short due label for sheet copy (e.g. "30 May" from "30 May 2026"). */
const FULL_PAYMENT_DUE_SHORT = FULL_PAYMENT_CAR_DUE_LABEL.replace(/\s+\d{4}$/, "");

/**
 * Full payment — "Here is how it works" steps (confirm bottom sheet).
 */
export const FULL_PAYMENT_HOW_IT_WORKS_STEPS: readonly FullPaymentHowItWorksStep[] = [
  {
    description: `${PARTNER_DEALER_LABEL_CAPITALIZED} will call you to share the payment details. Transfer the car amount directly to them.`,
    icon: phoneIcon,
  },
  {
    description: `Complete your full payment by ${FULL_PAYMENT_DUE_SHORT} to keep your booking active.`,
    icon: moneyIcon,
  },
  {
    description: "That is it. We start getting your car ready for delivery.",
    icon: newCarIcon,
  },
];
