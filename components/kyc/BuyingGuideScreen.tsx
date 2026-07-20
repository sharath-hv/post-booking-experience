"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import {
  BUYING_GUIDE_STEP_COUNT,
  type BuyingGuideStep,
} from "@/components/kyc/buying-guide-content";
import { PaymentSuccessStagger } from "@/components/ui/stagger-container";
import { buyingGuideNextPath } from "@/lib/buying-guide-urls";
import { primaryOrDemoNavCtaClass } from "@/lib/demo-nav-cta";
import { cn } from "@/lib/utils";
import styles from "./BuyingGuideScreen.module.scss";


/** Reserve space for fixed CTA: pt-3 + 48px button + bottom safe padding. */
const MAIN_BOTTOM_PADDING_CLASS = styles.mainBottomPadding;

/** Sequential reveal — image → copy → fixed CTA. */
const STAGGER_IMAGE = 0.1;
const STAGGER_STEP_LABEL = 0.2;
const STAGGER_TITLE = 0.28;
const STAGGER_BODY = 0.36;
const STAGGER_CTA = 0.44;

type BuyingGuideScreenProps = {
  step: BuyingGuideStep;
};

/**
 * Post-booking buying process onboarding — Figma steps 2460:7661 → 2460:7830.
 */
export function BuyingGuideScreen({ step }: BuyingGuideScreenProps) {
  const router = useRouter();
  const nextHref = buyingGuideNextPath(step.step);

  return (
    <>
      <div
        className={cn(styles.mx_auto_0, MAIN_BOTTOM_PADDING_CLASS)}
      >
        <PaymentSuccessStagger
          key={`image-${step.step}`}
          className={styles.relative_0}
          delay={STAGGER_IMAGE}
        >
          {step.imageSrc != null ? (
            <Image
              src={step.imageSrc}
              alt=""
              className={styles.h_auto_1}
              sizes="(max-width: 640px) 100vw, 640px"
              priority={step.step === 1}
            />
          ) : null}
        </PaymentSuccessStagger>

        <div className={styles.mt_8_2} key={`copy-${step.step}`}>
          <PaymentSuccessStagger delay={STAGGER_STEP_LABEL}>
            <p className={styles.text_xs_3}>
              Step {step.step} of {BUYING_GUIDE_STEP_COUNT}
            </p>
          </PaymentSuccessStagger>
          <PaymentSuccessStagger delay={STAGGER_TITLE}>
            <h1 className={styles.text_20px__4}>
              {step.title}
            </h1>
          </PaymentSuccessStagger>
          <PaymentSuccessStagger delay={STAGGER_BODY}>
            <p className={styles.text_sm_5}>{step.body}</p>
          </PaymentSuccessStagger>
        </div>
      </div>

      <div className={styles.fixed_6}>
        <PaymentSuccessStagger
          key={`cta-${step.step}`}
          className={styles.mx_auto_7}
          delay={STAGGER_CTA}
        >
          <button
            type="button"
            className={cn(
              primaryOrDemoNavCtaClass(step.ctaLabel),
              "focus-visible:outline focus-visible:ring-2 focus-visible:ring-[#121212]/30 focus-visible:ring-offset-2",
            )}
            onClick={() => router.push(nextHref)}
          >
            {step.ctaLabel}
          </button>
        </PaymentSuccessStagger>
      </div>
    </>
  );
}
