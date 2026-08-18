"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { PrimaryCta } from "@/components/atoms/cta/PrimaryCta";
import { type BuyingGuideStep } from "@/components/organisms/kyc/buying-guide-content";
import { RevealStagger } from "@/components/molecules/stagger-container";
import { BUYING_GUIDE_STEP_COUNT, buyingGuideNextPath } from "@/helpers/buying-guide-urls";
import { primaryOrDemoNavCtaClass, isDemoNavCtaLabel } from "@/constants/demo-nav-cta";
import { useCtaNavigation } from "@/hooks/use-cta-navigation";
import { cn } from "@/utils/utils";
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
  const { loading, start } = useCtaNavigation();
  const nextHref = buyingGuideNextPath(step.step);
  const isDemoNav = isDemoNavCtaLabel(step.ctaLabel);

  return (
    <>
      <div
        className={cn(styles.mx_auto_0, MAIN_BOTTOM_PADDING_CLASS)}
      >
        <RevealStagger
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
        </RevealStagger>

        <div className={styles.mt_8_2} key={`copy-${step.step}`}>
          <RevealStagger delay={STAGGER_STEP_LABEL}>
            <p className={styles.text_xs_3}>
              Step {step.step} of {BUYING_GUIDE_STEP_COUNT}
            </p>
          </RevealStagger>
          <RevealStagger delay={STAGGER_TITLE}>
            <h1 className={styles.text_20px__4}>
              {step.title}
            </h1>
          </RevealStagger>
          <RevealStagger delay={STAGGER_BODY}>
            <p className={styles.text_sm_5}>{step.body}</p>
          </RevealStagger>
        </div>
      </div>

      <div className={styles.fixed_6}>
        <RevealStagger
          key={`cta-${step.step}`}
          className={styles.mx_auto_7}
          delay={STAGGER_CTA}
        >
          {isDemoNav ? (
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
          ) : (
            <PrimaryCta
              className="focus-visible:outline focus-visible:ring-2 focus-visible:ring-[#121212]/30 focus-visible:ring-offset-2"
              loading={loading}
              onClick={() => start(() => router.push(nextHref))}
            >
              {step.ctaLabel}
            </PrimaryCta>
          )}
        </RevealStagger>
      </div>
    </>
  );
}
