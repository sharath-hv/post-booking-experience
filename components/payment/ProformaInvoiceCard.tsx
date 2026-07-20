"use client";

import Image from "next/image";
import { useCallback, type MouseEvent } from "react";

import { PAYMENT_CHOOSE_ASSETS } from "@/components/payment/payment-choose-assets";
import styles from "./ProformaInvoiceCard.module.scss";


export type ProformaInvoiceCardProps = {
  /** Card title. Defaults to "Proforma Invoice". */
  title?: string;
  /** Subtitle line (e.g. "Hyundai Creta 1.5 X-Line AT Diesel"). */
  subtitle?: string;
  /** Optional URL for the download link. Shows "Download" CTA regardless; prevents navigation when omitted. */
  downloadHref?: string;
};

/**
 * Booking amount receipt / proforma invoice callout card.
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
      className={[styles.w_full_0, "card-elevated"].filter(Boolean).join(" ")}
      aria-label={title}
    >
      <div className={styles.flex_1}>
        <div
          className={styles.flex_2}
          aria-hidden
        >
          <Image
            src={PAYMENT_CHOOSE_ASSETS.proformaInvoice}
            alt=""
            width={24}
            height={24}
            className={styles.size_5_3}
            unoptimized
          />
        </div>
        <div className={styles.flex_4}>
          <div className={styles.flex_5}>
            <p className={styles.text_sm_6}>{title}</p>
            <p className={styles.text_xs_7}>{subtitle}</p>
          </div>
          <a
            href={downloadHref ?? "#"}
            onClick={onPlaceholderClick}
            className={styles.self_start_8}
          >
            Download
          </a>
        </div>
      </div>
    </section>
  );
}
