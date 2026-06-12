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
};

/**
 * ACKO Drive Shield, in the app's own light — soft lavender-and-blush washes
 * that fade to white (explicit same-hue rgba endpoints; see the Safari
 * gradient rule), gradient-ink hero numeral, hairline dividers. One headline
 * number — the write-off payout — because IDV and RTI side by side read as a
 * contradiction; IDV gets its own explained row below. Same component for
 * both moments so the card “becomes yours” after payment.
 */
export function ShieldPolicyCard({ mode }: ShieldPolicyCardProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const isActive = mode === "active";

  return (
    <>
      <section
        className="overflow-hidden rounded-[20px] border border-[#eceaf4] bg-white card-elevated text-left"
        aria-label={isActive ? "Your active car insurance policy" : "Car insurance coverage"}
      >
        {/* Hero — soft aurora wash, brand whisper, one number */}
        <div className="relative overflow-hidden px-5 pb-6 pt-5 [background:radial-gradient(130%_130%_at_0%_0%,#efe8fc_0%,rgba(239,232,252,0)_62%),radial-gradient(110%_110%_at_100%_0%,#fdeff3_0%,rgba(253,239,243,0)_55%)]">
          <ShieldWatermark />

          <div className="relative flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2">
              <Image
                src={ackoLogo}
                alt=""
                width={18}
                height={18}
                className="size-[18px] shrink-0 object-contain"
                unoptimized
              />
              <p className="truncate text-sm font-semibold leading-5 tracking-[-0.1px] text-[#18141f]">
                ACKO Drive Shield
              </p>
            </div>
            {isActive ? (
              <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-[#e9f7ef] px-2.5 py-1 text-[10px] font-semibold uppercase leading-3 tracking-[0.06em] text-[#0c7a42]">
                <span className="relative flex h-1.5 w-1.5" aria-hidden>
                  <span className="absolute inset-0 animate-ping rounded-full bg-[#0fa457]/50 [animation-duration:2.4s] motion-reduce:hidden" />
                  <span className="relative h-1.5 w-1.5 rounded-full bg-[#0fa457]" />
                </span>
                Active
              </span>
            ) : (
              <span className="shrink-0 whitespace-nowrap text-[9px] font-semibold uppercase leading-3 tracking-[0.12em] text-[#b3a6d9]">
                Only on ACKO Drive
              </span>
            )}
          </div>
          <p className="relative mt-1 text-xs leading-[18px] text-[#8d8798]">
            {isActive
              ? "Zero depreciation · issued the moment you paid"
              : "Zero depreciation · built for your new Creta"}
          </p>

          <div className="relative mt-6">
            <p className="text-[10px] font-semibold uppercase leading-4 tracking-[0.09em] text-[#9a92ad]">
              {INSURANCE_COVER_HERO.eyebrow}
            </p>
            <p className="mt-1 w-fit bg-[linear-gradient(105deg,#251c40_0%,#5920c5_100%)] bg-clip-text text-[32px] font-semibold leading-10 tracking-[-0.5px] text-transparent tabular-nums">
              {INSURANCE_COVER_HERO.value}
            </p>
            <p className="mt-1.5 max-w-[38ch] text-xs leading-[18px] text-[#6f697e]">
              {INSURANCE_COVER_HERO.caption}
            </p>
          </div>
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
                <p className="text-[13px] font-medium leading-[18px] text-[#1c1727]">{row.title}</p>
                <p className="mt-0.5 text-xs leading-[17px] text-[#8d8798]">{row.detail}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer — price (quote) / policy identity (active) + soft action */}
        <div className="flex items-center justify-between gap-3 border-t border-[#f1eef8] px-5 py-3.5">
          {isActive ? (
            <div className="min-w-0">
              <p className="text-[13px] font-medium leading-[18px] text-[#1c1727] tabular-nums">
                {INSURANCE_POLICY_NUMBER}
              </p>
              <p className="mt-0.5 text-xs leading-[17px] text-[#8d8798]">
                Active from today · zero dep 1 yr · third-party 3 yrs
              </p>
            </div>
          ) : (
            <div className="min-w-0">
              <p className="flex flex-wrap items-baseline gap-x-2">
                <span className="text-[17px] font-semibold leading-6 text-[#18141f] tabular-nums">
                  {formatInr(INSURANCE_PREMIUM_INR)}
                </span>
                <span className="text-[13px] leading-5 text-[#b6b1c2] line-through tabular-nums">
                  {formatInr(INSURANCE_COMPARE_AT_PREMIUM_INR)}
                </span>
              </p>
              <p className="mt-0.5 text-xs font-medium leading-[17px] text-[#0c8a4d]">
                You save {formatInr(INSURANCE_COMPARE_AT_PREMIUM_INR - INSURANCE_PREMIUM_INR)}
              </p>
            </div>
          )}
          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            className="flex h-8 shrink-0 items-center rounded-full bg-[#f3effc] px-3.5 text-xs font-semibold leading-4 text-[#5920c5] transition-[background-color,scale] hover:bg-[#ebe2fa] active:scale-[0.97] focus-visible:outline focus-visible:ring-2 focus-visible:ring-[#5920c5]/25 focus-visible:ring-offset-2"
          >
            {isActive ? "View policy" : "What's covered"}
          </button>
        </div>
      </section>

      <InsuranceCoverageBottomSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        mode={mode === "active" ? "owned" : "purchase"}
      />
    </>
  );
}
