"use client";

import Image from "next/image";
import { useState } from "react";

import ackoLogo from "@/assets/ACKO logo.svg";
import { InsuranceCoverageBottomSheet } from "@/components/payment/InsuranceCoverageBottomSheet";
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
      className="pointer-events-none absolute -right-8 -top-7 h-48 w-48 rotate-[14deg] text-[#5920c5]/[0.05] [mask-image:linear-gradient(to_left,black_30%,rgba(0,0,0,0)_85%)]"
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
 * ACKO Drive Shield, in the app's own light — soft lavender-and-blush washes
 * that fade to white (explicit same-hue rgba endpoints; see the Safari
 * gradient rule), gradient-ink hero numeral, hairline dividers. One headline
 * number — the write-off payout — because IDV and RTI side by side read as a
 * contradiction; IDV gets its own explained row below. Same component for
 * both moments so the card “becomes yours” after payment.
 */
export function ShieldPolicyCard({ mode, tenure = "1+3" }: ShieldPolicyCardProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const isActive = mode === "active";
  const tenureOption = INSURANCE_TENURE_OPTIONS.find((o) => o.id === tenure) ?? INSURANCE_TENURE_OPTIONS[0];
  const odYears = tenureOption.ownDamageYears;
  const tpYears = tenureOption.thirdPartyYears;

  return (
    <>
      <section
        className="overflow-hidden rounded-[20px] border border-[#eceaf4] bg-white card-elevated text-left"
        aria-label={isActive ? "Your active car insurance policy" : "Car insurance coverage"}
      >
        {/* Brand header — soft aurora wash */}
        <div className="relative overflow-hidden px-5 pb-5 pt-5 [background:radial-gradient(130%_130%_at_0%_0%,#efe8fc_0%,rgba(239,232,252,0)_62%),radial-gradient(110%_110%_at_100%_0%,#fdeff3_0%,rgba(253,239,243,0)_55%)]">
          <ShieldWatermark />

          <div className="relative flex items-start justify-between gap-3">
            <div className="min-w-0">
              {isActive ? (
                <span className="mb-1.5 inline-flex items-center gap-1.5 rounded-full bg-[#e9f7ef] px-2.5 py-1 text-[10px] font-semibold uppercase leading-3 tracking-[0.06em] text-[#0c7a42]">
                  <span className="relative flex h-1.5 w-1.5" aria-hidden>
                    <span className="absolute inset-0 animate-ping rounded-full bg-[#0fa457]/50 [animation-duration:2.4s] motion-reduce:hidden" />
                    <span className="relative h-1.5 w-1.5 rounded-full bg-[#0fa457]" />
                  </span>
                  Active
                </span>
              ) : null}
              <p className="truncate text-base font-semibold leading-6 tracking-[-0.1px] text-[#18141f]">
                ACKO Drive Shield
              </p>
              <p className="mt-1 text-xs leading-4 text-[#4b4b4b]">
                {isActive
                  ? `${odYears} year Zero depreciation cover for your Creta`
                  : "Built for your new Creta"}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Image
                src={ackoLogo}
                alt="ACKO"
                width={40}
                height={40}
                className="size-10 shrink-0 object-contain"
                unoptimized
              />
            </div>
          </div>

          {/* Price (quote) / policy identity (active) */}
          <div className="relative mt-6">
            {isActive ? (
              <div className="min-w-0">
                <p className="text-sm font-medium leading-5 text-[#1c1727] tabular-nums">
                  {INSURANCE_POLICY_NUMBER}
                </p>
                <p className="mt-0.5 text-xs leading-4 text-[#757575]">
                  {`Active from today · Zero Dep ${odYears} yr${odYears > 1 ? "s" : ""} · Third Party ${tpYears} yrs`}
                </p>
              </div>
            ) : (
              <div className="min-w-0">
                <p className="flex flex-wrap items-baseline gap-x-2">
                  <span className="text-xl font-semibold leading-7 text-[#18141f] tabular-nums">
                    {formatInr(INSURANCE_PREMIUM_INR)}
                  </span>
                  <span className="text-sm leading-5 text-text-secondary line-through tabular-nums">
                    {formatInr(INSURANCE_COMPARE_AT_PREMIUM_INR)}
                  </span>
                </p>
                <p className="mt-0.5 text-xs font-medium leading-4 text-[#0c7a42]">
                  You save {formatInr(INSURANCE_COMPARE_AT_PREMIUM_INR - INSURANCE_PREMIUM_INR)}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-[#f1eef8]" aria-hidden />

        {/* IDV — explained on its own, below price */}
        <div className="px-5 pb-2 pt-5">
          <p className="text-[10px] font-medium uppercase leading-4 tracking-[0.09em] text-brand">
            {INSURANCE_COVER_HERO.eyebrow}
          </p>
          <p className="mt-1 w-fit bg-[linear-gradient(105deg,#251c40_0%,#5920c5_100%)] bg-clip-text text-[28px] font-semibold leading-10 tracking-[-0.5px] text-transparent tabular-nums">
            {INSURANCE_COVER_HERO.value}
          </p>
          <p className="mt-1.5 text-xs leading-4 text-[#757575]">
            {INSURANCE_COVER_HERO.caption}
          </p>
        </div>

        {/* Coverage highlights — each number arrives with its meaning */}
        <div className="flex flex-col px-5 pb-2">
          {INSURANCE_CARD_HIGHLIGHTS.map((row, idx) => (
            <div
              key={row.title}
              className={`flex items-start gap-3 py-2.5 ${
                idx > 0 ? "border-t border-[#f6f4fa]" : ""
              }`}
            >
              <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-[#f3effc]">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M5.5 12.5l4 4 9-9.5"
                    stroke="#5920c5"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <div className="min-w-0">
                <p className="text-sm font-medium leading-5 text-[#1c1727]">{row.title}</p>
                <p className="mt-0.5 text-xs leading-4 text-[#757575]">{row.detail}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="px-5 pb-4 pt-1">
          <button type="button" onClick={() => setSheetOpen(true)} className="tertiary-cta">
            {isActive ? "View policy" : "What's covered"}
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
