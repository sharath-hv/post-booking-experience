"use client";

import Image from "next/image";
import { useCallback, type MouseEvent } from "react";

import {
  IconCalloutCard,
  type IconCalloutCardProps,
} from "@/components/organisms/IconCalloutCard";
import calloutStyles from "@/components/organisms/IconCalloutCard.module.scss";
import { PAYMENT_CHOOSE_ASSETS } from "@/components/organisms/payment/payment-choose-assets";

export type ProformaInvoiceCardProps = {
  /** Card title. Defaults to "Proforma Invoice". */
  title?: string;
  /** Subtitle line (e.g. "Hyundai Creta 1.5 X-Line AT Diesel"). */
  subtitle?: string;
  /** Optional URL for the download link. Shows "Download" CTA regardless; prevents navigation when omitted. */
  downloadHref?: string;
};

/**
 * Booking amount receipt / proforma invoice callout — {@link IconCalloutCard} with download CTA.
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

  const icon: IconCalloutCardProps["icon"] = (
    <Image
      src={PAYMENT_CHOOSE_ASSETS.proformaInvoice}
      alt=""
      width={20}
      height={20}
      className={calloutStyles.icon}
      unoptimized
    />
  );

  return (
    <IconCalloutCard
      icon={icon}
      title={title}
      body={subtitle}
      cta={{
        label: "Download",
        href: downloadHref,
        onClick: onPlaceholderClick,
      }}
      ariaLabel={title}
    />
  );
}
