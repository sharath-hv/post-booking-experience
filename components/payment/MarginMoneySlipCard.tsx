"use client";

import Image from "next/image";
import { useCallback, type MouseEvent } from "react";

import marginMoneySlipIcon from "@/assets/margin money slip.svg";
import styles from "./MarginMoneySlipCard.module.scss";


/**
 * Stub download — replace with a real PDF URL when available.
 */
function triggerDemoMarginSlipDownload() {
  const blob = new Blob(
    ["Margin money slip (demo document)\nShare this with your bank to release funds.\n"],
    { type: "text/plain;charset=utf-8" },
  );
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "margin-money-slip-demo.txt";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/**
 * Margin money slip callout — same card pattern as {@link ProformaInvoiceCard}.
 */
export function MarginMoneySlipCard() {
  const onDownload = useCallback((e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    triggerDemoMarginSlipDownload();
  }, []);

  return (
    <section
      className={[styles.w_full_0, "card-elevated"].filter(Boolean).join(" ")}
      aria-label="Margin money slip"
    >
      <div className={styles.flex_1}>
        <div
          className={styles.flex_2}
          aria-hidden
        >
          <Image
            src={marginMoneySlipIcon}
            alt=""
            width={24}
            height={24}
            className={styles.size_5_3}
            unoptimized
          />
        </div>
        <div className={styles.flex_4}>
          <div className={styles.flex_5}>
            <p className={styles.text_sm_6}>Margin money slip</p>
            <p className={styles.text_xs_7}>
              Hyundai Creta 1.5 X-Line AT Diesel
            </p>
          </div>
          <a
            href="#"
            onClick={onDownload}
            className={styles.self_start_8}
          >
            Download
          </a>
        </div>
      </div>
    </section>
  );
}
