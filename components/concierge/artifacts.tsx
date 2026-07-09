"use client";

import Image, { type StaticImageData } from "next/image";
import type { CSSProperties } from "react";

import cretaCutout from "@/assets/Hyundai Creta.png";
import carIcon from "@/assets/Car.svg";
import identityIcon from "@/assets/Identity.svg";
import moneyRoundIcon from "@/assets/Money round.svg";
import newCarIcon from "@/assets/New car.svg";
import phoneIcon from "@/assets/Phone.svg";
import tickIcon from "@/assets/tick.svg";
import { ShimmerInfoCard } from "@/components/ui/ShimmerInfoCard";
import { cn } from "@/lib/utils";

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
  green: "bg-[#e7f6ee] text-[#0c7a42]",
  amber: "bg-[#fff7e5] text-[#a76406]",
  grey:  "bg-[#f5f5f5] text-[#757575]",
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
  /** Tailwind bg class for the icon container (overrides the green / yellow default). */
  iconBgClassName?: string;
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
}: AmountReceivedCardProps) {
  const processing = status === "processing";
  const defaultBg = processing ? "bg-[#fff7e5]" : "bg-[#e7f6ee]";
  return (
    <div className="overflow-hidden rounded-2xl bg-white card-elevated">
      <div className="flex items-center gap-3 px-4 py-4">
        <span
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors duration-300",
            iconBgClassName ?? defaultBg,
          )}
        >
          {iconSrc ? (
            <Image src={iconSrc} alt="" width={20} height={20} className="object-contain" unoptimized />
          ) : processing ? (
            <span
              className="h-5 w-5 animate-spin rounded-full border-2 border-[#f0ddb0] border-t-[#a76406]"
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
        <div className="min-w-0">
          <p className="text-xl font-semibold leading-7 tracking-[-0.2px] text-[#121212] tabular-nums">
            {formatInr(amountInr)}
          </p>
          <p className="text-xs leading-[18px] text-[#757575]">{title}</p>
        </div>
      </div>
      {rows?.length ? (
        <div className="border-t border-dashed border-[#e8e8e8] px-4 py-4">
          {rows.map((row, i) => (
            <div
              key={row.label}
              className={cn(
                "flex items-center justify-between gap-3",
                i > 0 && "border-t border-dashed border-[#efefef] pt-3",
                i < rows.length - 1 && "pb-3",
              )}
            >
              <span className="flex min-w-0 items-center gap-1.5 text-sm leading-5 text-[#4b4b4b]">
                {row.label}
                {row.tag ? (
                  <span
                    className={cn(
                      "shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium leading-4",
                      ROW_TAG_CLASS[row.tag.variant],
                    )}
                  >
                    {row.tag.text}
                  </span>
                ) : null}
              </span>
              <span className="text-sm font-medium leading-5 text-[#121212] tabular-nums">
                {row.value}
              </span>
            </div>
          ))}
        </div>
      ) : null}
      {note ? (
        <div className="border-t border-[#f0f0f0] bg-[#fafafa] px-4 py-2.5">
          <p className="text-xs leading-[18px] text-[#757575]">{note}</p>
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
      className={cn("shrink-0", className)}
      unoptimized
      aria-hidden
    />
  );
}

export type PlanListProps = {
  items: readonly PlanItem[];
};

/**
 * “Here's how I'll get you your car” — her commitments as a timeline:
 * icon nodes on a dashed rail, the live step filled in brand purple as “Now”.
 */
export function PlanList({ items }: PlanListProps) {
  return (
    <ol className="flex flex-col rounded-2xl bg-white card-elevated px-4 py-5">
      {items.map((item, idx) => {
        const status = item.status ?? (idx === 0 ? "now" : "todo");
        const isNow = status === "now";
        const isDone = status === "done";
        const isLast = idx === items.length - 1;
        return (
          <li key={item.title} className="flex items-start gap-3.5">
            <span className="flex self-stretch shrink-0 flex-col items-center">
              <span
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                  isNow
                    ? "mt-5 bg-[#5920c5] text-white ring-4 ring-[#efe9fb]"
                    : isDone
                      ? "bg-[#e7f6ee] text-[#0fa457]"
                      : "bg-[#f5f5f5] text-[#8f8e92]"
                )}
              >
                <PlanTimelineGlyph name={item.icon} className={isNow ? "brightness-0 invert" : undefined} />
              </span>
              {!isLast ? (
                <span
                  className={cn(
                    "w-px flex-1 border-l border-dashed",
                    isNow
                      ? "mb-1 mt-2 border-[#cdb7f0]"
                      : isDone
                        ? "my-1 border-[#bfe5cb]"
                        : "my-1 border-[#dcdbe1]"
                  )}
                  aria-hidden
                />
              ) : null}
            </span>
            <div className={cn("min-w-0", isNow && "pt-0.5", !isLast && "pb-6")}>
              {isNow ? (
                <p className="mb-1 text-[10px] font-semibold uppercase leading-4 tracking-[0.08em] text-[#5920c5]">
                  Now
                </p>
              ) : null}
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-medium leading-5 text-[#121212]">{item.title}</p>
                {isDone ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden className="shrink-0">
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
              <p
                className={cn(
                  "mt-1 text-[13px] leading-[19px]",
                  isDone ? "text-[#0c7a42]" : "text-[#757575]"
                )}
              >
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
  /** Price-lock amount already paid. */
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
 * The price identity, visible: lock + disbursement + insurance + down payment
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
    <div className="overflow-hidden rounded-2xl bg-white card-elevated text-left">
      <div className="flex items-center justify-between gap-3 border-b border-[#e8e8e8] bg-[#fafafa] px-4 py-3">
        <span className="text-sm font-medium leading-5 text-[#121212]">Your locked price</span>
        <span className="text-sm font-semibold leading-5 text-[#121212] tabular-nums">
          {formatInr(totalInr)}
        </span>
      </div>

      <div className="flex flex-col px-4 py-1">
        <div className="flex items-center justify-between gap-3 py-3">
          <span className="flex min-w-0 items-center gap-1.5 text-sm leading-5 text-[#4b4b4b]">
            Price lock
            <span className="shrink-0 rounded-full bg-[#e7f6ee] px-2 py-0.5 text-[11px] font-medium leading-4 text-[#0c7a42]">
              Paid ✓
            </span>
          </span>
          <span className="text-sm font-medium leading-5 text-[#757575] tabular-nums">
            − {formatInr(bookingPaidInr)}
          </span>
        </div>

        {disbursementLabel != null && disbursementInr != null ? (
          <div className="flex items-center justify-between gap-3 border-t border-dashed border-[#efefef] py-3">
            <span className="flex min-w-0 items-center gap-1.5 text-sm leading-5 text-[#4b4b4b]">
              {disbursementLabel}
              <span className="shrink-0 rounded-full bg-[#f5f5f5] px-2 py-0.5 text-[11px] font-medium leading-4 text-[#757575]">
                Bank → dealer
              </span>
            </span>
            <span className="text-sm font-medium leading-5 text-[#757575] tabular-nums">
              − {formatInr(disbursementInr)}
            </span>
          </div>
        ) : null}

        <div className="flex items-center justify-between gap-3 border-t border-dashed border-[#efefef] py-3">
          <span className="flex min-w-0 items-center gap-1.5 text-sm leading-5 text-[#4b4b4b]">
            Insurance
            <span className="shrink-0 rounded-full bg-[#fff7e5] px-2 py-0.5 text-[11px] font-medium leading-4 text-[#a76406]">
              Later · before delivery
            </span>
          </span>
          <span className="text-sm font-medium leading-5 text-[#757575] tabular-nums">
            − {formatInr(insuranceInr)}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-[#e3d9fa] bg-[#f9f6ff] px-4 py-3.5">
        <span className="text-sm font-semibold leading-5 text-[#5920c5]">{dueLabel}</span>
        <span className="text-base font-semibold leading-6 text-[#5920c5] tabular-nums">
          = {formatInr(dueInr)}
        </span>
      </div>

      <div className="border-t border-[#f0f0f0] bg-[#fafafa] px-4 py-2.5">
        <p className="text-xs leading-[18px] text-[#757575]">
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
  /** Tight imperative — e.g. “Pick up Advaith Hyundai's call”. */
  title: string;
  body: string;
  /** Expectation row — e.g. “Expected today, before 6:00 PM”. */
  etaLabel?: string;
};

/**
 * The user's single pending action. Action grammar: elevated white card with a
 * slow radar pulse on the node — something is coming for you. Stakes go in a
 * ShimmerInfoCard next to it, not in here.
 */
export function NextStepCard({ title, body }: NextStepCardProps) {
  return (
    <div className="rounded-2xl bg-white card-elevated px-4 py-4">
      <div className="flex items-start gap-3.5">
        <span className="relative flex h-9 w-9 shrink-0 items-center justify-center">
          <span
            aria-hidden
            className="absolute inset-0 animate-ping rounded-full bg-[#0fa457]/20 [animation-duration:2.4s] motion-reduce:hidden"
          />
          <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-[#0fa457] text-white ring-4 ring-[#dcfce7]">
            <Image
              src={phoneIcon}
              alt=""
              width={20}
              height={20}
              className="shrink-0 brightness-0 invert"
              unoptimized
              aria-hidden
            />
          </span>
        </span>
        <div className="min-w-0">
          <p className="text-base font-medium leading-6 text-[#121212]">{title}</p>
          <p className="mt-1 text-[13px] leading-[19px] text-[#757575]">{body}</p>
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

/** Compact car card — her find, your car. */
export function CarSummaryCardLite({
  title,
  variant,
  colour,
  deliveryLine,
  deliveryLineClassName = "text-[#5920c5]",
  dealerName,
  dealerDetail,
  hero = "car",
  statusChip,
  statusChipVariant = "green",
  engineNo,
  chassisNo,
}: CarSummaryCardLiteProps) {
  const dealerLeads = hero === "dealer" && dealerName != null;
  return (
    <div className="overflow-hidden rounded-2xl bg-white card-elevated">
      {dealerLeads ? (
        <>
          <div className="flex items-start gap-3 px-4 py-3.5">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium leading-5 text-[#121212]">{dealerName}</p>
              {dealerDetail ? (
                <p className="mt-0.5 text-xs leading-[18px] text-[#757575]">{dealerDetail}</p>
              ) : null}
            </div>
            <span className="inline-flex h-6 w-fit shrink-0 items-center gap-1 rounded-full bg-[#e7f6ee] px-2 text-[11px] font-medium leading-4 text-[#0c7a42]">
              <span
                aria-hidden
                className="h-5 w-5 shrink-0 bg-[#0c7a42] [mask-size:contain] [mask-repeat:no-repeat] [mask-position:center] [-webkit-mask-size:contain] [-webkit-mask-repeat:no-repeat] [-webkit-mask-position:center]"
                style={TICK_ICON_MASK_STYLE}
              />
              Reserved
            </span>
          </div>
          <div className="flex items-center gap-3 border-t border-[#f0f0f0] bg-white px-4 py-3">
            <div className="relative h-[48px] w-[84px] shrink-0">
              <Image
                src={cretaCutout}
                alt={title}
                fill
                className="object-contain"
                unoptimized
                sizes="84px"
              />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold leading-5 text-[#121212]">{title}</p>
              <p className="mt-0.5 text-xs leading-[18px] text-[#757575]">
                {variant} · {colour}
              </p>
            </div>
          </div>
        </>
      ) : (
        <>
          <div
            className={cn(
              "flex flex-col px-4",
              statusChip ? "gap-1 pt-3.5 pb-3.5" : "gap-3 py-3.5"
            )}
          >
            {statusChip ? (
              <span
                className={
                  statusChipVariant === "blue"
                    ? "inline-flex h-6 w-fit items-center rounded-full bg-[#e8f0fe] px-2 py-1 text-[11px] font-medium leading-4 text-[#1a56db]"
                    : "inline-flex h-6 w-fit items-center gap-1 rounded-full bg-[#e7f6ee] px-2 py-1 text-[11px] font-medium leading-4 text-[#0c7a42]"
                }
              >
                {statusChipVariant === "blue" ? null : (
                  <span
                    aria-hidden
                    className="h-5 w-5 shrink-0 bg-[#0c7a42] [mask-size:contain] [mask-repeat:no-repeat] [mask-position:center] [-webkit-mask-size:contain] [-webkit-mask-repeat:no-repeat] [-webkit-mask-position:center]"
                    style={TICK_ICON_MASK_STYLE}
                  />
                )}
                {statusChipLabel(statusChip)}
              </span>
            ) : null}
            <div className="flex items-center gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-base font-semibold leading-6 text-[#121212]">{title}</p>
                <p className="mt-0.5 text-xs leading-[18px] text-[#757575]">
                  {variant} · {colour}
                </p>
              </div>
              <div className="relative h-[64px] w-[110px] shrink-0">
                <Image
                  src={cretaCutout}
                  alt={title}
                  fill
                  className="object-contain"
                  unoptimized
                  sizes="110px"
                />
              </div>
            </div>
          </div>
          {dealerName ? (
            <div className="flex flex-wrap items-baseline gap-x-1.5 border-t border-dashed border-[#ececec] px-4 py-2.5">
              <span className="text-sm font-medium leading-5 text-[#121212]">{dealerName}</span>
              {dealerDetail ? (
                <span className="text-xs leading-[18px] text-[#757575]">· {dealerDetail}</span>
              ) : null}
            </div>
          ) : null}
        </>
      )}
      {engineNo || chassisNo ? (
        <div className="border-t border-dashed border-[#e8e8e8] px-4 py-3">
          {engineNo ? (
            <div className="flex items-center justify-between gap-3 py-1">
              <span className="text-sm leading-5 text-[#4b4b4b]">Engine no.</span>
              <span className="text-sm font-medium leading-5 text-[#121212] tabular-nums">
                {engineNo}
              </span>
            </div>
          ) : null}
          {chassisNo ? (
            <div className="flex items-center justify-between gap-3 py-1">
              <span className="text-sm leading-5 text-[#4b4b4b]">Chassis no.</span>
              <span className="text-sm font-medium leading-5 text-[#121212] tabular-nums">
                {chassisNo}
              </span>
            </div>
          ) : null}
        </div>
      ) : null}
      {deliveryLine ? (
        <div
          className={cn(
            "flex items-center justify-center gap-1.5 border-t border-[#efe9fb] bg-[#f9f6ff] px-4 py-2",
            deliveryLineClassName
          )}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden className="shrink-0">
            <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" fill="currentColor" />
          </svg>
          <span className="text-xs font-medium leading-[18px]">{deliveryLine}</span>
        </div>
      ) : null}
    </div>
  );
}
