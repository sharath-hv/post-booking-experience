"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import infoIcon from "@/assets/Info.svg";
import kycFailedHero from "@/assets/KYC failed.svg";
import menuIcon from "@/assets/menu.svg";
import {
  getKycVerificationFailedCopy,
  KYC_VERIFICATION_FAILED_CTA_WARNING,
  KYC_VERIFICATION_FAILED_UPLOAD_HREF,
  resolveKycVerificationFailureReason,
  type KycVerificationFailureReason,
} from "@/components/kyc/kyc-verification-failed-content";
import { GetHelpPillButton } from "@/components/kyc/GetHelpPillButton";
import { KycTopNavHeader } from "@/components/kyc/KycTopNavHeader";
import { ManageBookingBottomSheet } from "@/components/kyc/ManageBookingBottomSheet";
import { VerificationFailureReasonSwitcher } from "@/components/kyc/VerificationFailureReasonSwitcher";
import { WordByWordLine } from "@/components/payment/WordByWordLine";
import { AuroraLightLayer } from "@/components/ui/aurora-light-layer";
import { ShimmerInfoCard } from "@/components/ui/ShimmerInfoCard";
import styles from "./KycVerificationFailedScreen.module.scss";

import {
  HERO_ACTION_HEADLINE_SUBLINE_GAP_CLASS,
  HERO_ILLUSTRATION_TO_COPY_MT,
} from "@/components/ui/success-screen-layout";

const HEADLINE_WORD_DELAY_MS = 135;
const HERO_FADE_DURATION_CLASS = styles.heroFadeDuration;
const SUBLINE_TO_CTA_DELAY_MS = 240;
const CTA_TO_WARNING_DELAY_MS = 480;
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
 * Unhappy path after verification-in-progress — only used when the verification-failed flow is active.
 */
export function KycVerificationFailedScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [reduceMotion, setReduceMotion] = useState(false);
  const [heroArtReady, setHeroArtReady] = useState(false);
  const [showSubline, setShowSubline] = useState(false);
  const [showCta, setShowCta] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [manageBookingOpen, setManageBookingOpen] = useState(false);

  const initialReason = useMemo(
    () => resolveKycVerificationFailureReason(searchParams.get("reason")),
    [searchParams],
  );
  const [reason, setReason] = useState<KycVerificationFailureReason>(initialReason);

  useEffect(() => {
    setReason(resolveKycVerificationFailureReason(searchParams.get("reason")));
  }, [searchParams]);

  const copy = useMemo(() => getKycVerificationFailedCopy(reason), [reason]);

  const onReasonChange = useCallback(
    (next: KycVerificationFailureReason) => {
      setReason(next);
      const q = new URLSearchParams(searchParams.toString());
      q.set("reason", next);
      const qs = q.toString();
      router.replace(qs ? `/kyc/verification-failed?${qs}` : "/kyc/verification-failed", {
        scroll: false,
      });
    },
    [router, searchParams],
  );

  const onHeadlineComplete = useCallback(() => {
    setShowSubline(true);
    window.setTimeout(() => setShowCta(true), SUBLINE_TO_CTA_DELAY_MS);
    window.setTimeout(
      () => setShowWarning(true),
      SUBLINE_TO_CTA_DELAY_MS + CTA_TO_WARNING_DELAY_MS,
    );
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    if (mq.matches) {
      setHeroArtReady(true);
      setShowSubline(true);
      setShowCta(true);
      setShowWarning(true);
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
    router.prefetch(KYC_VERIFICATION_FAILED_UPLOAD_HREF);
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
          <div className={styles.relative_6}>
            <VerificationFailureReasonSwitcher value={reason} onChange={onReasonChange} />
          </div>
          <AuroraLightLayer />
          <div className={styles.relative_7}>
            <div className={styles.relative_8}>
              <Image
                src={kycFailedHero}
                alt=""
                width={80}
                height={80}
                className={styles.h_20_9}
                priority
                unoptimized
                onLoad={() => setHeroArtReady(true)}
              />
            </div>

            <div className={cn(HERO_ILLUSTRATION_TO_COPY_MT, styles.flex_1)}>
              <div className={cn(styles.flex_2, HERO_ACTION_HEADLINE_SUBLINE_GAP_CLASS)}>
                {reduceMotion ? (
                  <h1 className={styles.text_2xl_10}>
                    {copy.headline}
                  </h1>
                ) : (
                  <WordByWordLine
                    as="h1"
                    ariaLabel={copy.headline}
                    text={copy.headline}
                    wordDelayMs={HEADLINE_WORD_DELAY_MS}
                    wordOpacityDurationClassName={HERO_FADE_DURATION_CLASS}
                    className={styles.text_2xl_10}
                    onComplete={onHeadlineComplete}
                    startWhen={heroArtReady}
                  />
                )}
                <p
                  className={cn(styles.text_sm_3, HERO_FADE_DURATION_CLASS, styles.ease_out_3, showSubline ? styles.opacity_100_3 : styles.opacity_0_3)}
                  aria-hidden={!showSubline}
                >
                  {copy.subline}
                </p>
              </div>
              {copy.infoBoxBoldPrefix != null || copy.infoBox != null ? (
                <div
                  className={cn(styles.mt_6_4, "card-elevated", HERO_FADE_DURATION_CLASS, styles.ease_out_4, showSubline ? styles.opacity_100_4 : styles.opacity_0_4)}
                  aria-hidden={!showSubline}
                >
                  <span className={styles.relative_11}>
                    <Image
                      src={infoIcon}
                      alt=""
                      fill
                      className={styles.object_contain_2}
                      unoptimized
                      sizes="20px"
                    />
                  </span>
                  <p className={styles.text_xs_12}>
                    {copy.infoBoxBoldPrefix ? (
                      <>
                        <span className={styles.font_medium_13}>{copy.infoBoxBoldPrefix}</span> {copy.infoBox}
                      </>
                    ) : (
                      copy.infoBox
                    )}
                  </p>
                </div>
              ) : null}
            </div>

            <div className={styles.mt_auto_14}>
              <div
                className={cn(styles.transition_opacity_5, HERO_FADE_DURATION_CLASS, styles.ease_out_5, showWarning ? styles.opacity_100_5 : styles.opacity_0_5)}
                aria-hidden={!showWarning}
              >
                <ShimmerInfoCard icon="alert">
                  {KYC_VERIFICATION_FAILED_CTA_WARNING}
                </ShimmerInfoCard>
              </div>
              <button
                type="button"
                className={cn(styles.primary_cta_6, "primary-cta", HERO_FADE_DURATION_CLASS, styles.ease_out_6, showCta ? styles.opacity_100_6 : styles.pointer_events_none_6)}
                tabIndex={showCta ? 0 : -1}
                onClick={() => router.push(KYC_VERIFICATION_FAILED_UPLOAD_HREF)}
              >
                {copy.ctaLabel}
              </button>
            </div>
          </div>
        </div>
      </div>
      <ManageBookingBottomSheet open={manageBookingOpen} onClose={() => setManageBookingOpen(false)} />
    </div>
  );
}
