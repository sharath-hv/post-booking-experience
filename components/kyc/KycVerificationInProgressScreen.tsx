"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import menuIcon from "@/assets/menu.svg";
import infoIcon from "@/assets/Info.svg";
import kycInProgressHero from "@/assets/KYC in progress.svg";
import { GetHelpPillButton } from "@/components/kyc/GetHelpPillButton";
import { KycTopNavHeader } from "@/components/kyc/KycTopNavHeader";
import { WordByWordLine } from "@/components/payment/WordByWordLine";
import { AuroraLightLayer } from "@/components/ui/aurora-light-layer";
import {
  HERO_ACTION_HEADLINE_SUBLINE_GAP_CLASS,
  HERO_ICON_TOP_PT,
  HERO_ILLUSTRATION_TO_COPY_MT,
} from "@/components/ui/success-screen-layout";
import { ManageBookingBottomSheet } from "@/components/kyc/ManageBookingBottomSheet";
import { recordKycVerificationFailure } from "@/lib/kyc-verification-attempts";
import { DEMO_NAV_CTA_LABEL } from "@/lib/demo-nav-cta";
import { KYC_VERIFICATION_FAILED_HREF } from "@/lib/kyc-verification-outcome";
import { cn } from "@/lib/utils";
import styles from "./KycVerificationInProgressScreen.module.scss";


const HEADLINE = "Verification in progress";

const INFO_BOX = "No need to wait here, you will hear from us as soon as we are done verifying.";

/** Word cadence for the hero headline. */
const HEADLINE_WORD_DELAY_MS = 135;
/** Shared opacity transition duration (headline words + subline + CTA). */
const HERO_FADE_DURATION_CLASS = styles.heroFadeDuration;
/** Delay after subline appears before the CTA fades in. */
const SUBLINE_TO_CTA_DELAY_MS = 240;
/** Hero block (header + aurora + content) fills at least 90% of the viewport; uses `dvh` for mobile browser chrome. */
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

type KycVerificationInProgressScreenProps = {
  /** Primary CTA destination (defaults to booking processing). */
  nextHref?: string;
  /** Hide demo Next CTA (e.g. cancel-no-charges journey endpoint). */
  hideDemoCta?: boolean;
};

/**
 * KYC verification in progress — action-page layout aligned with `KycPendingScreen`.
 */
export function KycVerificationInProgressScreen({
  nextHref = "/kyc/processing",
  hideDemoCta = false,
}: KycVerificationInProgressScreenProps) {
  const router = useRouter();
  const [reduceMotion, setReduceMotion] = useState(false);
  /** Headline word animation starts only after the KYC hero art has loaded (order: header → illustration → action copy). */
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
    router.prefetch(nextHref);
  }, [router, nextHref]);

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
          <div className={cn(styles.relative_1_0, HERO_ICON_TOP_PT)}>
            <div className={styles.relative_6}>
              <Image
                src={kycInProgressHero}
                alt=""
                width={80}
                height={80}
                className={styles.h_20_7}
                priority
                unoptimized
                onLoad={() => setHeroArtReady(true)}
              />
            </div>

            <div className={cn(HERO_ILLUSTRATION_TO_COPY_MT, styles.flex_2)}>
              <div className={cn(styles.flex_3_0, HERO_ACTION_HEADLINE_SUBLINE_GAP_CLASS)}>
                {reduceMotion ? (
                  <h1 className={styles.text_2xl_8}>
                    {HEADLINE}
                  </h1>
                ) : (
                  <WordByWordLine
                    as="h1"
                    ariaLabel={HEADLINE}
                    text={HEADLINE}
                    wordDelayMs={HEADLINE_WORD_DELAY_MS}
                    wordOpacityDurationClassName={HERO_FADE_DURATION_CLASS}
                    className={styles.text_2xl_8}
                    onComplete={onHeadlineComplete}
                    startWhen={heroArtReady}
                  />
                )}
                <p
                  className={cn(styles.text_sm_4, HERO_FADE_DURATION_CLASS, styles.ease_out_4, showSubline ? styles.opacity_100_4 : styles.opacity_0_4)}
                  aria-hidden={!showSubline}
                >
                  We are verifying your documents.
                  <br />
                  This usually takes 1-2 hours.
                </p>
              </div>
              <div
                className={cn(styles.mt_6_5, "card-elevated", HERO_FADE_DURATION_CLASS, styles.ease_out_5, showSubline ? styles.opacity_100_5 : styles.opacity_0_5)}
                aria-hidden={!showSubline}
              >
                <span className={styles.relative_9}>
                  <Image
                    src={infoIcon}
                    alt=""
                    fill
                    className={styles.object_contain_2}
                    unoptimized
                    sizes="20px"
                  />
                </span>
                <p className={styles.text_xs_10}>{INFO_BOX}</p>
              </div>
            </div>

            {hideDemoCta ? null : (
              <div className={styles.mt_auto_11}>
                <button
                  type="button"
                  className={cn(
                    styles.demo_nav_cta_12, "demo-nav-cta",
                    HERO_FADE_DURATION_CLASS,
                    styles.ease_out_13,
                    showCta ? styles.opacity_100_14 : styles.pointer_events_none_15,
                  )}
                  tabIndex={showCta ? 0 : -1}
                  onClick={() => {
                    if (nextHref === KYC_VERIFICATION_FAILED_HREF) {
                      recordKycVerificationFailure();
                    }
                    router.push(nextHref);
                  }}
                >
                  {DEMO_NAV_CTA_LABEL}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <ManageBookingBottomSheet open={manageBookingOpen} onClose={() => setManageBookingOpen(false)} />
    </div>
  );
}
