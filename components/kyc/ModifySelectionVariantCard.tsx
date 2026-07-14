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
  splitBookingDeliveryLine,
} from "@/lib/experience-flow-content";
import {
  formatModifySelectionVariantSpecs,
  modifySelectionVariantSavingsInr,
  type ModifySelectionVariantOption,
} from "@/lib/modify-selection-variants-content";
import { cn } from "@/lib/utils";

function formatInr(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.max(0, Math.round(amount)));
}

function formatInrLakhLabel(amount: number) {
  const lakhs = amount / 100_000;
  const n = lakhs % 1 === 0 ? lakhs.toFixed(0) : lakhs.toFixed(1);
  return `₹${n} L`;
}

type ModifySelectionVariantCardProps = {
  option: ModifySelectionVariantOption;
  selected: boolean;
  onSelect?: () => void;
  readOnly?: boolean;
};

/**
 * Variant option row — Figma 2682:9105 (modify-selection / change variant).
 */
export function ModifySelectionVariantCard({
  option,
  selected,
  onSelect,
  readOnly = false,
}: ModifySelectionVariantCardProps) {
  const savingsInr = modifySelectionVariantSavingsInr(option);
  const deliveryIconSrc = option.isExpressDelivery
    ? BOOKING_CONFIRMED_ASSETS.expressDelivery
    : getBookingDeliveryIconSrc("standard");
  const deliveryTextClass = option.isExpressDelivery
    ? BOOKING_EXPRESS_DELIVERY_TEXT_CLASS
    : BOOKING_STANDARD_DELIVERY_TEXT_CLASS;
  const deliveryParts = splitBookingDeliveryLine(option.deliveryLine);

  const cardClassName = modifySelectionSelectableCardClassName(selected, readOnly, "p-4");

  const cardBody = (
    <>
      <div className="flex items-start justify-between gap-3">
        <p className="min-w-0 flex-1 text-base font-medium leading-6 text-[#121212]">{option.name}</p>
        {!readOnly ? (
          <span className="mt-0.5 flex shrink-0">
            <ModifySelectionRadioIndicator selected={selected} />
          </span>
        ) : null}
      </div>

      <p className="mt-0.5 text-xs leading-4 text-[#757575]">
        {formatModifySelectionVariantSpecs(option)}
      </p>

      <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
        <span className="text-sm font-semibold leading-5 text-[#121212]">
          {formatInrLakhLabel(option.ackoDrivePriceInr)}
        </span>
        <span className="text-xs font-normal leading-4 text-[#757575] line-through">
          {formatInrLakhLabel(option.onRoadListPriceInr)}
        </span>
        {savingsInr > 0 ? (
          <span className="text-xs font-medium leading-4 text-[#0fa457]">
            Save {formatInr(savingsInr)}
          </span>
        ) : null}
      </div>

      <div className="mt-2 flex items-center gap-1">
        <p className={cn("text-xs font-normal leading-4", deliveryTextClass)}>
          {deliveryParts ? (
            <>
              {deliveryParts.prefix}
              <span className="font-medium">{deliveryParts.date}</span>
            </>
          ) : (
            option.deliveryLine
          )}
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
    </>
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
