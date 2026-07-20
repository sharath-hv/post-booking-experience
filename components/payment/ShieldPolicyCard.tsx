"use client";

import Image from "next/image";
import { useState, type CSSProperties } from "react";

import ackoLogo from "@/assets/ACKO logo.svg";
import arrowRightIcon from "@/assets/Arrow_right.svg";
import { InsuranceCoverageBottomSheet } from "@/components/payment/InsuranceCoverageBottomSheet";
import styles from "./ShieldPolicyCard.module.scss";

const FOOTER_ARROW_MASK_STYLE = {
  maskImage: `url(${arrowRightIcon.src})`,
  WebkitMaskImage: `url(${arrowRightIcon.src})`,
} satisfies CSSProperties;

import {
  INSURANCE_CARD_HIGHLIGHTS,
  INSURANCE_COMPARE_AT_PREMIUM_INR,
  INSURANCE_COVER_HERO,
  INSURANCE_POLICY_NUMBER,
  INSURANCE_PREMIUM_INR,
  INSURANCE_TENURE_OPTIONS,
  type InsuranceTenureId,
} from "@/components/payment/insurance-coverage-content";

function formatInr(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.max(0, Math.round(amount)));
}

/**
 * Whisper-quiet shield watermark behind the hero. Faded out leftwards with an
 * alpha mask (alpha-only — not a colour fade, so no Safari dirty-fade risk).
 */
function ShieldWatermark() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={styles.watermark}
    >
      <path
        d="M12 2.5 4.5 5.4v6.1c0 4.6 3.2 8.1 7.5 9.9 4.3-1.8 7.5-5.3 7.5-9.9V5.4z"
        fill="currentColor"
      />
    </svg>
  );
}

export type ShieldPolicyCardProps = {
  /** `quote` — before the premium is paid (price, savings). `active` — the owned policy. */
  mode: "quote" | "active";
  /** Selected tenure — determines cover durations shown in active mode. Defaults to `"1+3"`. */
  tenure?: InsuranceTenureId;
};

/**
 * ACKO Drive Shield — premium leads as the hero number; IDV sits in a quiet
 * fact panel; coverage rows stay scannable. Same facts for quote and active
 * so the card “becomes yours” after payment.
 */
export function ShieldPolicyCard({ mode, tenure = "1+3" }: ShieldPolicyCardProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const isActive = mode === "active";
  const tenureOption = INSURANCE_TENURE_OPTIONS.find((o) => o.id === tenure) ?? INSURANCE_TENURE_OPTIONS[0];
  const odYears = tenureOption.ownDamageYears;
  const tpYears = tenureOption.thirdPartyYears;
  const savingsInr = INSURANCE_COMPARE_AT_PREMIUM_INR - INSURANCE_PREMIUM_INR;

  return (
    <>
      <section
        className={[styles.card, "card-elevated"].filter(Boolean).join(" ")}
        aria-label={isActive ? "Your active car insurance policy" : "Car insurance coverage"}
      >
        <div className={styles.header}>
          <ShieldWatermark />

          <div className={styles.brandRow}>
            <div className={styles.brandCopy}>
              {isActive ? (
                <span className={styles.activeBadge}>
                  <span className={styles.pulseWrap} aria-hidden>
                    <span className={styles.pulseRing} />
                    <span className={styles.pulseDot} />
                  </span>
                  Active
                </span>
              ) : null}
              <p className={styles.title}>ACKO Drive Shield</p>
              <p className={styles.subtitle}>
                {isActive
                  ? `${odYears} year Zero depreciation cover for your Creta`
                  : "Built for your new Creta"}
              </p>
            </div>
            <div className={styles.logoWrap}>
              <Image
                src={ackoLogo}
                alt="ACKO"
                width={36}
                height={36}
                className={styles.logo}
                unoptimized
              />
            </div>
          </div>

          {!isActive ? (
            <div className={styles.priceBlock}>
              <div className={styles.brandCopy}>
                <p className={styles.priceRow}>
                  <span className={styles.price}>{formatInr(INSURANCE_PREMIUM_INR)}</span>
                  <span className={styles.compareAt}>
                    {formatInr(INSURANCE_COMPARE_AT_PREMIUM_INR)}
                  </span>
                </p>
                <p className={styles.savings}>You save {formatInr(savingsInr)}</p>
              </div>
            </div>
          ) : null}
        </div>

        <div className={styles.body}>
          <div className={styles.idvPanel}>
            <p className={styles.idvEyebrow}>{INSURANCE_COVER_HERO.eyebrow}</p>
            <p className={styles.idvValue}>{INSURANCE_COVER_HERO.value}</p>
            <p className={styles.idvCaption}>{INSURANCE_COVER_HERO.caption}</p>
          </div>

          <ul className={styles.highlights}>
            {INSURANCE_CARD_HIGHLIGHTS.map((row) => (
              <li key={row.title} className={styles.highlightRow}>
                <span className={styles.checkIcon} aria-hidden>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M5.5 12.5l4 4 9-9.5"
                      stroke="currentColor"
                      strokeWidth="2.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <div className={styles.highlightCopy}>
                  <p className={styles.highlightTitle}>{row.title}</p>
                  <p className={styles.highlightDetail}>{row.detail}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className={isActive ? styles.footerActive : styles.footer}>
          {isActive ? (
            <div className={styles.policyIdentity}>
              <p className={styles.policyNumber}>{INSURANCE_POLICY_NUMBER}</p>
              <p className={styles.policyMeta}>
                {`Active from today · Zero Dep ${odYears} yr${odYears > 1 ? "s" : ""} · Third Party ${tpYears} yrs`}
              </p>
            </div>
          ) : null}
          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            className={["tertiary-cta", styles.footerCta].filter(Boolean).join(" ")}
          >
            {isActive ? "View policy" : "See detailed coverage"}
            <span className={styles.footerArrow} style={FOOTER_ARROW_MASK_STYLE} aria-hidden />
          </button>
        </div>
      </section>

      <InsuranceCoverageBottomSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        mode={mode === "active" ? "owned" : "purchase"}
        tenure={tenure}
      />
    </>
  );
}
