"use client";

import Image from "next/image";

import {
  ModifySelectionRadioIndicator,
  modifySelectionSelectableCardClassName,
} from "@/components/kyc/modify-selection-option-card-ui";
import { BOOKING_CONFIRMED_ASSETS } from "@/components/kyc/kyc-booking-confirmed-assets";
import {
  BOOKING_EXPRESS_DELIVERY_TEXT_CLASS,
  BOOKING_STANDARD_DELIVERY_TEXT_CLASS,
  getBookingDeliveryIconSrc,
} from "@/lib/experience-flow-content";
import {
  modifySelectionColourSavingsInr,
  type ModifySelectionColourOption,
} from "@/lib/modify-selection-colours-content";
import { cn } from "@/lib/utils";

function formatInr(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.max(0, Math.round(amount)));
}

type ModifySelectionColourCardProps = {
  option: ModifySelectionColourOption;
  selected: boolean;
  onSelect?: () => void;
  /** Summary on the confirmation screen — not interactive. */
  readOnly?: boolean;
};

/**
 * Colour option row — Figma node 2672:10452 (modify-selection / change colour).
 */
export function ModifySelectionColourCard({
  option,
  selected,
  onSelect,
  readOnly = false,
}: ModifySelectionColourCardProps) {
  const savingsInr = modifySelectionColourSavingsInr(option);
  const deliveryIconSrc = option.isExpressDelivery
    ? BOOKING_CONFIRMED_ASSETS.expressDelivery
    : getBookingDeliveryIconSrc("standard");
  const deliveryTextClass = option.isExpressDelivery
    ? BOOKING_EXPRESS_DELIVERY_TEXT_CLASS
    : BOOKING_STANDARD_DELIVERY_TEXT_CLASS;

  const cardClassName = modifySelectionSelectableCardClassName(selected, readOnly, "p-4");

  const cardBody = (
    <div className="flex items-start justify-between gap-3">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <div
          className="size-12 shrink-0 overflow-hidden rounded-full border border-[#e8e8e8] bg-white card-elevated"
          aria-hidden
        >
          <div className="size-full" style={{ background: option.swatchBackground }} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-base font-medium leading-6 text-[#121212]">{option.name}</p>

          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            <span className="text-sm font-semibold leading-5 text-[#121212]">
              {formatInr(option.ackoDrivePriceInr)}
            </span>
            <span className="text-xs font-normal leading-4 text-[#757575] line-through">
              {formatInr(option.onRoadListPriceInr)}
            </span>
            {savingsInr > 0 ? (
              <span className="text-xs font-medium leading-4 text-[#0fa457]">
                Save {formatInr(savingsInr)}
              </span>
            ) : null}
          </div>

          <div className="mt-2 flex items-center gap-1">
            <p className={cn("text-xs font-normal leading-4", deliveryTextClass)}>
              {option.deliveryLine}
            </p>
            <span className="relative size-4 shrink-0" aria-hidden>
              <Image
                src={deliveryIconSrc}
                alt=""
                width={16}
                height={16}
                className="size-4 object-contain"
                unoptimized
                sizes="16px"
              />
            </span>
          </div>
        </div>
      </div>

      {!readOnly ? (
        <span className="mt-0.5 flex shrink-0">
          <ModifySelectionRadioIndicator selected={selected} />
        </span>
      ) : null}
    </div>
  );

  if (readOnly) {
    return <div className={cardClassName}>{cardBody}</div>;
  }

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cardClassName}
    >
      {cardBody}
    </button>
  );
}
