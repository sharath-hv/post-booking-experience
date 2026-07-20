"use client";

import Image from "next/image";

import carBackgroundSmall from "@/assets/Car background small.png";
import editIcon from "@/assets/Edit.svg";
import { MODIFY_SELECTION_SUMMARY_CARD_CLASS } from "@/components/kyc/modify-selection-option-card-ui";
import { BOOKING_CAR_TITLE, BOOKING_CAR_VARIANT } from "@/components/kyc/booking-car-card-content";
import {
  BOOKING_EXPRESS_DELIVERY_TEXT_CLASS,
  BOOKING_STANDARD_DELIVERY_TEXT_CLASS,
  splitBookingDeliveryLine,
} from "@/lib/experience-flow-content";
import { getModifySelectionCarCutoutForColour } from "@/lib/modify-selection-car-cutouts";
import { cn } from "@/lib/utils";
import styles from "./ModifySelectionReviewSelectionCard.module.scss";


type ModifySelectionReviewSelectionCardProps = {
  colourId: string;
  colourName: string;
  deliveryLine: string;
  isExpressDelivery: boolean;
  onEditColour: () => void;
  onEditDelivery: () => void;
  /** When false, delivery row has no edit control (non-express colours). */
  showDeliveryEdit?: boolean;
  /** Overrides default Hyundai Creta title (different-car flow). */
  carTitle?: string;
  /** Overrides default variant subtitle (variant / different-car flow). */
  carVariant?: string;
  onEditVariant?: () => void;
  /** Different-car flow — change make & model. */
  onEditCar?: () => void;
};

function EditLinkButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={styles.flex_0}
      aria-label={label}
    >
      <Image src={editIcon} alt="" width={20} height={20} className={styles.size_5_1} unoptimized />
    </button>
  );
}

/**
 * Review selection hero — Figma 2696:9191 (car image, delivery/colour with edit).
 */
export function ModifySelectionReviewSelectionCard({
  colourId,
  colourName,
  deliveryLine,
  isExpressDelivery,
  onEditColour,
  onEditDelivery,
  showDeliveryEdit = true,
  carTitle,
  carVariant,
  onEditVariant,
  onEditCar,
}: ModifySelectionReviewSelectionCardProps) {
  const titleLabel = carTitle ?? BOOKING_CAR_TITLE;
  const variantLabel = carVariant ?? BOOKING_CAR_VARIANT;
  const deliveryParts = splitBookingDeliveryLine(deliveryLine);
  const deliveryTextClass = isExpressDelivery
    ? BOOKING_EXPRESS_DELIVERY_TEXT_CLASS
    : BOOKING_STANDARD_DELIVERY_TEXT_CLASS;

  return (
    <div className={MODIFY_SELECTION_SUMMARY_CARD_CLASS}>
      <div className={styles.relative_2}>
        <div className={styles.absolute_3} aria-hidden>
          <Image
            src={carBackgroundSmall}
            alt=""
            fill
            className={styles.object_cover_4}
            style={{ objectPosition: "center 28%" }}
            sizes="(max-width: 640px) 100vw, 320px"
            unoptimized
          />
        </div>
        <div
          className={styles.absolute_5}
          style={{
            backgroundImage:
              "linear-gradient(180deg, rgba(255,255,255,0) 68%, rgba(255,255,255,0.7) 100%), linear-gradient(180deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 25%)",
          }}
          aria-hidden
        />
        <div className={styles.absolute_6}>
          <div className={styles.relative_7}>
            <Image
              src={getModifySelectionCarCutoutForColour(colourId)}
              alt=""
              fill
              className={styles.object_contain_8}
              sizes="180px"
              unoptimized
            />
          </div>
        </div>
      </div>

      <div className={styles.border_t_9}>
        <div className={styles.flex_10}>
          <p className={styles.text_base_11}>{titleLabel}</p>
          {onEditCar != null ? (
            <EditLinkButton label="Change make and model" onClick={onEditCar} />
          ) : null}
        </div>

        <div className={styles.mt_3_12}>
          <span className={styles.shrink_0_13}>Variant:</span>
          <span className={styles.text_xs_14}>{variantLabel}</span>
          {onEditVariant != null ? (
            <EditLinkButton label="Change variant" onClick={onEditVariant} />
          ) : null}
        </div>

        <div className={styles.mt_2_15}>
          <span className={styles.shrink_0_13}>Colour:</span>
          <span className={styles.text_xs_14}>{colourName}</span>
          <EditLinkButton label="Change colour" onClick={onEditColour} />
        </div>

        <div className={styles.mt_2_16}>
          <span className={styles.shrink_0_13}>Delivery:</span>
          <span className={cn(styles.text_xs_18, deliveryTextClass)}>
            {deliveryParts ? (
              <>
                {deliveryParts.prefix}
                <span className={styles.font_semibold_17}>{deliveryParts.date}</span>
              </>
            ) : (
              deliveryLine
            )}
          </span>
          {showDeliveryEdit ? (
            <EditLinkButton label="Change delivery" onClick={onEditDelivery} />
          ) : null}
        </div>
      </div>
    </div>
  );
}
