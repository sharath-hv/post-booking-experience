import {
  getBookingDeliveryLine,
  isStandardDeliveryFlow,
  splitBookingDeliveryLine,
} from "@/lib/experience-flow-content";
import type { ExperienceFlow } from "@/lib/experience-flow";
import { normalizeAppPathname } from "@/lib/journey-routes";

/**
 * The four chapters of the journey — one source of truth for the purchase-state
 * layer (timeline, receipts) and the delivery-date pill.
 *
 * Stage map (see docs/PLAN.md spine):
 * 0 paperwork — arrival through document upload
 * 1 exact car — docs verified → dealer search → booking-accepted (OTP) / allocation-pending
 * 2 money — booking-confirmed (car reserved) through payment choose / finance in flight
 * 3 delivery — funds landed (or insurance / RTO / schedule)
 */
export type PlanStepStatus = "done" | "now" | "todo";

export type JourneyStageStep = {
  icon: "documents" | "car" | "money" | "delivery";
  title: string;
  detail: string;
  status: PlanStepStatus;
};

/** Payment beats where the car/loan funds are confirmed — money chapter is done. */
function isMoneyChapterComplete(path: string): boolean {
  return (
    path === "/payment/loan-disbursement-received" ||
    path === "/payment/full-cash-payment-confirmed" ||
    path === "/payment/self-finance-transfer-confirmed" ||
    path === "/payment/down-payment-insurance-setup"
  );
}

/**
 * Engine/chassis are on the card from booking-confirmed onward
 * (PLAN: vehicle ID after OTP — car reserved).
 */
export function isVehicleIdentificationAvailable(pathname: string): boolean {
  return resolveJourneyStageIndex(pathname) >= 2;
}

/**
 * Registration (car) number appears only after RTO completes —
 * delivery-schedule turn and later.
 */
export function isVehicleRegistrationAvailable(pathname: string): boolean {
  const path = normalizeAppPathname(pathname);
  return path.includes("car-delivery-schedule");
}

/** 0 paperwork · 1 exact car · 2 money · 3 delivery. */
export function resolveJourneyStageIndex(pathname: string): number {
  const path = normalizeAppPathname(pathname);
  if (
    path.includes("car-delivery") ||
    path.includes("insurance") ||
    isMoneyChapterComplete(path)
  ) {
    return 3;
  }
  if (path === "/payment/booking-success") return 0;
  if (path.startsWith("/payment")) return 2;
  // Car reserved (VIN on card) — exact-car chapter is done; money is next.
  if (path === "/kyc/booking-confirmed" || path === "/car-allocation/confirmed") {
    return 2;
  }
  if (
    path.startsWith("/car-allocation") ||
    path === "/kyc/processing" ||
    path === "/kyc/booking-accepted" ||
    // Docs verified (or verifying wrap) — paperwork done; exact-car is next.
    path === "/kyc/documents-received" ||
    path === "/kyc/verification-in-progress"
  ) {
    return 1;
  }
  return 0;
}

const DELIVERY_DATE_LABEL =
  /^(\d{1,2})\s+([A-Za-z]{3})\s+'(\d{2})$/;

const MONTH_INDEX: Record<string, number> = {
  Jan: 0,
  Feb: 1,
  Mar: 2,
  Apr: 3,
  May: 4,
  Jun: 5,
  Jul: 6,
  Aug: 7,
  Sep: 8,
  Oct: 9,
  Nov: 10,
  Dec: 11,
};

const MONTH_LABEL = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

/** Short date for the pill — “10 Jun” / “25 Oct”. */
export function getDeliveryDateShort(flow?: ExperienceFlow): string {
  const date = splitBookingDeliveryLine(getBookingDeliveryLine(flow))?.date ?? "";
  return date.replace(/\s*'\d+$/, "");
}

/** Full date for the layer hero — “10 Jun '25”. */
export function getDeliveryDateFull(flow?: ExperienceFlow): string {
  return splitBookingDeliveryLine(getBookingDeliveryLine(flow))?.date ?? "";
}

function parseDeliveryDateLabel(dateLabel: string): Date | null {
  const match = dateLabel.trim().match(DELIVERY_DATE_LABEL);
  if (!match) return null;
  const day = Number(match[1]);
  const month = MONTH_INDEX[match[2]!];
  const year = 2000 + Number(match[3]);
  if (!Number.isFinite(day) || month == null || !Number.isFinite(year)) return null;
  const date = new Date(year, month, day);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDeliveryDateLabel(date: Date): string {
  const yy = String(date.getFullYear()).slice(-2);
  return `${date.getDate()} ${MONTH_LABEL[date.getMonth()]} '${yy}`;
}

/**
 * Date we expect a vehicle update — two weeks before delivery.
 * Shown as a plain date; the offset is not explained in UI copy.
 */
export function getVehicleUpdateDateFull(flow?: ExperienceFlow): string {
  const deliveryLabel = getDeliveryDateFull(flow);
  const delivery = parseDeliveryDateLabel(deliveryLabel);
  if (!delivery) return deliveryLabel;
  const update = new Date(delivery);
  update.setDate(update.getDate() - 14);
  return formatDeliveryDateLabel(update);
}

type StepCopy = {
  icon: JourneyStageStep["icon"];
  title: string;
  /** Completed stages use generic copy; now/todo carry the live guidance. */
  done: string;
  now: string;
  todo: string;
};

/** Completed-stage copy is per-step — warm and specific to what actually wrapped, no SLA / outcome-specific promises. */
const STEP_COPY: readonly StepCopy[] = [
  {
    icon: "documents",
    title: "Paperwork",
    done: "Filed. Nothing more needed from you.",
    now: "Two minutes from you, Shivi files the rest",
    todo: "PAN and Aadhaar open the purchase in your name",
  },
  {
    icon: "car",
    title: "Your exact car",
    done: "Reserved and confirmed with our partner",
    now: "I'll update you as soon as I hear from our partner",
    todo: "Shivi reserves your variant and colour with our partner",
  },
  {
    icon: "money",
    title: "The money plan",
    done: "Sorted. Payment's taken care of.",
    now: "Your delivery date locks the moment this is set",
    todo: "Finance through Shivi or your own way, your pick",
  },
  {
    icon: "delivery",
    title: "To your door",
    done: "Delivered. Enjoy the drive.",
    now: "Insurance, RTO, then your doorstep",
    todo: "", // filled with the live delivery line below
  },
] as const;

/** Paperwork `now` detail — path-aware so it matches waiting-on-you vs on-track. */
function paperworkNowDetail(pathname: string): string {
  const path = normalizeAppPathname(pathname);
  if (path === "/kyc/manual-verification") {
    return "Nothing needed from you. I'll update you when there's news.";
  }
  if (path === "/kyc/verification-failed") {
    return "Re-upload so I can try verifying again";
  }
  return "Two minutes from you, Shivi files the rest";
}

/** "Your exact car" step, `now` state — path-aware so copy matches the turn. */
function exactCarNowDetail(pathname: string, flow?: ExperienceFlow): string {
  const path = normalizeAppPathname(pathname);
  if (path === "/kyc/documents-received") {
    return "I'll line up dealers as soon as verification wraps";
  }
  if (path === "/kyc/verification-in-progress") {
    return "I'm lining up dealers for your car now";
  }
  if (path === "/kyc/booking-accepted") {
    return "Share the one-time code when our partner calls";
  }
  if (
    path === "/car-allocation/failed" ||
    path === "/car-allocation/variant-unavailable"
  ) {
    return "Pick a path forward so we can keep your delivery moving";
  }
  if (path === "/car-allocation/decision-cancelled") {
    return "Your booking is cancelled. Refund is on its way";
  }
  if (path.startsWith("/car-allocation")) {
    return "Hyundai's manufacturing your exact car now";
  }
  if (isStandardDeliveryFlow(flow)) {
    return "Lining up your dealer partner now";
  }
  return "I'll update you as soon as I hear from our partner";
}

/** Money-plan `now` detail — call waits vs system waits vs choose-and-pay. */
function moneyNowDetail(pathname: string): string {
  const path = normalizeAppPathname(pathname);
  if (path === "/payment/loan-processing") {
    return "Pick up the bank's verification call and share the OTP";
  }
  if (path === "/payment/loan-under-review") {
    return "I'm chasing the bank while they process your loan";
  }
  if (
    path === "/payment/loan-sanctioned" ||
    path === "/payment/self-finance-loan-confirmed" ||
    path === "/payment/full-payment-confirmed"
  ) {
    return "Pick up the dealer's call and arrange the payment";
  }
  if (path === "/payment/loan-additional-documents") {
    return "Upload the document the bank asked for";
  }
  if (path === "/payment/car-delivery-rto-additional-documents") {
    return "Upload the document the RTO asked for";
  }
  if (
    path === "/payment/down-payment-dealer-confirmed" ||
    path === "/payment/full-cash-payment-verification" ||
    path === "/payment/self-finance-transfer-verification"
  ) {
    return "Nothing needed from you right now";
  }
  return "Your delivery date locks the moment this is set";
}

/**
 * Short focus for the waiting chip — what the user must do now, not the
 * chapter headline. Delivery chapter is "To your door" but often the ask is
 * still insurance / RTO / schedule.
 */
function waitingFocusLabel(pathname: string, nowStepTitle?: string): string {
  const path = normalizeAppPathname(pathname);
  if (
    path.includes("insurance") ||
    path === "/payment/pay-insurance-premium" ||
    path === "/payment/choose-insurance-tenure"
  ) {
    return "insurance";
  }
  if (path.includes("car-delivery-rto") || path.endsWith("/rto")) {
    return "registration";
  }
  if (path.includes("car-delivery-schedule")) {
    return "delivery date";
  }
  return (nowStepTitle ?? "this step").toLowerCase();
}

/**
 * Purchase-state chip next to Arriving — same holder as the Arrives pill.
 * No em dash; middot separates the waiting focus when it's on the user.
 */
export function getBookingStatusChipLabel(
  dateHolder: "you" | "shivi",
  nowStepTitle?: string,
  pathname?: string,
): string {
  if (dateHolder === "shivi") return "On track";
  const focus = pathname
    ? waitingFocusLabel(pathname, nowStepTitle)
    : (nowStepTitle ?? "this step").toLowerCase();
  return `Waiting on you · ${focus}`;
}

/** Timeline for the purchase-state layer, with the promise ledger in the details. */
export function getJourneyStageSteps(
  pathname: string,
  flow?: ExperienceFlow,
): JourneyStageStep[] {
  const stage = resolveJourneyStageIndex(pathname);
  return STEP_COPY.map((step, idx) => {
    const status: PlanStepStatus = idx < stage ? "done" : idx === stage ? "now" : "todo";
    let detail = step.todo || getBookingDeliveryLine(flow);
    if (status === "done") {
      detail = step.done;
    } else if (status === "now") {
      if (idx === 0) detail = paperworkNowDetail(pathname);
      else if (idx === 1) detail = exactCarNowDetail(pathname, flow);
      else if (idx === 2) detail = moneyNowDetail(pathname);
      else detail = step.now;
    }
    return { icon: step.icon, title: step.title, detail, status };
  });
}

export type JourneyReceipt = {
  title: string;
  meta: string;
};

/** Paper trail by stage — what exists so far, oldest first. */
export function getJourneyReceipts(pathname: string): JourneyReceipt[] {
  const path = normalizeAppPathname(pathname);
  const stage = resolveJourneyStageIndex(pathname);
  const receipts: JourneyReceipt[] = [
    { title: "Booking amount receipt", meta: "₹10,000 · paid" },
  ];
  if (stage >= 2) {
    receipts.push({ title: "Proforma invoice", meta: "On-road price breakup" });
  }
  // Policy only once the insurance / delivery chapter screens are in play —
  // not merely because funds landed (stage 3).
  if (path.includes("car-delivery") || path.includes("insurance")) {
    receipts.push({ title: "Insurance policy", meta: "ACKO Drive Shield · your cover" });
  }
  return receipts;
}

/** Demo download stub — replace with a real document URL when available. */
export function downloadJourneyReceipt(receipt: JourneyReceipt) {
  if (typeof document === "undefined") return;
  const slug = receipt.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const blob = new Blob(
    [`${receipt.title}\n${receipt.meta}\n\nDemo document — ACKO Drive post-booking experience.\n`],
    { type: "text/plain;charset=utf-8" },
  );
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${slug || "receipt"}-demo.txt`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
