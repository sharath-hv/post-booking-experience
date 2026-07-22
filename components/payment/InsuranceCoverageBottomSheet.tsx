"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  INSURANCE_CLAIMS_LINE,
  INSURANCE_COVERAGE_ITEMS,
  INSURANCE_COVERAGE_SHEET_TITLE,
  INSURANCE_COVER_HERO,
  INSURANCE_OWNED_SHEET_TITLE,
  INSURANCE_POLICY_FACTS,
  INSURANCE_TENURE_OPTIONS,
  type InsuranceCoverageItem,
  type InsuranceTenureId,
} from "@/components/payment/insurance-coverage-content";
import { BottomSheetCloseIcon } from "@/components/ui/BottomSheetCloseIcon";
import { BottomSheetPortal } from "@/components/ui/BottomSheetPortal";
import {
  BOTTOM_SHEET_BODY_BEFORE_CTA_CLASS,
  BOTTOM_SHEET_CTA_STRIP_TOP_CLASS,
  BOTTOM_SHEET_MAX_HEIGHT_CLASS,
  BOTTOM_SHEET_OVERLAY_Z_CLASS,
} from "@/components/ui/bottom-sheet-layout";
import { ShimmerInfoCard } from "@/components/ui/ShimmerInfoCard";
import { cn } from "@/lib/utils";
import styles from "./InsuranceCoverageBottomSheet.module.scss";

/** Enter/exit slide duration — keep in sync with `LoanSubmitConfirmBottomSheet` */
const SHEET_TRANSITION_MS = 280;

function CoverageDetailRow({ iconSrc, title, description }: InsuranceCoverageItem) {
  return (
    <li className={styles.coverageRow}>
      <span className={styles.coverageIcon} aria-hidden>
        <Image
          src={iconSrc}
          alt=""
          width={48}
          height={48}
          className={styles.coverageIconAsset}
          unoptimized
        />
      </span>
      <div className={styles.coverageCopy}>
        <p className={styles.coverageTitle}>{title}</p>
        <p className={styles.coverageDetail}>{description}</p>
      </div>
    </li>
  );
}

/** IDV fact panel — same hierarchy as ShieldPolicyCard. */
function CoverHeroBand() {
  return (
    <div className={styles.idvPanel}>
      <p className={styles.idvEyebrow}>{INSURANCE_COVER_HERO.eyebrow}</p>
      <p className={styles.idvValue}>{INSURANCE_COVER_HERO.value}</p>
      <p className={styles.idvCaption}>{INSURANCE_COVER_HERO.caption}</p>
    </div>
  );
}

export type InsuranceCoverageBottomSheetProps = {
  open: boolean;
  onClose: () => void;
  /**
   * `purchase` — pre-payment coverage explainer.
   * `owned` — post-payment: policy facts and claims, no selling.
   */
  mode?: "purchase" | "owned";
  /** Selected tenure — used in owned mode to show correct cover durations. Defaults to `"1+3"`. */
  tenure?: InsuranceTenureId;
};

/**
 * ACKO Drive Shield coverage sheet — calmer header, IDV fact panel, and
 * scannable cover rows. Same facts for purchase and owned modes.
 */
export function InsuranceCoverageBottomSheet({
  open,
  onClose,
  mode = "purchase",
  tenure = "1+3",
}: InsuranceCoverageBottomSheetProps) {
  const tenureOption = INSURANCE_TENURE_OPTIONS.find((o) => o.id === tenure) ?? INSURANCE_TENURE_OPTIONS[0];
  const policyFacts = INSURANCE_POLICY_FACTS.map((fact) => {
    if (fact.label === "Zero depreciation") {
      return {
        ...fact,
        value: `${tenureOption.ownDamageYears} year${tenureOption.ownDamageYears > 1 ? "s" : ""}`,
      };
    }
    if (fact.label === "Third-party cover") {
      return { ...fact, value: `${tenureOption.thirdPartyYears} years` };
    }
    return fact;
  });
  const [mounted, setMounted] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const exitTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const owned = mode === "owned";

  useEffect(() => {
    if (!open) return;
    if (exitTimeoutRef.current) {
      clearTimeout(exitTimeoutRef.current);
      exitTimeoutRef.current = null;
    }
    setMounted(true);
    setAnimateIn(false);
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setAnimateIn(true));
    });
    return () => cancelAnimationFrame(id);
  }, [open]);

  useEffect(() => {
    if (open || !mounted) return;
    setAnimateIn(false);
    exitTimeoutRef.current = setTimeout(() => {
      exitTimeoutRef.current = null;
      setMounted(false);
    }, SHEET_TRANSITION_MS);
    return () => {
      if (exitTimeoutRef.current) {
        clearTimeout(exitTimeoutRef.current);
        exitTimeoutRef.current = null;
      }
    };
  }, [open, mounted]);

  useEffect(() => {
    if (!mounted) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mounted]);

  const onBackdropClick = useCallback(() => {
    onClose();
  }, [onClose]);

  if (!mounted) return null;

  return (
    <BottomSheetPortal>
      <div className={cn(styles.overlay, BOTTOM_SHEET_OVERLAY_Z_CLASS)}>
        <button
          type="button"
          className={cn(styles.scrim, animateIn ? styles.scrimVisible : styles.scrimHidden)}
          onClick={onBackdropClick}
          aria-label="Dismiss"
        />
        <div
          className={cn(
            styles.panel,
            BOTTOM_SHEET_MAX_HEIGHT_CLASS,
            "sheet-elevated",
            animateIn ? styles.panelShown : styles.panelHidden
          )}
          role="dialog"
          aria-modal="true"
          aria-labelledby="insurance-coverage-sheet-title"
        >
          <div className={styles.panelInner}>
            <header className={styles.header}>
              <div className={styles.titleRow}>
                <h2 id="insurance-coverage-sheet-title" className={styles.title}>
                  {owned ? INSURANCE_OWNED_SHEET_TITLE : INSURANCE_COVERAGE_SHEET_TITLE}
                </h2>
                <button
                  type="button"
                  onClick={onClose}
                  className={cn(styles.closeBtn, "cta-ghost")}
                  aria-label="Close"
                >
                  <BottomSheetCloseIcon />
                </button>
              </div>
              <div aria-hidden className={styles.headerFade} />
            </header>

            <div className={cn(styles.body, BOTTOM_SHEET_BODY_BEFORE_CTA_CLASS)}>
              <div className={styles.content}>
                {owned ? (
                  <div className={styles.factsCard}>
                    {policyFacts.map((fact, idx) => (
                      <div
                        key={fact.label}
                        className={cn(styles.factRow, idx > 0 && styles.factRowDivider)}
                      >
                        <p className={styles.factLabel}>{fact.label}</p>
                        <p className={styles.factValue}>{fact.value}</p>
                      </div>
                    ))}
                  </div>
                ) : null}

                <CoverHeroBand />

                <ul className={styles.coverageList}>
                  {INSURANCE_COVERAGE_ITEMS.map((item) => (
                    <CoverageDetailRow key={item.title} {...item} />
                  ))}
                </ul>

                {owned ? <ShimmerInfoCard icon="info">{INSURANCE_CLAIMS_LINE}</ShimmerInfoCard> : null}
              </div>
            </div>

            <div className={cn(styles.footer, BOTTOM_SHEET_CTA_STRIP_TOP_CLASS)}>
              <div aria-hidden className={styles.footerFade} />
              <button
                type="button"
                onClick={onClose}
                className={cn(styles.confirmCta, "primary-cta")}
              >
                {owned ? "Got it" : "Okay"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </BottomSheetPortal>
  );
}
