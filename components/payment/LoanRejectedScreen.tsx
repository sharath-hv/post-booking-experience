"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

import { ConciergeTurnShell } from "@/components/concierge/ConciergeTurnShell";
import { bankForQueryParam } from "@/components/payment/acko-drive-finance-bank";
import {
  BANK_DISBURSEMENT_INR,
  DEFAULT_TENURE_MONTHS,
} from "@/components/payment/loan-amount-demo-constants";
import { BANK_SHEET_OPTIONS } from "@/components/payment/payment-choose-assets";
import { writeConciergeEcho } from "@/lib/concierge/echo";
import { estimateMonthlyEmiInr, parseAnnualRateFromLabel } from "@/lib/loan-emi";
import { OVERLAY_GLASS_CARD_CLASS } from "@/lib/overlay-glass-card";
import { bankIdToken, bankNameToken, bankSelectionPath } from "@/lib/payment/bank-selection-urls";

function formatInr(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.max(0, Math.round(amount)));
}

/** Best-rate partner bank that isn't the one that declined. */
function pickAlternativeBank(rejectedId: string) {
  const candidates = BANK_SHEET_OPTIONS.filter((bank) => bank.id !== rejectedId);
  return [...candidates].sort(
    (a, b) => parseAnnualRateFromLabel(a.rate) - parseAnnualRateFromLabel(b.rate),
  )[0];
}

/**
 * Bank declined — the journey's most likely real-world failure, handled the
 * way every other car-buying experience doesn't: dignity first, a concrete
 * pre-approved alternative, zero rework, and the car never at risk.
 */
export function LoanRejectedScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rejected = useMemo(
    () => bankForQueryParam(searchParams.get("bank")),
    [searchParams],
  );
  const alt = useMemo(() => pickAlternativeBank(rejected.id), [rejected.id]);
  const altEmi = useMemo(
    () =>
      estimateMonthlyEmiInr(
        BANK_DISBURSEMENT_INR,
        DEFAULT_TENURE_MONTHS,
        parseAnnualRateFromLabel(alt.rate),
      ),
    [alt.rate],
  );

  const switchToBank = useCallback(
    (bankId: string, bankName: string) => {
      writeConciergeEcho(`Switch me to ${bankName}`);
      router.push(`/payment/loan-processing?bank=${encodeURIComponent(bankId)}`);
    },
    [router],
  );

  const chooseAnotherBankHref = useMemo(
    () =>
      bankSelectionPath({
        next: `/payment/loan-processing?bank=${bankIdToken()}`,
        echo: `Switch me to ${bankNameToken()}`,
      }),
    [],
  );

  return (
    <ConciergeTurnShell
      says={[
        `${rejected.name} wasn't able to approve this loan.`,
        `That's on their lending criteria, not on you. ${alt.name} has already pre-approved you at ${alt.rate} for the same amount, and your one free switch covers this move. Nothing restarts, your application carries over and only the bank changes.`,
      ]}
      artifact={
        <div className={OVERLAY_GLASS_CARD_CLASS}>
          <div className="flex items-start gap-3 px-4 py-4">
            <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-[#f5f5f5]">
              <Image
                src={alt.logoSrc}
                alt=""
                fill
                className="object-contain p-1.5"
                unoptimized
                sizes="36px"
              />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-base font-semibold leading-6 text-[#121212]">{alt.name}</p>
              <p className="text-xs leading-[18px] text-[#757575]">Same loan, better rate</p>
            </div>
            <span className="shrink-0 rounded-full bg-[#e7f6ee] px-2.5 py-1 text-[11px] font-medium leading-4 text-[#0c7a42]">
              Pre-approved
            </span>
          </div>
          <div className="border-t border-dashed border-[#e0e0e0] px-4 py-4">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm leading-5 text-[#4b4b4b]">Interest rate</span>
                <span className="text-sm font-medium leading-5 text-[#121212]">{alt.rate}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm leading-5 text-[#4b4b4b]">EMI from</span>
                <span className="text-sm font-medium leading-5 text-[#121212] tabular-nums">
                  {formatInr(altEmi)}/mo
                </span>
              </div>
            </div>
          </div>
        </div>
      }
      replies={[
        {
          label: `Switch to ${alt.name} (free)`,
          onClick: () => switchToBank(alt.id, alt.name),
          echo: null,
        },
        {
          label: "Show me all bank options",
          kind: "soft",
          href: chooseAnotherBankHref,
          echo: null,
        },
      ]}
      callLabel="Rather talk it through? I can call you"
    />
  );
}
