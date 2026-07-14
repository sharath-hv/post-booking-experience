"use client";

import Image from "next/image";

import { splitBookingDeliveryLine } from "@/lib/experience-flow-content";
import {
  modifySelectionSelectableCardClass,
  MODIFY_SELECTION_SELECTABLE_CARD_BASE_CLASS,
  ModifySelectionRadioIndicator,
} from "@/components/kyc/modify-selection-option-card-ui";
import { formatModifySelectionInr } from "@/lib/modify-selection-review-pay-content";
import { cn } from "@/lib/utils";

export type ModifySelectionDeliveryOptionCardProps = {
  selected: boolean;
  onSelect: () => void;
  deliveryLine: string;
  deliveryLineClass: string;
  iconSrc: string;
  priceInr: number;
};

/**
 * Express vs standard delivery row — shared by delivery sheet and review-and-pay.
 */
export function ModifySelectionDeliveryOptionCard({
  selected,
  onSelect,
  deliveryLine,
  deliveryLineClass,
  iconSrc,
  priceInr,
}: ModifySelectionDeliveryOptionCardProps) {
  const deliveryParts = splitBookingDeliveryLine(deliveryLine);

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        MODIFY_SELECTION_SELECTABLE_CARD_BASE_CLASS,
        "p-4",
        modifySelectionSelectableCardClass(selected),
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1">
            <p className={cn("text-sm font-normal leading-5", deliveryLineClass)}>
              {deliveryParts ? (
                <>
                  {deliveryParts.prefix}
                  <span className="font-semibold">{deliveryParts.date}</span>
                </>
              ) : (
                deliveryLine
              )}
            </p>
            <span className="relative size-4 shrink-0" aria-hidden>
              <Image
                src={iconSrc}
                alt=""
                width={16}
                height={16}
                className="size-4 object-contain"
                unoptimized
                sizes="16px"
              />
            </span>
          </div>
          <p className="mt-2 text-base font-medium leading-6 text-[#121212]">
            {formatModifySelectionInr(priceInr)}
          </p>
        </div>
        <span className="mt-0.5 flex shrink-0">
          <ModifySelectionRadioIndicator selected={selected} />
        </span>
      </div>
    </button>
  );
}
