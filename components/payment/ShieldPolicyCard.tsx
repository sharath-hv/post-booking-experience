"use client";

import Image from "next/image";
import { useCallback, useMemo, useState } from "react";

import ackoLogo from "@/assets/ACKO logo.svg";
import { InsuranceCoverageBottomSheet } from "@/components/payment/InsuranceCoverageBottomSheet";
import {
  INSURANCE_CARD_HIGHLIGHTS,
  INSURANCE_COVER_HERO,
  INSURANCE_BASE_PREMIUM_INR,
  INSURANCE_OPTIONAL_ADDONS,
  INSURANCE_POLICY_NUMBER,
  INSURANCE_TENURE_OPTIONS,
  type InsuranceAddonId,
  type InsuranceTenureId,
} from "@/components/payment/insurance-coverage-content";
import styles from "./ShieldPolicyCard.module.scss";

/** Stub download — replace with a real policy PDF URL when available. */
function triggerDemoPolicyDownload() {
  const blob = new Blob(
    [`ACKO Drive Shield policy (demo)\nPolicy number: ${INSURANCE_POLICY_NUMBER}\n`],
    { type: "text/plain;charset=utf-8" },
  );
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "acko-drive-shield-policy-demo.txt";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function formatInr(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.max(0, Math.round(amount)));
}

export type ShieldPolicyCardProps = {
  /** `quote` — before the premium is paid. `active` — the owned policy. */
  mode: "quote" | "active";
  /** Selected tenure — determines cover durations shown in active mode. Defaults to `"1+3"`. */
  tenure?: InsuranceTenureId;
  /** Live quote premium (base + selected add-ons). Defaults to base Shield. */
  premiumInr?: number;
  /** Optional add-ons on this quote / policy — drives subtitle + coverage sheet. */
  selectedAddonIds?: readonly InsuranceAddonId[];
};

/**
 * ACKO Drive Shield — premium leads as the hero number; IDV sits in a quiet
 * fact panel; coverage rows stay scannable. Same facts for quote and active
 * so the card “becomes yours” after payment.
 */
export function ShieldPolicyCard({
  mode,
  tenure = "1+3",
  premiumInr = INSURANCE_BASE_PREMIUM_INR,
  selectedAddonIds = [],
}: ShieldPolicyCardProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const isActive = mode === "active";
  const tenureOption = INSURANCE_TENURE_OPTIONS.find((o) => o.id === tenure) ?? INSURANCE_TENURE_OPTIONS[0];
  const odYears = tenureOption.ownDamageYears;
  const selectedAddonCount = selectedAddonIds.length;
  const quoteSubtitle =
    selectedAddonCount > 0
      ? `Built for your new Creta · ${selectedAddonCount} add-on${selectedAddonCount === 1 ? "" : "s"}`
      : "Built for your new Creta";
  const activeSubtitle = `${odYears} year Zero depreciation cover for your Creta`;

  const highlightRows = useMemo(() => {
    const selected = new Set(selectedAddonIds);
    const addonRows = INSURANCE_OPTIONAL_ADDONS.filter((addon) => selected.has(addon.id)).map(
      (addon) => ({
        title: addon.title,
        detail: addon.detail,
      }),
    );
    return [...INSURANCE_CARD_HIGHLIGHTS, ...addonRows];
  }, [selectedAddonIds]);

  const onDownloadPolicy = useCallback(() => {
    triggerDemoPolicyDownload();
  }, []);

  const idvPanel = (
    <div className={styles.idvPanel}>
      <p className={styles.idvEyebrow}>{INSURANCE_COVER_HERO.eyebrow}</p>
      <p className={styles.idvValue}>{INSURANCE_COVER_HERO.value}</p>
      <p className={styles.idvCaption}>{INSURANCE_COVER_HERO.caption}</p>
    </div>
  );

  return (
    <>
      <section
        className={[styles.card, "card-elevated"].filter(Boolean).join(" ")}
        aria-label={isActive ? "Your active car insurance policy" : "Car insurance coverage"}
      >
        <div className={styles.header}>
          <div className={styles.logoWrap}>
            <Image
              src={ackoLogo}
              alt="ACKO"
              width={40}
              height={40}
              className={styles.logo}
              unoptimized
            />
          </div>

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
              {isActive ? activeSubtitle : quoteSubtitle}
            </p>
          </div>

          {!isActive ? (
            <div className={styles.priceBlock}>
              <p className={styles.price}>{formatInr(premiumInr)}</p>
            </div>
          ) : null}
        </div>

        <div className={styles.body}>
          {isActive ? idvPanel : null}

          <ul className={styles.highlights}>
            {highlightRows.map((row) => (
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

          {!isActive ? idvPanel : null}
        </div>

        <div className={styles.footerActive}>
          {isActive ? (
            <div className={styles.policyMeta}>
              <div className={styles.policyIdentity}>
                <p className={styles.policyLabel}>Policy number</p>
                <p className={styles.policyValue}>{INSURANCE_POLICY_NUMBER}</p>
              </div>
              <button
                type="button"
                onClick={onDownloadPolicy}
                className={["tertiary-cta", styles.footerCta].filter(Boolean).join(" ")}
              >
                Download policy
              </button>
            </div>
          ) : (
            <p className={styles.footerQuote}>
              <span className={styles.footerContext}>Curious what's covered?</span>
              <button
                type="button"
                onClick={() => setSheetOpen(true)}
                className={["tertiary-cta", styles.footerCtaLeft].filter(Boolean).join(" ")}
              >
                See coverage
              </button>
            </p>
          )}
        </div>
      </section>

      <InsuranceCoverageBottomSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        mode={mode === "active" ? "owned" : "purchase"}
        tenure={tenure}
        selectedAddonIds={selectedAddonIds}
      />
    </>
  );
}
