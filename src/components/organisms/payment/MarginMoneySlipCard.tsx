"use client";

import Image from "next/image";
import { useCallback, type MouseEvent } from "react";

import marginMoneySlipIcon from "@/assets/margin money slip.svg";
import {
  IconCalloutCard,
  type IconCalloutCardProps,
} from "@/components/organisms/IconCalloutCard";
import calloutStyles from "@/components/organisms/IconCalloutCard.module.scss";

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

export type MarginMoneySlipCardProps = {
  /** `glass` — frosted gradient surface used on confirmation / overlay stacks. */
  variant?: "default" | "glass";
};

/**
 * Margin money slip callout — {@link IconCalloutCard} with download CTA.
 */
export function MarginMoneySlipCard({ variant = "default" }: MarginMoneySlipCardProps) {
  const onDownload = useCallback((e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    triggerDemoMarginSlipDownload();
  }, []);

  const icon: IconCalloutCardProps["icon"] = (
    <Image
      src={marginMoneySlipIcon}
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
      title="Margin money slip"
      body="Hyundai Creta 1.5 X-Line AT Diesel"
      variant={variant}
      cta={{ label: "Download", onClick: onDownload }}
      ariaLabel="Margin money slip"
    />
  );
}
