"use client";

import Image from "next/image";
import { useCallback, type MouseEvent } from "react";

import locationIcon from "@/assets/Location.svg";
import {
  IconCalloutCard,
  type IconCalloutCardProps,
} from "@/components/organisms/IconCalloutCard";
import calloutStyles from "@/components/organisms/IconCalloutCard.module.scss";

export type PartnerGarageCardProps = {
  /** Garage / dealership name. */
  name?: string;
  /** Address or locality line. */
  detail?: string;
  /** Optional maps / directions URL. Prevents navigation when omitted. */
  directionsHref?: string;
  /** `glass` — frosted gradient surface used on confirmation / overlay stacks. */
  variant?: "default" | "glass";
};

/**
 * Partner garage callout — {@link IconCalloutCard} with directions CTA.
 */
export function PartnerGarageCard({
  name = "Advaith Hyundai",
  detail = "Whitefield · Bengaluru",
  directionsHref,
  variant = "default",
}: PartnerGarageCardProps) {
  const onPlaceholderClick = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      if (!directionsHref) e.preventDefault();
    },
    [directionsHref],
  );

  const icon: IconCalloutCardProps["icon"] = (
    <Image
      src={locationIcon}
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
      title={name}
      body={detail}
      variant={variant}
      cta={{
        label: "Get directions",
        href: directionsHref,
        onClick: onPlaceholderClick,
      }}
      ariaLabel="Partner garage"
    />
  );
}
