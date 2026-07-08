"use client";

import Image from "next/image";

import type { BANK_SHEET_OPTIONS } from "@/components/payment/payment-choose-assets";

type BankOption = (typeof BANK_SHEET_OPTIONS)[number];

type AckoDriveBankPartnerRowProps = {
  bank: BankOption;
  /** When set, shows the Change control (e.g. celebration confirmed screen). */
  onChange?: () => void;
};

/** Banking partner row — continues Shivi's body copy on ACKO Drive screens. */
export function AckoDriveBankPartnerRow({ bank, onChange }: AckoDriveBankPartnerRowProps) {
  return (
    <div className="flex w-full flex-wrap items-center gap-x-1.5 gap-y-1 text-left">
      <span className="text-base font-normal leading-6 text-[#4b4b4b]">Banking partner</span>
      <span className="inline-flex items-center gap-3">
        <span className="inline-flex items-center gap-1">
          <span className="relative h-5 w-5 shrink-0 overflow-hidden rounded-sm bg-white">
            <Image
              src={bank.logoSrc}
              alt={bank.name}
              width={20}
              height={20}
              className="object-contain"
              unoptimized
              sizes="20px"
            />
          </span>
          <span className="text-base font-medium leading-6 text-[#121212]">{bank.brandText}</span>
        </span>
        {onChange != null ? (
          <button
            type="button"
            onClick={onChange}
            className="cursor-pointer border-0 bg-transparent p-0 font-inherit text-sm font-medium leading-6 text-[#1b73e8] underline-offset-2 transition-opacity hover:underline focus-visible:outline focus-visible:underline"
          >
            Change
          </button>
        ) : null}
      </span>
    </div>
  );
}
