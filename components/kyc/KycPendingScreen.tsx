"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import lockIcon from "@/assets/lock.svg";
import menuIcon from "@/assets/menu.svg";
import { GetHelpPillButton } from "@/components/kyc/GetHelpPillButton";
import { KYC_ASSETS } from "@/components/kyc/kyc-assets";
import { KycTopNavHeader } from "@/components/kyc/KycTopNavHeader";
import { ManageBookingBottomSheet } from "@/components/kyc/ManageBookingBottomSheet";
import { ShiviIntroBottomSheet } from "@/components/kyc/ShiviIntroBottomSheet";
import { WordByWordLine } from "@/components/payment/WordByWordLine";
import { AuroraLightLayer } from "@/components/ui/aurora-light-layer";
import {
  HERO_ACTION_HEADLINE_SUBLINE_GAP_CLASS,
  HERO_ICON_TOP_PT,
  HERO_ILLUSTRATION_TO_COPY_MT,
} from "@/components/ui/success-screen-layout";
import { isModifyNoChargesFlow } from "@/lib/experience-flow";
import { cn } from "@/lib/utils";
import styles from "./KycPendingScreen.module.scss";


const KYC_HEADLINE = "Verify your identity, Sharath";

const KYC_SUBLINE =
  "Your booking is waiting to be processed. Keep your PAN and Aadhaar ready. Once verified, we start processing right away.";

const KYC_INFO_BOX =
  "Your documents are stored securely and shared only with Hyundai to process your booking.";

const DEADLINE_LINE = "Complete by 24 Apr, 3:00 PM to avoid cancellation";

/** Word cadence for the hero headline. */
const HEADLINE_WORD_DELAY_MS = 135;
/** Shared opacity transition duration (headline words + subline + CTA + warning). */
const HERO_FADE_DURATION_CLASS = styles.heroFadeDuration;
/** Matches {@link HERO_FADE_DURATION_CLASS} — wait for opacity transition to finish. */
const CONTENT_FADE_MS = 450;
/** Delay after subline appears before the CTA fades in. */
const SUBLINE_TO_CTA_DELAY_MS = 240;
/** Delay after CTA is shown before the warning line appears. */
const CTA_TO_WARNING_DELAY_MS = 480;
/** Brief pause after all blocks are visible before the Shivi intro sheet. */
const SHIVI_INTRO_DELAY_MS = 200;

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

/**
 * KYC verification (pending) — [Figma 2179:8512](https://www.figma.com/design/nW5SWmJdxxsCEDlqBN7C0L/Post-booking-experience?node-id=2179-8512).
 * Shivi intro sheet after full page reveal — [Figma 2479:7600](https://www.figma.com/design/nW5SWmJdxxsCEDlqBN7C0L/Post-booking-experience?node-id=2479-7600).
 */
export function KycPendingScreen() {
  const router = useRouter();
  const [reduceMotion, setReduceMotion] = useState(false);
  const [heroImageLoaded, setHeroImageLoaded] = useState(false);
  const [kycContentRevealed, setKycContentRevealed] = useState(false);
  const [shiviIntroOpen, setShiviIntroOpen] = useState(false);
  const [showSubline, setShowSubline] = useState(false);
  const [showCta, setShowCta] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [manageBookingOpen, setManageBookingOpen] = useState(false);
  const [modifyNoChargesFlow, setModifyNoChargesFlow] = useState(false);

  useEffect(() => {
    setModifyNoChargesFlow(isModifyNoChargesFlow());
  }, []);

  const scheduleShiviIntro = useCallback(() => {
    window.setTimeout(() => {
      setKycContentRevealed(true);
    }, CONTENT_FADE_MS + SHIVI_INTRO_DELAY_MS);
  }, []);

  const onHeadlineComplete = useCallback(() => {
    setShowSubline(true);
    window.setTimeout(() => {
      setShowCta(true);
      window.setTimeout(() => {
        setShowWarning(true);
        scheduleShiviIntro();
      }, CTA_TO_WARNING_DELAY_MS);
    }, SUBLINE_TO_CTA_DELAY_MS);
  }, [scheduleShiviIntro]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduceMotion(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (!reduceMotion || !heroImageLoaded) return;
    setShowSubline(true);
    setShowCta(true);
    setShowWarning(true);
    const id = window.setTimeout(() => {
      setKycContentRevealed(true);
    }, CONTENT_FADE_MS + SHIVI_INTRO_DELAY_MS);
    return () => window.clearTimeout(id);
  }, [reduceMotion, heroImageLoaded]);

  useEffect(() => {
    if (!kycContentRevealed) return;
    setShiviIntroOpen(true);
  }, [kycContentRevealed]);

  useEffect(() => {
    if (reduceMotion) return;
    const id = window.setTimeout(() => {
      setHeroImageLoaded((loaded) => loaded || true);
    }, 2800);
    return () => window.clearTimeout(id);
  }, [reduceMotion]);

  const dismissShiviIntro = useCallback(() => {
    setShiviIntroOpen(false);
  }, []);

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
                <div className={cn(shiviIntroOpen && styles.invisible_12)} aria-hidden={shiviIntroOpen}>
                  <GetHelpPillButton />
                </div>
                <MenuOptionsButton onClick={() => setManageBookingOpen(true)} />
              </div>
            }
          />
          <AuroraLightLayer />
          <div className={cn(styles.relative_1_0, HERO_ICON_TOP_PT)}>
            <div className={styles.relative_6}>
              <Image
                src={KYC_ASSETS.kycHero}
                alt=""
                width={80}
                height={80}
                className={styles.h_20_7}
                priority
                unoptimized
                onLoad={() => setHeroImageLoaded(true)}
              />
            </div>

            <div className={cn(HERO_ILLUSTRATION_TO_COPY_MT, styles.flex_2)}>
              <div className={cn(styles.flex_3_0, HERO_ACTION_HEADLINE_SUBLINE_GAP_CLASS)}>
                {reduceMotion ? (
                  <h1 className={styles.text_2xl_8}>
                    {KYC_HEADLINE}
                  </h1>
                ) : (
                  <WordByWordLine
                    as="h1"
                    ariaLabel={KYC_HEADLINE}
                    text={KYC_HEADLINE}
                    wordDelayMs={HEADLINE_WORD_DELAY_MS}
                    wordOpacityDurationClassName={HERO_FADE_DURATION_CLASS}
                    className={styles.text_2xl_8}
                    onComplete={onHeadlineComplete}
                    startWhen={heroImageLoaded}
                  />
                )}
                <p
                  className={cn(styles.text_sm_4, HERO_FADE_DURATION_CLASS, styles.ease_out_4, showSubline ? styles.opacity_100_4 : styles.opacity_0_4)}
                  aria-hidden={!showSubline}
                >
                  {KYC_SUBLINE}
                </p>
              </div>
              <div
                className={cn(styles.mt_6_5, "card-elevated", HERO_FADE_DURATION_CLASS, styles.ease_out_5, showSubline ? styles.opacity_100_5 : styles.opacity_0_5)}
                aria-hidden={!showSubline}
              >
                <Image
                  src={lockIcon}
                  alt=""
                  width={20}
                  height={20}
                  className={styles.size_5_9}
                  unoptimized
                />
                <p className={styles.text_xs_10}>{KYC_INFO_BOX}</p>
              </div>
            </div>

            <div className={styles.mt_auto_11}>
              <p
                className={cn(styles.text_center_6, HERO_FADE_DURATION_CLASS, styles.ease_out_6, showWarning ? styles.opacity_100_6 : styles.opacity_0_6)}
                aria-hidden={!showWarning}
              >
                {DEADLINE_LINE}
              </p>
              <button
                type="button"
                className={cn(styles.primary_cta_7, "primary-cta", HERO_FADE_DURATION_CLASS, styles.ease_out_7, showCta ? styles.opacity_100_7 : styles.pointer_events_none_7)}
                tabIndex={showCta ? 0 : -1}
                onClick={() => {
                  if (modifyNoChargesFlow) {
                    setManageBookingOpen(true);
                    return;
                  }
                  router.push("/kyc/upload");
                }}
              >
                {modifyNoChargesFlow
                  ? "Modify your booking"
                  : "Start verification • Takes 2 minutes"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <ShiviIntroBottomSheet open={shiviIntroOpen} onClose={dismissShiviIntro} />
      <ManageBookingBottomSheet open={manageBookingOpen} onClose={() => setManageBookingOpen(false)} />
    </div>
  );
}
