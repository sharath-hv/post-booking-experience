import calendarIcon from "@/assets/Calender.svg";
import carPriceIcon from "@/assets/car price.svg";
import changeCarIcon from "@/assets/Change car.svg";
import changeColourIcon from "@/assets/Change colour.svg";
import changeVariantIcon from "@/assets/Change variant.svg";
import moneyIcon from "@/assets/money.svg";
import type { StaticImageData } from "next/image";

import type { BottomSheetConfirmBulletPoint } from "@/components/ui/BottomSheetConfirmBulletList";
import { readChangeEntryStage } from "@/lib/change-policy";
import {
  isModifyNoChargesFlow,
  isModifyWithChargesFlow,
  readExperienceFlow,
  type ExperienceFlow,
} from "@/lib/experience-flow";
import { MODIFY_BOOKING_CHANGE_FEE_INR } from "@/lib/manage-booking-modify";
import styles from "./modify-selection-content.module.scss";


export const MODIFY_SELECTION_PATH = "/kyc/modify-selection";

/** White page shell for modify-selection routes — not concierge `#F7FAFF`. */
export const MODIFY_SELECTION_PAGE_SHELL_CLASS = styles.modifySelectionPageShell;

export const MODIFY_SELECTION_TITLE = "What would you like to change, Sharath?";

export const MODIFY_SELECTION_SUBLINE_NO_CHARGES =
  "No change fee. Your current pick stays put while you explore.";

export const MODIFY_SELECTION_SUBLINE_WITH_CHARGES =
  "A ₹5,000 change fee applies. Your current pick stays put while you explore.";

/** @deprecated Use {@link resolveModifySelectionSubline}. */
export const MODIFY_SELECTION_SUBLINE = MODIFY_SELECTION_SUBLINE_NO_CHARGES;

export function resolveModifySelectionSubline(flow?: ExperienceFlow): string {
  const active = flow ?? readExperienceFlow();
  if (isModifyNoChargesFlow(active)) {
    return MODIFY_SELECTION_SUBLINE_NO_CHARGES;
  }
  if (isModifyWithChargesFlow(active) || readChangeEntryStage() === "post") {
    return MODIFY_SELECTION_SUBLINE_WITH_CHARGES;
  }
  return MODIFY_SELECTION_SUBLINE_NO_CHARGES;
}

const MODIFY_SELECTION_CONFIRM_CHANGE_FEE_BULLET = `A ₹${MODIFY_BOOKING_CHANGE_FEE_INR.toLocaleString("en-IN")} one-time change fee applies for this.`;

/** Confirm-sheet bullets — includes change-fee point when post-allocation / with-charges. */
export function resolveModifySelectionConfirmPoints(
  choiceId: ModifySelectionChoiceId,
  flow?: ExperienceFlow,
): readonly BottomSheetConfirmBulletPoint[] {
  const option = MODIFY_SELECTION_OPTIONS.find((o) => o.id === choiceId);
  if (option == null) return [];

  const active = flow ?? readExperienceFlow();
  const showChangeFee =
    isModifyWithChargesFlow(active) || readChangeEntryStage() === "post";
  if (!showChangeFee) {
    return option.confirmPoints;
  }

  return [MODIFY_SELECTION_CONFIRM_CHANGE_FEE_BULLET, ...option.confirmPoints];
}

/** Section label above booked-car summary on colour / variant pickers. */
export const MODIFY_SELECTION_CURRENT_SELECTION_HEADING = "Current selection";

export type ModifySelectionChoiceId = "colour" | "variant" | "different_car";

export type ModifySelectionOption = {
  id: ModifySelectionChoiceId;
  title: string;
  description: string;
  illustrationSrc: StaticImageData | string;
  /** Primary CTA on `/kyc/modify-selection` when this option is selected. */
  continueCtaLabel: string;
  continuePath: string;
  confirmHeader: string;
  /** Bullet points in confirm bottom sheet (tick by default; date bullets use calendar). */
  confirmPoints: readonly BottomSheetConfirmBulletPoint[];
};

export const MODIFY_SELECTION_OPTIONS: readonly ModifySelectionOption[] = [
  {
    id: "colour",
    title: "Change colour",
    description: "Swap to another colour on your Creta — price can shift a little.",
    illustrationSrc: changeColourIcon,
    continueCtaLabel: "See available colours",
    continuePath: "/kyc/modify-selection/colour",
    confirmHeader: "Quick check before we switch colour",
    confirmPoints: [
      {
        content: "Your ₹10,000 price lock carries forward to the new colour.",
        icon: moneyIcon,
      },
      {
        content: "I'll update the delivery date once we know the colour's availability.",
        icon: calendarIcon,
      },
    ],
  },
  {
    id: "variant",
    title: "Change variant",
    description: "Step up or switch Creta variants — I'll refresh the price for you.",
    illustrationSrc: changeVariantIcon,
    continueCtaLabel: "See available variants",
    continuePath: "/kyc/modify-selection/variant",
    confirmHeader: "Quick check before we switch variant",
    confirmPoints: [
      {
        content: "Your ₹10,000 price lock carries forward to the new variant.",
        icon: moneyIcon,
      },
      {
        content: "I'll update the price for the variant you pick.",
        icon: carPriceIcon,
      },
      {
        content: "Delivery may move depending on that variant's availability.",
        icon: calendarIcon,
      },
    ],
  },
  {
    id: "different_car",
    title: "Choose a different car",
    description: "Browse other Hyundais — or cars from another brand entirely.",
    illustrationSrc: changeCarIcon,
    continueCtaLabel: "Browse cars",
    continuePath: "/kyc/modify-selection/different-car",
    confirmHeader: "Quick check before we switch cars",
    confirmPoints: [
      {
        content: "Your ₹10,000 price lock carries forward to the new car.",
        icon: moneyIcon,
      },
      {
        content: "I'll update the price for the car you pick.",
        icon: carPriceIcon,
      },
      {
        content: "Delivery will follow whatever that car can actually do.",
        icon: calendarIcon,
      },
    ],
  },
];

export function modifySelectionChoiceSlugToId(slug: string): ModifySelectionChoiceId | undefined {
  if (slug === "different-car") return "different_car";
  if (slug === "colour" || slug === "variant") return slug;
  return undefined;
}

export function modifySelectionChoiceLabel(choiceSlug: string): string | undefined {
  const id = modifySelectionChoiceSlugToId(choiceSlug);
  if (id == null) return undefined;
  return MODIFY_SELECTION_OPTIONS.find((o) => o.id === id)?.title;
}
