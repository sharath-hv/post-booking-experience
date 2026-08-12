import { notFound, redirect } from "next/navigation";

import { BuyingGuideScreen } from "@/components/organisms/kyc/BuyingGuideScreen";
import {
  BUYING_GUIDE_STEP_COUNT,
  getBuyingGuideStep,
  isBuyingGuideStep,
} from "@/components/organisms/kyc/buying-guide-content";
import { BUYING_GUIDE_ENTRY_PATH } from "@/helpers/buying-guide-urls";

type PageProps = {
  params: Promise<{ step: string }>;
};

export function generateStaticParams() {
  return Array.from({ length: BUYING_GUIDE_STEP_COUNT }, (_, index) => ({
    step: String(index + 1),
  }));
}

/**
 * Buying process onboarding (3 steps).
 * Step 3 **Let's get started** → `/identity`.
 */
export default async function BuyingGuideStepPage({ params }: PageProps) {
  const { step: stepRaw } = await params;
  const stepNumber = Number(stepRaw);

  if (!Number.isFinite(stepNumber) || stepNumber < 1) {
    redirect(BUYING_GUIDE_ENTRY_PATH);
  }

  if (!isBuyingGuideStep(stepNumber)) {
    notFound();
  }

  const step = getBuyingGuideStep(stepNumber);
  if (step == null) {
    notFound();
  }

  return <BuyingGuideScreen step={step} />;
}
