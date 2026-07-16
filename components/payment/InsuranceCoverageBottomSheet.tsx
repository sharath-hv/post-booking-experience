"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import shiviAvatar from "@/assets/Shivi small.png";
import {
  INSURANCE_CLAIMS_LINE,
  INSURANCE_COVERAGE_ITEMS,
  INSURANCE_COVERAGE_SHEET_SUBTITLE,
  INSURANCE_COVERAGE_SHEET_TITLE,
  INSURANCE_COVER_HERO,
  INSURANCE_OWNED_SHEET_SUBTITLE,
  INSURANCE_OWNED_SHEET_TITLE,
  INSURANCE_POLICY_FACTS,
  INSURANCE_TENURE_OPTIONS,
  type InsuranceCoverageItem,
  type InsuranceTenureId,
} from "@/components/payment/insurance-coverage-content";
import { BottomSheetCloseIcon } from "@/components/ui/BottomSheetCloseIcon";
import { BottomSheetPortal } from "@/components/ui/BottomSheetPortal";
import { ShimmerInfoCard } from "@/components/ui/ShimmerInfoCard";
import {
  BOTTOM_SHEET_BODY_BEFORE_CTA_CLASS,
  BOTTOM_SHEET_CTA_STRIP_TOP_CLASS,
  BOTTOM_SHEET_MAX_HEIGHT_CLASS,
  BOTTOM_SHEET_OVERLAY_Z_CLASS,
} from "@/components/ui/bottom-sheet-layout";

/** Enter/exit slide duration — keep in sync with `LoanSubmitConfirmBottomSheet` */
const SHEET_TRANSITION_MS = 280;

function CoverageDetailRow({ iconSrc, title, description }: InsuranceCoverageItem) {
  return (
    <div className="flex gap-3">
      <div className="relative size-14 shrink-0" aria-hidden>
        <Image
          src={iconSrc}
          alt=""
          width={56}
          height={56}
          className="size-14 object-contain"
          unoptimized
          sizes="56px"
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium leading-5 text-[#121212]">{title}</p>
        <p className="mt-2 text-xs font-normal leading-[18px] text-[#4b4b4b]">{description}</p>
      </div>
    </div>
  );
}

/** Shivi's framing below the sheet title — avatar + one-line copy. */
function ShiviLine({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="relative mt-0.5 h-9 w-9 shrink-0 overflow-hidden rounded-full bg-[#f5f5f5]">
        <Image src={shiviAvatar} alt="" fill className="object-cover" unoptimized sizes="36px" />
      </span>
      <p className="min-w-0 text-sm leading-5 text-[#4b4b4b]">{text}</p>
    </div>
  );
}

/** The one headline number — IDV with aurora wash and gradient value. */
function CoverHeroBand() {
  return (
    <div className="rounded-2xl border border-[#eceaf4] px-4 py-4 [background:radial-gradient(130%_140%_at_0%_0%,#efe8fc_0%,rgba(239,232,252,0)_65%),radial-gradient(110%_120%_at_100%_0%,#fdeff3_0%,rgba(253,239,243,0)_55%)]">
      <p className="text-[10px] font-medium uppercase leading-4 tracking-[0.09em] text-[#9a92ad]">
        {INSURANCE_COVER_HERO.eyebrow}
      </p>
      <p className="mt-1 w-fit bg-[linear-gradient(105deg,#251c40_0%,#5920c5_100%)] bg-clip-text text-[26px] font-semibold leading-8 tracking-[-0.4px] text-transparent tabular-nums">
        {INSURANCE_COVER_HERO.value}
      </p>
      <p className="mt-1.5 text-xs leading-[18px] text-[#6f697e]">{INSURANCE_COVER_HERO.caption}</p>
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
 * ACKO Drive Shield coverage bottom sheet — IDV card plus four illustrated
 * cover rows, aligned to the 3+3 insurance upsell Figma (node 315:3152).
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
      return { ...fact, value: `${tenureOption.ownDamageYears} year${tenureOption.ownDamageYears > 1 ? "s" : ""}` };
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
      <div className={`fixed inset-0 ${BOTTOM_SHEET_OVERLAY_Z_CLASS}`}>
        <button
          type="button"
          className={`absolute inset-0 bg-black/90 transition-opacity duration-[280ms] ease-out motion-reduce:opacity-100 motion-reduce:transition-none ${
            animateIn ? "opacity-100" : "opacity-0"
          }`}
          onClick={onBackdropClick}
          aria-label="Dismiss"
        />
        <div
          className={`absolute bottom-0 left-1/2 z-10 flex ${BOTTOM_SHEET_MAX_HEIGHT_CLASS} w-full max-w-[640px] -translate-x-1/2 flex-col overflow-hidden rounded-t-[20px] bg-white sheet-elevated transition-transform duration-[280ms] ease-out motion-reduce:translate-y-0 motion-reduce:transition-none ${
            animateIn ? "translate-y-0" : "translate-y-full"
          }`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="insurance-coverage-sheet-title"
        >
          <div className="relative flex min-h-0 flex-1 flex-col">
            <header className="relative z-10 flex shrink-0 flex-col gap-4 bg-white px-5 pb-0 pt-6">
              <div className="flex items-start justify-between gap-4">
                <h2
                  id="insurance-coverage-sheet-title"
                  className="min-w-0 flex-1 text-left text-xl font-semibold leading-7 tracking-[-0.1px] text-[#121212]"
                >
                  {owned ? INSURANCE_OWNED_SHEET_TITLE : INSURANCE_COVERAGE_SHEET_TITLE}
                </h2>
                <button
                  type="button"
                  onClick={onClose}
                  className="cta-ghost -mr-1 -mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-lg text-[#121212] focus-visible:outline focus-visible:ring-2 focus-visible:ring-[#121212]/20 focus-visible:ring-offset-2"
                  aria-label="Close"
                >
                  <BottomSheetCloseIcon />
                </button>
              </div>
              <ShiviLine
                text={owned ? INSURANCE_OWNED_SHEET_SUBTITLE : INSURANCE_COVERAGE_SHEET_SUBTITLE}
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-full h-6 bg-[linear-gradient(to_bottom,#ffffff,rgba(255,255,255,0))]"
              />
            </header>

            <div
              className={`min-h-0 flex-1 overflow-y-auto px-5 pt-6 ${BOTTOM_SHEET_BODY_BEFORE_CTA_CLASS}`}
            >
              <div className="flex flex-col gap-8">
                {owned ? (
                  <div className="overflow-hidden rounded-xl border border-[#e8e8e8]">
                    {policyFacts.map((fact, idx) => (
                      <div
                        key={fact.label}
                        className={`flex items-center justify-between gap-3 bg-white px-4 py-3 ${
                          idx > 0 ? "border-t border-[#e8e8e8]" : ""
                        }`}
                      >
                        <p className="text-sm leading-5 text-[#4b4b4b]">{fact.label}</p>
                        <p className="shrink-0 text-sm font-medium leading-5 text-[#121212] tabular-nums">
                          {fact.value}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : null}

                <CoverHeroBand />

                <div className="flex flex-col gap-5">
                  {INSURANCE_COVERAGE_ITEMS.map((item) => (
                    <CoverageDetailRow key={item.title} {...item} />
                  ))}
                </div>

                {owned ? (
                  <ShimmerInfoCard icon="info">
                    {INSURANCE_CLAIMS_LINE}
                  </ShimmerInfoCard>
                ) : null}
              </div>
            </div>

            <div
              className={`relative shrink-0 bg-white px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] ${BOTTOM_SHEET_CTA_STRIP_TOP_CLASS}`}
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-full h-6 bg-[linear-gradient(to_top,#ffffff,rgba(255,255,255,0))]"
              />
              <button type="button" onClick={onClose} className="primary-cta w-full">
                {owned ? "Got it" : "Okay"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </BottomSheetPortal>
  );
}
