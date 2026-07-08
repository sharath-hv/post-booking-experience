"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import shiviAvatar from "@/assets/Shivi small.png";
import {
  INSURANCE_CLAIMS_LINE,
  INSURANCE_COVERAGE_ITEMS,
  INSURANCE_COVERAGE_SHEET_TITLE,
  INSURANCE_COVER_HERO,
  INSURANCE_INCLUDED_ADDONS,
  INSURANCE_OWNED_SHEET_TITLE,
  INSURANCE_OWNED_SHIVI_LINE,
  INSURANCE_POLICY_FACTS,
  INSURANCE_PRICE_PROMISE,
  INSURANCE_SHEET_SHIVI_LINE,
  INSURANCE_VALUE_POINTS,
  INSURANCE_VALUE_TITLE,
  type InsuranceCoverageItem,
} from "@/components/payment/insurance-coverage-content";
import { BottomSheetCloseIcon } from "@/components/ui/BottomSheetCloseIcon";
import { BottomSheetPortal } from "@/components/ui/BottomSheetPortal";
import {
  BOTTOM_SHEET_BODY_BEFORE_CTA_CLASS,
  BOTTOM_SHEET_CTA_STRIP_TOP_CLASS,
  BOTTOM_SHEET_MAX_HEIGHT_CLASS,
  BOTTOM_SHEET_OVERLAY_Z_CLASS,
} from "@/components/ui/bottom-sheet-layout";

/** Enter/exit slide duration — keep in sync with `LoanSubmitConfirmBottomSheet` */
const SHEET_TRANSITION_MS = 280;

function CoverageDetailRow({ iconSrc, durationLabel, planTitle, description }: InsuranceCoverageItem) {
  return (
    <div className="flex gap-3">
      <div className="relative size-16 shrink-0" aria-hidden>
        <Image
          src={iconSrc}
          alt=""
          width={64}
          height={64}
          className="size-16 object-contain"
          unoptimized
          sizes="64px"
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[#121212]">
          <span className="text-base font-semibold leading-[22px]">{durationLabel}</span>
          <span className="text-sm font-medium leading-5">{planTitle}</span>
        </p>
        <p className="mt-2 text-xs font-normal leading-[18px] text-[#4b4b4b]">{description}</p>
      </div>
    </div>
  );
}

function ShiviLine({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-[#f5f5f5]">
        <Image src={shiviAvatar} alt="" fill className="object-cover" unoptimized sizes="36px" />
      </span>
      <p className="min-w-0 text-sm leading-5 text-[#121212]">{text}</p>
    </div>
  );
}

/** The one headline number — the write-off payout — with its reason attached. */
function CoverHeroBand() {
  return (
    <div className="mt-4 rounded-2xl border border-[#eceaf4] px-4 py-4 [background:radial-gradient(130%_140%_at_0%_0%,#efe8fc_0%,rgba(239,232,252,0)_65%),radial-gradient(110%_120%_at_100%_0%,#fdeff3_0%,rgba(253,239,243,0)_55%)]">
      <p className="text-[10px] font-semibold uppercase leading-4 tracking-[0.09em] text-[#9a92ad]">
        {INSURANCE_COVER_HERO.eyebrow}
      </p>
      <p className="mt-1 w-fit bg-[linear-gradient(105deg,#251c40_0%,#5920c5_100%)] bg-clip-text text-[26px] font-semibold leading-8 tracking-[-0.4px] text-transparent tabular-nums">
        {INSURANCE_COVER_HERO.value}
      </p>
      <p className="mt-1.5 text-xs leading-[18px] text-[#6f697e]">{INSURANCE_COVER_HERO.caption}</p>
    </div>
  );
}

function SectionHeading({ children }: { children: string }) {
  return <p className="mt-5 text-sm font-semibold leading-5 text-[#121212]">{children}</p>;
}

function CoversAndAddons() {
  return (
    <>
      {/* Base covers */}
      <div className="mt-4 flex flex-col gap-5 rounded-xl bg-[#f5f5f5] p-5">
        {INSURANCE_COVERAGE_ITEMS.map((item) => (
          <CoverageDetailRow key={item.planTitle} {...item} />
        ))}
      </div>

      {/* Add-ons included at no extra charge */}
      <SectionHeading>Included — usually sold as paid extras</SectionHeading>
      <div className="mt-2 flex flex-col rounded-xl border border-[#e8e8e8] bg-white px-4 py-1">
        {INSURANCE_INCLUDED_ADDONS.map((addon, idx) => (
          <div
            key={addon.title}
            className={`flex items-start gap-2.5 py-3 ${
              idx > 0 ? "border-t border-dashed border-[#efefef]" : ""
            }`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden className="mt-0.5 shrink-0">
              <circle cx="12" cy="12" r="9" fill="#0fa457" />
              <path
                d="M8.4 12.2l2.4 2.4 4.8-5"
                stroke="#ffffff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="min-w-0">
              <p className="text-sm font-medium leading-5 text-[#121212]">{addon.title}</p>
              <p className="text-xs leading-[18px] text-[#757575]">{addon.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export type InsuranceCoverageBottomSheetProps = {
  open: boolean;
  onClose: () => void;
  /**
   * `purchase` — pre-payment: the policy argues its own price, ending on the
   * refund promise. `owned` — post-payment: policy facts and claims, no selling.
   */
  mode?: "purchase" | "owned";
};

/**
 * ACKO Drive Shield explainer. The value story is intrinsic — IDV, payout,
 * add-ons — with no “compare us to the website” table; the cover speaks for
 * itself, and one quiet promise line retires the price-check impulse.
 */
export function InsuranceCoverageBottomSheet({
  open,
  onClose,
  mode = "purchase",
}: InsuranceCoverageBottomSheetProps) {
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
          className={`absolute bottom-0 left-1/2 z-10 flex ${BOTTOM_SHEET_MAX_HEIGHT_CLASS} w-full max-w-[640px] -translate-x-1/2 flex-col overflow-hidden rounded-t-[24px] bg-white sheet-elevated transition-transform duration-[280ms] ease-out motion-reduce:translate-y-0 motion-reduce:transition-none ${
            animateIn ? "translate-y-0" : "translate-y-full"
          }`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="insurance-coverage-sheet-title"
        >
          <div className="relative flex min-h-0 flex-1 flex-col">
            <header className="relative z-10 flex shrink-0 items-start justify-between gap-3 bg-white px-5 pb-2 pt-6">
              <h2
                id="insurance-coverage-sheet-title"
                className="min-w-0 flex-1 text-left text-xl font-semibold leading-7 tracking-[-0.1px] text-[#121212]"
              >
                {owned ? INSURANCE_OWNED_SHEET_TITLE : INSURANCE_COVERAGE_SHEET_TITLE}
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="cta-ghost -mr-1 -mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-lg text-[#121212] focus-visible:outline focus-visible:ring-2 focus-visible:ring-[#121212]/20 focus-visible:ring-offset-2"
                aria-label="Close"
              >
                <BottomSheetCloseIcon />
              </button>
              {/* Scrolled content dissolves under the header instead of clipping at a hard edge. */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-full h-6 bg-[linear-gradient(to_bottom,#ffffff,rgba(255,255,255,0))]"
              />
            </header>

            <div
              className={`min-h-0 flex-1 overflow-y-auto px-5 pt-6 ${BOTTOM_SHEET_BODY_BEFORE_CTA_CLASS}`}
            >
              <ShiviLine text={owned ? INSURANCE_OWNED_SHIVI_LINE : INSURANCE_SHEET_SHIVI_LINE} />

              {owned ? (
                <div className="mt-4 overflow-hidden rounded-xl border border-[#e8e8e8]">
                  {INSURANCE_POLICY_FACTS.map((fact, idx) => (
                    <div
                      key={fact.label}
                      className={`flex items-center justify-between gap-3 bg-white px-4 py-3 ${
                        idx > 0 ? "border-t border-[#f0f0f0]" : ""
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

              <CoversAndAddons />

              {owned ? (
                /* Claims, not selling — the policy is already theirs */
                <div className="mt-5 rounded-xl bg-[#f9f6ff] px-4 py-3">
                  <p className="text-xs font-medium leading-[18px] text-[#5920c5]">
                    {INSURANCE_CLAIMS_LINE}
                  </p>
                </div>
              ) : (
                <>
                  {/* The price argues for itself — no other-tab comparison table */}
                  <SectionHeading>{INSURANCE_VALUE_TITLE}</SectionHeading>
                  <div className="mt-2 flex flex-col gap-3">
                    {INSURANCE_VALUE_POINTS.map((point) => (
                      <div key={point.title} className="rounded-xl border border-[#ececec] bg-white px-4 py-3">
                        <p className="text-sm font-medium leading-5 text-[#121212]">{point.title}</p>
                        <p className="mt-1 text-xs leading-[18px] text-[#4b4b4b]">{point.detail}</p>
                      </div>
                    ))}
                  </div>

                  {/* Her price promise */}
                  <div className="mt-3 rounded-xl bg-[#e7f6ee] px-4 py-3">
                    <p className="text-xs font-medium leading-[18px] text-[#0c7a42]">
                      {INSURANCE_PRICE_PROMISE}
                    </p>
                  </div>
                </>
              )}
            </div>

            <div
              className={`relative shrink-0 bg-white px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] ${BOTTOM_SHEET_CTA_STRIP_TOP_CLASS}`}
            >
              {/* Same dissolve above the CTA strip — no hard edge at the bottom either. */}
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
