"use client";

import Image from "next/image";

import arrowRightIcon from "@/assets/Arrow_right.svg";
import {
  bankLockInSummary,
  formatBankRate,
  type BankLoanTerms,
} from "@/components/payment/bank-loan-terms";

/** Neutral badge for both rate types — a color read (e.g. green) would signal "better", which isn't true of either. */
function RateTypeTag({ rateType }: { rateType: "Fixed" | "Floating" }) {
  return (
    <span className="inline-flex items-center rounded-full bg-[#f5f5f5] px-2 py-0.5 text-[11px] font-medium leading-4 text-[#4b4b4b]">
      {rateType === "Fixed" ? "Fixed rate" : "Floating rate"}
    </span>
  );
}

type BankLoanCardProps = {
  bank: BankLoanTerms;
  onOpen: () => void;
};

/**
 * Bank selection full page — collapsed card (Figma follow-up to 1941:12822).
 * Know: which banks are available, enough to shortlist 2-3.
 * Do: tap in for full terms.
 */
export function BankLoanCard({ bank, onOpen }: BankLoanCardProps) {
  const lockInSummary = bankLockInSummary(bank);

  return (
    <button
      type="button"
      onClick={onOpen}
      className="w-full rounded-2xl border border-[#e8e8e8] bg-white p-4 text-left transition-transform active:scale-[0.99]"
    >
      <div className="flex items-start gap-3">
        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-[#f5f5f5]">
          <Image
            src={bank.logoSrc}
            alt=""
            fill
            className="object-contain p-1.5"
            unoptimized
            sizes="40px"
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="text-base font-medium leading-6 text-[#121212]">{bank.name}</p>
            {bank.rateType ? <RateTypeTag rateType={bank.rateType} /> : null}
          </div>
          <p className="mt-0.5 text-xs leading-[18px] text-[#4b4b4b]">
            Interest rate from{" "}
            <span className="font-medium text-[#121212]">{formatBankRate(bank)}</span>
          </p>
        </div>
      </div>

      {lockInSummary ? (
        <div className="mt-3 flex items-center justify-between gap-2 border-t border-dashed border-[#dcdbe1] pt-3">
          <p className="text-xs leading-[18px] text-[#757575]">{lockInSummary}</p>
          <span className="relative h-5 w-5 shrink-0" aria-hidden>
            <Image
              src={arrowRightIcon}
              alt=""
              fill
              className="object-contain"
              unoptimized
              sizes="20px"
            />
          </span>
        </div>
      ) : null}
    </button>
  );
}
