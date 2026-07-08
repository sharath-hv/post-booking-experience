"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import { ConciergeTurnShell } from "@/components/concierge/ConciergeTurnShell";
import {
  INSURANCE_TENURE_OPTIONS,
  type InsuranceTenureId,
  type InsuranceTenureOption,
} from "@/components/payment/insurance-coverage-content";
import { buildPayInsurancePremiumHref } from "@/lib/paymentUrls";
import { cn } from "@/lib/utils";

function formatInr(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.max(0, Math.round(amount)));
}

function RadioIndicator({ selected }: { selected: boolean }) {
  if (!selected) {
    return (
      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-[1.5px] border-[#d0cdd8]" aria-hidden />
    );
  }
  return (
    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-[1.5px] border-[#5920c5]" aria-hidden>
      <span className="h-2 w-2 rounded-full bg-[#5920c5]" />
    </span>
  );
}

function TenureCard({
  option,
  selected,
  onSelect,
}: {
  option: InsuranceTenureOption;
  selected: boolean;
  onSelect: () => void;
}) {
  const savings = option.compareAtInr - option.premiumInr;

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "w-full rounded-2xl border bg-white p-4 text-left transition-[border-color,box-shadow] duration-150",
        selected
          ? "border-[#5920c5] shadow-[0_0_0_3px_rgba(89,32,197,0.08)]"
          : "border-[#e8e8e8] card-elevated"
      )}
    >
      <div className="flex items-start gap-3">
        <RadioIndicator selected={selected} />

        <div className="min-w-0 flex-1">
          {/* Header row */}
          <div className="flex items-center gap-2">
            <span className="text-[15px] font-semibold leading-5 text-[#121212]">
              {option.label}
            </span>
            {option.badge ? (
              <span className="rounded-full bg-[#efe9fb] px-2 py-0.5 text-[10px] font-semibold uppercase leading-4 tracking-[0.07em] text-[#5920c5]">
                {option.badge}
              </span>
            ) : null}
          </div>

          {/* Duration breakdown */}
          <div className="mt-1.5 flex items-center gap-3 text-xs leading-[18px] text-[#757575]">
            <span>Own damage · {option.ownDamageYears} yr</span>
            <span className="h-3 w-px bg-[#e0e0e0]" aria-hidden />
            <span>Third-party · {option.thirdPartyYears} yr</span>
          </div>

          {/* Price row */}
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-base font-semibold leading-6 text-[#121212] tabular-nums">
              {formatInr(option.premiumInr)}
            </span>
            <span className="text-[13px] leading-5 text-[#b6b1c2] line-through tabular-nums">
              {formatInr(option.compareAtInr)}
            </span>
            <span className="text-xs font-medium leading-[18px] text-[#0c8a4d]">
              Save {formatInr(savings)}
            </span>
          </div>

          {/* Upgrade blurb — visible when selected */}
          {option.upgradeBlurb && selected ? (
            <p className="mt-2 text-[13px] leading-[19px] text-[#5920c5]">
              {option.upgradeBlurb}
            </p>
          ) : null}
        </div>
      </div>
    </button>
  );
}

/**
 * Tenure selection step — user picks 1+3 (standard) or 3+3 (extended)
 * before paying the insurance premium.
 */
export function ChooseInsuranceTenureScreen() {
  const searchParams = useSearchParams();
  const [tenureId, setTenureId] = useState<InsuranceTenureId>("1+3");

  const selected = useMemo(
    () => INSURANCE_TENURE_OPTIONS.find((o) => o.id === tenureId)!,
    [tenureId],
  );

  const ctaHref = useMemo(
    () =>
      buildPayInsurancePremiumHref({
        bank: searchParams.get("bank"),
        loanAmount: searchParams.get("loan_amount"),
        tenure: tenureId,
        insuranceAmount: selected.premiumInr,
      }),
    [searchParams, tenureId, selected.premiumInr],
  );

  const says = useMemo(
    () => [
      "One last choice before you pay.",
      "Standard is already strong — pick extended if you'd rather not deal with renewals for 3 years.",
    ],
    [],
  );

  return (
    <ConciergeTurnShell
      says={says}
      artifact={
        <div className="flex flex-col gap-3">
          {INSURANCE_TENURE_OPTIONS.map((option) => (
            <TenureCard
              key={option.id}
              option={option}
              selected={option.id === tenureId}
              onSelect={() => setTenureId(option.id)}
            />
          ))}
        </div>
      }
      replies={[
        {
          label: `Pay ${formatInr(selected.premiumInr)}`,
          href: ctaHref,
          kind: "primary",
          echo: null,
        },
      ]}
      callLabel="Coverage questions? I can call you"
      showMenu
    />
  );
}
