"use client";

import Image from "next/image";
import { useCallback, type MouseEvent } from "react";

import { PAYMENT_CHOOSE_ASSETS } from "@/components/payment/payment-choose-assets";

export type ProformaInvoiceCardProps = {
  /** Card title. Defaults to "Proforma Invoice". */
  title?: string;
  /** Subtitle line (e.g. "Hyundai Creta 1.5 X-Line AT Diesel"). */
  subtitle?: string;
  /** Optional URL for the download link. Shows "Download" CTA regardless; prevents navigation when omitted. */
  downloadHref?: string;
};

/**
 * Price-lock receipt / proforma invoice callout card.
 */
export function ProformaInvoiceCard({
  title = "Proforma Invoice",
  subtitle = "Hyundai Creta 1.5 X-Line AT Diesel",
  downloadHref,
}: ProformaInvoiceCardProps) {
  const onPlaceholderClick = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      if (!downloadHref) e.preventDefault();
    },
    [downloadHref],
  );

  return (
    <section
      className="w-full rounded-2xl bg-white card-elevated p-4 text-left"
      aria-label={title}
    >
      <div className="flex items-start gap-3">
        <div
          className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#f5f5f5]"
          aria-hidden
        >
          <Image
            src={PAYMENT_CHOOSE_ASSETS.proformaInvoice}
            alt=""
            width={24}
            height={24}
            className="size-5 object-contain"
            unoptimized
          />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex flex-col gap-0.5">
            <p className="text-sm font-medium leading-5 text-[#121212]">{title}</p>
            <p className="text-xs font-normal leading-[18px] text-[#757575]">{subtitle}</p>
          </div>
          <a
            href={downloadHref ?? "#"}
            onClick={onPlaceholderClick}
            className="self-start text-xs font-medium leading-[18px] text-[#1b73e8] underline-offset-2 hover:underline focus-visible:outline focus-visible:ring-2 focus-visible:ring-[#1b73e8]/30 focus-visible:ring-offset-2"
          >
            Download
          </a>
        </div>
      </div>
    </section>
  );
}
