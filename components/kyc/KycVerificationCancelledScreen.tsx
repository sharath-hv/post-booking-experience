"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import infoIcon from "@/assets/Info.svg";
import kycFailedHero from "@/assets/KYC failed.svg";
import menuIcon from "@/assets/menu.svg";
import { KYC_VERIFICATION_CANCELLED_COPY } from "@/components/kyc/kyc-verification-cancelled-content";
import { GetHelpPillButton } from "@/components/kyc/GetHelpPillButton";
import { KycTopNavHeader } from "@/components/kyc/KycTopNavHeader";
import { ManageBookingBottomSheet } from "@/components/kyc/ManageBookingBottomSheet";
import { WordByWordLine } from "@/components/payment/WordByWordLine";
import { AuroraLightLayer } from "@/components/ui/aurora-light-layer";
import styles from "./KycVerificationCancelledScreen.module.scss";

import {
  HERO_ACTION_HEADLINE_SUBLINE_GAP_CLASS,
  HERO_ILLUSTRATION_TO_COPY_MT,
} from "@/components/ui/success-screen-layout";

const HEADLINE_WORD_DELAY_MS = 135;
const HERO_FADE_DURATION_CLASS = styles.heroFadeDuration;
const SUBLINE_TO_CTA_DELAY_MS = 240;
const HERO_MIN_HEIGHT = styles.heroMinHeight;

function MenuOptionsButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label="More options"
      onClick={onClick}
      className={styles.flex_0}
    >
      <span className={styles.relative_1} aria-hidden>
        <Image src={menuIcon} alt="" fill className={styles.object_contain_2} unoptimized sizes="24px" />
      </span>
    </button>
  );
}

/**
 * Second KYC verification failure — booking auto-cancelled; refund to original payment source (demo).
 */
export function KycVerificationCancelledScreen() {
  const router = useRouter();
  const [reduceMotion, setReduceMotion] = useState(false);
  const [heroArtReady, setHeroArtReady] = useState(false);
  const [showSubline, setShowSubline] = useState(false);
  const [showCta, setShowCta] = useState(false);
  const [manageBookingOpen, setManageBookingOpen] = useState(false);

  const onHeadlineComplete = useCallback(() => {
    setShowSubline(true);
    window.setTimeout(() => setShowCta(true), SUBLINE_TO_CTA_DELAY_MS);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    if (mq.matches) {
      setHeroArtReady(true);
      setShowSubline(true);
      setShowCta(true);
    }
  }, []);

  useEffect(() => {
    if (reduceMotion) return;
    const id = window.setTimeout(() => {
      setHeroArtReady((ready) => (ready ? ready : true));
    }, 2800);
    return () => window.clearTimeout(id);
  }, [reduceMotion]);

  useEffect(() => {
    router.prefetch(KYC_VERIFICATION_CANCELLED_COPY.doneHref);
  }, [router]);

  return (
    <div className={styles.flex_3}>
      <div className={styles.mx_auto_4}>
        <div
          className={cn(styles.kyc_pending_hero_card_0, "kyc-pending-hero-card", HERO_MIN_HEIGHT)}
        >
          <KycTopNavHeader
            transparent
            endSlot={
              <div className={styles.flex_5}>
                <GetHelpPillButton />
                <MenuOptionsButton onClick={() => setManageBookingOpen(true)} />
              </div>
            }
          />
          <AuroraLightLayer />
          <div className={styles.relative_6}>
            <div className={styles.relative_7}>
              <Image
                src={kycFailedHero}
                alt=""
                width={80}
                height={80}
                className={styles.h_20_8}
                priority
                unoptimized
                onLoad={() => setHeroArtReady(true)}
              />
            </div>

            <div className={cn(HERO_ILLUSTRATION_TO_COPY_MT, styles.flex_1)}>
              <div className={cn(styles.flex_2, HERO_ACTION_HEADLINE_SUBLINE_GAP_CLASS)}>
                {reduceMotion ? (
                  <h1 className={styles.text_2xl_9}>
                    {KYC_VERIFICATION_CANCELLED_COPY.headline}
                  </h1>
                ) : (
                  <WordByWordLine
                    as="h1"
                    ariaLabel={KYC_VERIFICATION_CANCELLED_COPY.headline}
                    text={KYC_VERIFICATION_CANCELLED_COPY.headline}
                    wordDelayMs={HEADLINE_WORD_DELAY_MS}
                    wordOpacityDurationClassName={HERO_FADE_DURATION_CLASS}
                    className={styles.text_2xl_9}
                    onComplete={onHeadlineComplete}
                    startWhen={heroArtReady}
                  />
                )}
                <p
                  className={cn(styles.text_sm_3, HERO_FADE_DURATION_CLASS, styles.ease_out_3, showSubline ? styles.opacity_100_3 : styles.opacity_0_3)}
                  aria-hidden={!showSubline}
                >
                  {KYC_VERIFICATION_CANCELLED_COPY.subline}
                </p>
              </div>
              <div
                className={cn(styles.mt_6_4, "card-elevated", HERO_FADE_DURATION_CLASS, styles.ease_out_4, showSubline ? styles.opacity_100_4 : styles.opacity_0_4)}
                aria-hidden={!showSubline}
              >
                <span className={styles.relative_10}>
                  <Image
                    src={infoIcon}
                    alt=""
                    fill
                    className={styles.object_contain_2}
                    unoptimized
                    sizes="20px"
                  />
                </span>
                <p className={styles.text_xs_11}>
                  {KYC_VERIFICATION_CANCELLED_COPY.infoBox}
                </p>
              </div>
            </div>

            <div className={styles.mt_auto_12}>
              <button
                type="button"
                className={cn(styles.primary_cta_5, "primary-cta", HERO_FADE_DURATION_CLASS, styles.ease_out_5, showCta ? styles.opacity_100_5 : styles.pointer_events_none_5)}
                tabIndex={showCta ? 0 : -1}
                onClick={() => router.push(KYC_VERIFICATION_CANCELLED_COPY.doneHref)}
              >
                {KYC_VERIFICATION_CANCELLED_COPY.ctaLabel}
              </button>
            </div>
          </div>
        </div>
      </div>
      <ManageBookingBottomSheet open={manageBookingOpen} onClose={() => setManageBookingOpen(false)} />
    </div>
  );
}
