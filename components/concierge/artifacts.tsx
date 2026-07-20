"use client";

import Image, { type StaticImageData } from "next/image";
import type { CSSProperties } from "react";

import cretaCutout from "@/assets/Hyundai Creta.png";
import ackoDriveWordmark from "@/assets/ACKO Drive wordmark.svg";
import carIcon from "@/assets/Car.svg";
import identityIcon from "@/assets/Identity.svg";
import moneyRoundIcon from "@/assets/Money round.svg";
import newCarIcon from "@/assets/New car.svg";
import phoneIcon from "@/assets/Phone.svg";
import tickIcon from "@/assets/tick.svg";
import { ShimmerInfoCard } from "@/components/ui/ShimmerInfoCard";
import { BookingCarCardDetails } from "@/components/kyc/BookingCarCardDetails";
import {
  BOOKING_CAR_CARD_SHELL_CLASS,
  BOOKING_CAR_HERO_HEIGHT_CLASS,
  BOOKING_CAR_HERO_HEIGHT_VIN_CLASS,
  BOOKING_CAR_SUMMARY_PANEL_CLASS,
  BOOKING_CAR_SUMMARY_PANEL_POSITION_CLASS,
  BookingCarCardBackdrop,
  BookingCarSummaryCardVisualStage,
} from "@/components/kyc/BookingCarSummaryCard";
import { cn } from "@/lib/utils";
import { OVERLAY_GLASS_CARD_CLASS, OVERLAY_GLASS_SURFACE_CLASS } from "@/lib/overlay-glass-card";
import styles from "./artifacts.module.scss";


const TICK_ICON_MASK_STYLE = {
  maskImage: `url(${tickIcon.src})`,
  WebkitMaskImage: `url(${tickIcon.src})`,
} satisfies CSSProperties;

function formatInr(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.max(0, Math.round(amount)));
}

/* ----------------------------------------------------------------------- */
/* Receipt — money landed                                                    */
/* ----------------------------------------------------------------------- */

type RowTag = {
  text: string;
  /** `green` = paid, `amber` = pending/later, `grey` = neutral */
  variant: "green" | "amber" | "grey";
};

const ROW_TAG_CLASS: Record<RowTag["variant"], string> = {
  green: styles.bg_e7f6ee__1,
  amber: styles.bg_fff7e5__2,
  grey:  styles.bg_f5f5f5__1,
};

export type AmountReceivedCardProps = {
  amountInr: number;
  title: string;
  rows?: readonly { label: string; value: string; tag?: RowTag }[];
  /** Quiet reassurance under the rows (e.g. refundability). */
  note?: string;
  /** `processing` keeps the receipt live (spinner) until the payment settles. */
  status?: "received" | "processing";
  /** Custom icon image to replace the default tick / spinner. */
  iconSrc?: string | StaticImageData;
  /** Background class for the icon container (overrides the green / yellow default). */
  iconBgClassName?: string;
  /** `glass` — frosted gradient surface used on the manage-booking overlay. */
  variant?: "default" | "glass";
};

/** What she slides across the desk after money moves — a clean receipt. */
export function AmountReceivedCard({
  amountInr,
  title,
  rows,
  note,
  status = "received",
  iconSrc,
  iconBgClassName,
  variant = "default",
}: AmountReceivedCardProps) {
  const processing = status === "processing";
  const isGlass = variant === "glass";
  const defaultBg = processing ? styles.bg_fff7e5__3 : styles.bg_e7f6ee__4;
  return (
    <div
      className={cn(
        isGlass ? OVERLAY_GLASS_CARD_CLASS : styles.overflow_hidden_39, "card-elevated",
      )}
    >
      <div className={styles.flex_0}>
        <span
          className={cn(
            styles.flex_53,
            iconBgClassName ?? defaultBg,
          )}
        >
          {iconSrc ? (
            <Image src={iconSrc} alt="" width={20} height={20} className={styles.object_contain_1} unoptimized />
          ) : processing ? (
            <span
              className={styles.h_5_2}
              aria-hidden
            />
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M5 12.5l4.2 4.2L19 7"
                stroke="#0fa457"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </span>
        <div className={styles.min_w_0_3}>
          <p className={styles.text_xl_4}>
            {formatInr(amountInr)}
          </p>
          <p className={styles.text_xs_5}>{title}</p>
        </div>
      </div>
      {rows?.length ? (
        <div className={styles.border_t_6}>
          <div className={styles.flex_7}>
            {rows.map((row) => (
              <div key={row.label} className={styles.flex_8}>
                <span className={styles.flex_9}>
                  {row.label}
                  {row.tag ? (
                    <span
                      className={cn(
                        styles.shrink_0_54,
                        ROW_TAG_CLASS[row.tag.variant],
                      )}
                    >
                      {row.tag.text}
                    </span>
                  ) : null}
                </span>
                <span className={styles.text_sm_10}>
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : null}
      {note ? (
        <div className={cn(styles.border_t_55, !isGlass && styles.bg_fafafa__56)}>
          <p className={styles.text_xs_5}>{note}</p>
        </div>
      ) : null}
    </div>
  );
}

/* ----------------------------------------------------------------------- */
/* Plan — her promises, as a timeline                                        */
/* ----------------------------------------------------------------------- */

export type PlanTimelineIcon = "documents" | "car" | "money" | "delivery";

export type PlanItem = {
  icon: PlanTimelineIcon;
  title: string;
  detail: string;
  /** Step state — defaults to first=now, rest=todo (the day-one plan). */
  status?: "done" | "now" | "todo";
};

const PLAN_ICON_ASSETS: Partial<Record<PlanTimelineIcon, StaticImageData>> = {
  documents: identityIcon,
  car: carIcon,
  money: moneyRoundIcon,
  delivery: newCarIcon,
};

function PlanTimelineGlyph({ name, className }: { name: PlanTimelineIcon; className?: string }) {
  const asset = PLAN_ICON_ASSETS[name];
  if (!asset) return null;
  return (
    <Image
      src={asset}
      alt=""
      width={20}
      height={20}
      className={cn(styles.shrink_0_16, className)}
      unoptimized
      aria-hidden
    />
  );
}

export type PlanListProps = {
  items: readonly PlanItem[];
  /** `glass` — frosted gradient surface used on the manage-booking overlay. */
  variant?: "default" | "glass";
};

/**
 * “Here's how I'll get you your car” — her commitments as a timeline:
 * icon nodes on a dashed rail, the live step filled in brand purple as “Now”.
 */
export function PlanList({ items, variant = "default" }: PlanListProps) {
  return (
    <ol
      className={cn(
        styles.planList,
        "card-elevated",
        variant === "glass" ? OVERLAY_GLASS_SURFACE_CLASS : styles.planListSolid
      )}
    >
      {items.map((item, idx) => {
        const status = item.status ?? (idx === 0 ? "now" : "todo");
        const isNow = status === "now";
        const isDone = status === "done";
        const isLast = idx === items.length - 1;
        return (
          <li key={item.title} className={styles.planStep}>
            <span className={styles.planRail}>
              {/* Fill the “Now” label offset so the rail doesn’t break above the live node */}
              {isNow ? (
                <span
                  className={cn(styles.planConnector, styles.planConnectorIntoNow)}
                  aria-hidden
                />
              ) : null}
              <span
                className={cn(
                  styles.planNode,
                  isNow ? styles.planNodeNow : isDone ? styles.planNodeDone : styles.planNodeTodo
                )}
              >
                <PlanTimelineGlyph
                  name={item.icon}
                  className={isNow ? styles.planGlyphOnNow : undefined}
                />
              </span>
              {!isLast ? (
                <span
                  className={cn(
                    styles.planConnector,
                    isNow
                      ? styles.planConnectorFromNow
                      : isDone
                        ? styles.planConnectorFromDone
                        : styles.planConnectorFromTodo
                  )}
                  aria-hidden
                />
              ) : null}
            </span>
            <div
              className={cn(
                styles.planStepCopy,
                isNow && styles.planStepCopyNow,
                !isLast && styles.planStepCopySpaced
              )}
            >
              {isNow ? <p className={styles.planNowLabel}>Now</p> : null}
              <div className={styles.planTitleRow}>
                <p className={styles.planTitle}>{item.title}</p>
                {isDone ? (
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden
                    className={styles.planDoneCheck}
                  >
                    <path
                      d="M5 12.5l4.2 4.2L19 7"
                      stroke="#0fa457"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : null}
              </div>
              <p className={cn(styles.planDetail, isDone ? styles.planDetailDone : styles.planDetailTodo)}>
                {item.detail}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/* ----------------------------------------------------------------------- */
/* Note — quiet aside                                                        */
/* ----------------------------------------------------------------------- */

export type NoteCalloutProps = {
  children: React.ReactNode;
};

/** Aside in the shimmer info-callout style (matches “A quick heads-up”). */
export function NoteCallout({ children }: NoteCalloutProps) {
  return <ShimmerInfoCard icon="info">{children}</ShimmerInfoCard>;
}

/* ----------------------------------------------------------------------- */
/* Price breakup — the four parts that always add up to the locked price     */
/* ----------------------------------------------------------------------- */

export type CarPriceBreakupCardProps = {
  /** The locked/promised price the four parts add up to. */
  totalInr: number;
  /** Booking amount already paid. */
  bookingPaidInr: number;
  /** Bank row — omitted for full payment. */
  disbursementLabel?: string;
  disbursementInr?: number;
  insuranceInr: number;
  /** The derived amount due now. */
  dueLabel: string;
  dueInr: number;
};

/**
 * The price identity, visible: booking amount + disbursement + insurance + down payment
 * = locked price. The bank's number is the bank's number; what's due now is
 * derived — and insurance explicitly waits until just before delivery (RTO).
 */
export function CarPriceBreakupCard({
  totalInr,
  bookingPaidInr,
  disbursementLabel,
  disbursementInr,
  insuranceInr,
  dueLabel,
  dueInr,
}: CarPriceBreakupCardProps) {
  return (
    <div className={[styles.overflow_hidden_17, "card-elevated"].filter(Boolean).join(" ")}>
      <div className={styles.flex_18}>
        <span className={styles.text_sm_15}>Your locked price</span>
        <span className={styles.text_sm_19}>
          {formatInr(totalInr)}
        </span>
      </div>

      <div className={styles.flex_20}>
        <div className={styles.flex_21}>
          <span className={styles.flex_9}>
            Booking amount
            <span className={styles.shrink_0_22}>
              Paid ✓
            </span>
          </span>
          <span className={styles.text_sm_23}>
            − {formatInr(bookingPaidInr)}
          </span>
        </div>

        {disbursementLabel != null && disbursementInr != null ? (
          <div className={styles.flex_24}>
            <span className={styles.flex_9}>
              {disbursementLabel}
              <span className={styles.shrink_0_25}>
                Bank → dealer
              </span>
            </span>
            <span className={styles.text_sm_23}>
              − {formatInr(disbursementInr)}
            </span>
          </div>
        ) : null}

        <div className={styles.flex_24}>
          <span className={styles.flex_9}>
            Insurance
            <span className={styles.shrink_0_26}>
              Later · before delivery
            </span>
          </span>
          <span className={styles.text_sm_23}>
            − {formatInr(insuranceInr)}
          </span>
        </div>
      </div>

      <div className={styles.flex_27}>
        <span className={styles.text_sm_28}>{dueLabel}</span>
        <span className={styles.text_base_29}>
          = {formatInr(dueInr)}
        </span>
      </div>

      <div className={styles.border_t_30}>
        <p className={styles.text_xs_5}>
          These parts always add up to your locked price. Nothing extra, ever. Insurance is
          paid just before delivery, for RTO registration.
        </p>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------------- */
/* Next step — the one thing she needs from you                              */
/* ----------------------------------------------------------------------- */

export type NextStepCardProps = {
  /** Tight imperative — e.g. “Pick up my call”. */
  title: string;
  body: string;
};

/**
 * The user's single pending action. Action grammar: purple outline +
 * lavender fill, with a slow radar pulse on the node — something is coming
 * for you. Stakes go in a ShimmerInfoCard next to it, not in here.
 */
export function NextStepCard({ title, body }: NextStepCardProps) {
  return (
    <div className={[styles.rounded_2xl_31, "card-elevated"].filter(Boolean).join(" ")}>
      <div className={styles.flex_32}>
        <span className={styles.relative_33}>
          <span
            aria-hidden
            className={styles.absolute_34}
          />
          <span className={styles.relative_35}>
            <Image
              src={phoneIcon}
              alt=""
              width={20}
              height={20}
              className={styles.shrink_0_36}
              unoptimized
              aria-hidden
            />
          </span>
        </span>
        <div className={styles.min_w_0_3}>
          <p className={styles.text_base_37}>{title}</p>
          <p className={styles.mt_1_38}>{body}</p>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------------- */
/* The car — what all of this is about                                       */
/* ----------------------------------------------------------------------- */

export type CarSummaryCardLiteProps = {
  title: string;
  variant: string;
  colour: string;
  /** e.g. “Express delivery by 10 Jun '25”. */
  deliveryLine?: string;
  deliveryLineClassName?: string;
  /** Strip container classes — express lavender vs standard neutral. */
  deliveryStripClassName?: string;
  /** Bolt (express) or clock (standard). */
  deliveryIconSrc?: StaticImageData | string;
  /** Who has it (dealer attribution row). */
  dealerName?: string;
  dealerDetail?: string;
  /** `dealer` leads with the dealer (e.g. “found it” — the dealer is the news). */
  hero?: "car" | "dealer";
  /** Green status chip at card top — e.g. “Locked to you ✓”. */
  statusChip?: string;
  /** Colour of the status chip. Defaults to "green". */
  statusChipVariant?: "green" | "blue";
  /** Post-allocation identity — the exact unit. */
  engineNo?: string;
  chassisNo?: string;
};

function statusChipLabel(chip: string) {
  return chip.replace(/\s*✓\s*$/, "").trim();
}

function deliveryIconPath(src?: StaticImageData | string) {
  if (!src) return undefined;
  return typeof src === "string" ? src : src.src;
}

/** ACKO Drive attribution row on CarSummaryCardLite — flip to restore. */
const SHOW_CAR_SOURCE_HEADER = false;

/** Compact car card — her find, your car. */
export function CarSummaryCardLite({
  title,
  variant,
  colour,
  deliveryLine,
  deliveryLineClassName = styles.textExpress,
  deliveryStripClassName = styles.stripExpress,
  deliveryIconSrc,
  dealerName,
  dealerDetail,
  hero = "car",
  statusChip,
  statusChipVariant = "green",
  engineNo,
  chassisNo,
}: CarSummaryCardLiteProps) {
  const showHeroLayout = dealerName != null;

  if (!showHeroLayout) {
    return (
      <div className={[styles.overflow_hidden_39, "card-elevated"].filter(Boolean).join(" ")}>
        <div
          className={cn(
            styles.flex_73,
            statusChip ? styles.gap_1_74 : styles.gap_3_75
          )}
        >
          {statusChip ? (
            <span
              className={
                statusChipVariant === "blue"
                  ? styles.inline_flex_6
                  : styles.inline_flex_2
              }
            >
              {statusChipVariant === "blue" ? null : (
                <span
                  aria-hidden
                  className={styles.h_5_40}
                  style={TICK_ICON_MASK_STYLE}
                />
              )}
              {statusChipLabel(statusChip)}
            </span>
          ) : null}
          <div className={styles.flex_41}>
            <div className={styles.min_w_0_42}>
              <p className={styles.text_base_37}>{title}</p>
              <p className={styles.mt_0_5_43}>
                {variant} · {colour}
              </p>
            </div>
            <div className={styles.relative_44}>
              <Image
                src={cretaCutout}
                alt={title}
                fill
                className={styles.object_contain_1}
                unoptimized
                sizes="110px"
              />
            </div>
          </div>
        </div>
        {engineNo || chassisNo ? (
          <div className={styles.border_t_45}>
            {engineNo ? (
              <div className={styles.flex_46}>
                <span className={styles.text_sm_47}>Engine no.</span>
                <span className={styles.text_sm_10}>
                  {engineNo}
                </span>
              </div>
            ) : null}
            {chassisNo ? (
              <div className={styles.flex_46}>
                <span className={styles.text_sm_47}>Chassis no.</span>
                <span className={styles.text_sm_10}>
                  {chassisNo}
                </span>
              </div>
            ) : null}
          </div>
        ) : null}
        {deliveryLine ? (
          <div
            className={cn(
              styles.flex_76,
              deliveryStripClassName,
              deliveryLineClassName
            )}
          >
            {deliveryIconSrc ? (
              <Image
                src={deliveryIconSrc}
                alt=""
                width={14}
                height={14}
                className={styles.h_3_5_48}
                unoptimized
                aria-hidden
              />
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden className={styles.shrink_0_16}>
                <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" fill="currentColor" />
              </svg>
            )}
            <span className={styles.text_xs_49}>{deliveryLine}</span>
          </div>
        ) : null}
      </div>
    );
  }

  const showVehicleIdentification = Boolean(engineNo && chassisNo);
  const carDetails = (
    <BookingCarCardDetails
      carTitle={title}
      carVariant={variant}
      carColor={colour}
      deliveryLine={deliveryLine}
      deliveryTextClass={deliveryLineClassName}
      deliveryIconSrc={deliveryIconPath(deliveryIconSrc)}
      engineNo={engineNo}
      chassisNo={chassisNo}
    />
  );

  return (
    <div
      className={cn(
        BOOKING_CAR_CARD_SHELL_CLASS,
        showVehicleIdentification && BOOKING_CAR_HERO_HEIGHT_VIN_CLASS
      )}
    >
      {showVehicleIdentification ? <BookingCarCardBackdrop /> : null}

      {SHOW_CAR_SOURCE_HEADER ? (
        <div className={styles.relative_50}>
          <span className={styles.flex_51}>
            <Image src={ackoDriveWordmark} alt="" width={20} height={15} className={styles.h_15px__52} unoptimized />
          </span>
          <div className={styles.min_w_0_42}>
            <p className={styles.text_sm_15}>{dealerName}</p>
            {dealerDetail ? (
              <p className={styles.mt_0_5_43}>{dealerDetail}</p>
            ) : null}
          </div>
          <span
            className={
              statusChip && statusChipVariant === "blue"
                ? styles.shrink_0_7
                : styles.badgeGreen
            }
          >
            {statusChip ? statusChipLabel(statusChip) : "Reserved"}
          </span>
        </div>
      ) : null}

      {showVehicleIdentification ? (
        <>
          <div className={cn(styles.relative_0, BOOKING_CAR_HERO_HEIGHT_CLASS)}>
            <BookingCarSummaryCardVisualStage showBackdrop={false} />
          </div>
          <div className={cn(styles.relative_1, BOOKING_CAR_SUMMARY_PANEL_CLASS)}>
            {carDetails}
          </div>
        </>
      ) : (
        <div className={cn(styles.relative_2, BOOKING_CAR_HERO_HEIGHT_CLASS)}>
          <BookingCarSummaryCardVisualStage />
          <div className={cn(BOOKING_CAR_SUMMARY_PANEL_POSITION_CLASS, BOOKING_CAR_SUMMARY_PANEL_CLASS)}>
            {carDetails}
          </div>
        </div>
      )}
    </div>
  );
}
