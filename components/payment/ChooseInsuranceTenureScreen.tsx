"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import { ConciergeTurnShell } from "@/components/concierge/ConciergeTurnShell";
import { InsuranceTenureCompareBottomSheet } from "@/components/payment/InsuranceTenureCompareBottomSheet";
import {
  INSURANCE_TENURE_DIFFERENCE_CTA,
  INSURANCE_TENURE_OPTIONS,
  type InsuranceTenureId,
  type InsuranceTenureOption,
} from "@/components/payment/insurance-coverage-content";
import { PAYMENT_CHOOSE_ASSETS } from "@/components/payment/payment-choose-assets";
import { buildInsurancePremiumCheckoutHref } from "@/lib/paymentUrls";

function formatInr(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.max(0, Math.round(amount)));
}

function RadioIndicator({ selected }: { selected: boolean }) {
  const src = selected ? PAYMENT_CHOOSE_ASSETS.radioOn : PAYMENT_CHOOSE_ASSETS.radioOff;

  return (
    <span className="relative h-4 w-4 shrink-0" aria-hidden>
      <Image src={src} alt="" fill className="object-contain" unoptimized sizes="16px" />
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
  const isStandard = option.id === "1+3";

  return (
    <button
      type="button"
      id={`insurance-tenure-${option.id}`}
      onClick={onSelect}
      aria-pressed={selected}
      className={`w-full rounded-2xl border p-[15px] text-left transition-colors card-elevated ${
        selected
          ? "border-[#bda6e8] bg-white bg-[linear-gradient(to_bottom,#f4eefe,rgba(244,238,254,0))]"
          : "border-transparent bg-white"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="relative h-10 w-10 shrink-0 self-center">
          <Image
            src={option.illustrationSrc}
            alt=""
            fill
            className="object-contain"
            unoptimized
            sizes="40px"
          />
        </div>
        <div className="min-w-0 flex-1">
          <span className="inline-flex rounded-full bg-[#efe9fb] px-2 py-0.5 text-[10px] font-semibold uppercase leading-4 tracking-[0.06em] text-[#5920c5]">
            {option.badge}
          </span>
          <p className="mt-1 text-base font-semibold leading-6 text-[#121212]">{option.label}</p>
        </div>
        <span className="mt-1 flex shrink-0">
          <RadioIndicator selected={selected} />
        </span>
      </div>

      <p className="mt-2.5 text-[13px] leading-[19px] text-[#4b4b4b]">{option.blurb}</p>

      <div className="mt-3 flex w-full">
        <div className="min-w-0 flex-1 pr-4">
          <p className="text-sm font-semibold leading-5 text-[#121212] tabular-nums">
            {option.ownDamageYears} {option.ownDamageYears === 1 ? "year" : "years"}
          </p>
          <p className="mt-0.5 text-[11px] leading-4 text-[#757575]">Zero depreciation cover</p>
        </div>
        <div className="min-w-0 flex-1 border-l border-[#ececec] pl-4">
          <p className="text-sm font-semibold leading-5 text-[#121212] tabular-nums">
            {option.thirdPartyYears} {option.thirdPartyYears === 1 ? "year" : "years"}
          </p>
          <p className="mt-0.5 text-[11px] leading-4 text-[#757575]">Third party cover</p>
        </div>
      </div>

      <div className="mt-3 border-t border-dashed border-[#dcdbe1] pt-3">
        {option.upgradeBlurb ? (
          <p className="mb-3 text-[13px] leading-[19px] text-[#5920c5]">{option.upgradeBlurb}</p>
        ) : null}
        <p className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <span className="text-base font-semibold leading-6 text-[#121212] tabular-nums">
            {formatInr(option.premiumInr)}
          </span>
          {!isStandard ? (
            <>
              <span className="text-sm leading-5 text-[#757575] line-through tabular-nums">
                {formatInr(option.compareAtInr)}
              </span>
              <span className="text-xs font-medium leading-[18px] text-[#0c8a4d]">
                Save {formatInr(savings)}
              </span>
            </>
          ) : null}
        </p>
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
  const [compareSheetOpen, setCompareSheetOpen] = useState(false);

  const selected = useMemo(
    () => INSURANCE_TENURE_OPTIONS.find((o) => o.id === tenureId)!,
    [tenureId],
  );

  const ctaHref = useMemo(
    () =>
      buildInsurancePremiumCheckoutHref(selected.premiumInr, {
        bank: searchParams.get("bank"),
        loanAmount: searchParams.get("loan_amount"),
        tenure: tenureId,
      }),
    [searchParams, tenureId, selected.premiumInr],
  );

  const says = useMemo(
    () => [
      "One last choice before you pay: how long do you want this locked in?",
      "Extended cover locks in your premium for 3 years. No renewals, no rate hikes. Most people who go extended are glad they did.",
    ],
    [],
  );

  return (
    <>
      <ConciergeTurnShell
        says={says}
        artifact={
          <div className="flex w-full flex-col gap-4">
            {INSURANCE_TENURE_OPTIONS.map((option) => (
              <TenureCard
                key={option.id}
                option={option}
                selected={option.id === tenureId}
                onSelect={() => setTenureId(option.id)}
              />
            ))}
            <button
              type="button"
              onClick={() => setCompareSheetOpen(true)}
              className="tertiary-cta self-start"
            >
              {INSURANCE_TENURE_DIFFERENCE_CTA}
            </button>
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

      <InsuranceTenureCompareBottomSheet
        open={compareSheetOpen}
        onClose={() => setCompareSheetOpen(false)}
      />
    </>
  );
}
