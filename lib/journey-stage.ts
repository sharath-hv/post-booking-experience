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
 * 0 paperwork — arrival through KYC
 * 1 exact car — dealer search → booking-accepted (OTP) / allocation-pending
 * 2 money — booking-confirmed (car reserved) through payment choose / finance
 * 3 delivery — insurance / RTO / schedule
 */
export type PlanStepStatus = "done" | "now" | "todo";

export type JourneyStageStep = {
  icon: "documents" | "car" | "money" | "delivery";
  title: string;
  detail: string;
  status: PlanStepStatus;
};

/**
 * Engine/chassis are on the card from booking-confirmed onward
 * (PLAN: vehicle ID after OTP — car reserved).
 */
export function isVehicleIdentificationAvailable(pathname: string): boolean {
  return resolveJourneyStageIndex(pathname) >= 2;
}

/** 0 paperwork · 1 exact car · 2 money · 3 delivery. */
export function resolveJourneyStageIndex(pathname: string): number {
  const path = normalizeAppPathname(pathname);
  if (path.includes("car-delivery") || path.includes("insurance")) return 3;
  if (path === "/payment/booking-success") return 0;
  if (path.startsWith("/payment")) return 2;
  // Car reserved (VIN on card) — exact-car chapter is done; money is next.
  if (path === "/kyc/booking-confirmed" || path === "/car-allocation/confirmed") {
    return 2;
  }
  if (
    path.startsWith("/car-allocation") ||
    path === "/kyc/processing" ||
    path === "/kyc/booking-accepted"
  ) {
    return 1;
  }
  return 0;
}

/** Short date for the pill — “10 Jun” / “25 Oct”. */
export function getDeliveryDateShort(flow?: ExperienceFlow): string {
  const date = splitBookingDeliveryLine(getBookingDeliveryLine(flow))?.date ?? "";
  return date.replace(/\s*'\d+$/, "");
}

/** Full date for the layer hero — “10 Jun '25”. */
export function getDeliveryDateFull(flow?: ExperienceFlow): string {
  return splitBookingDeliveryLine(getBookingDeliveryLine(flow))?.date ?? "";
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

/** "Your exact car" step, `now` state — path-aware so copy matches the turn. */
function exactCarNowDetail(pathname: string, flow?: ExperienceFlow): string {
  const path = normalizeAppPathname(pathname);
  if (path === "/kyc/booking-accepted") {
    return "Share the one-time code when our partner calls";
  }
  if (path.startsWith("/car-allocation")) {
    return "Hyundai's manufacturing your exact car now";
  }
  if (isStandardDeliveryFlow(flow)) {
    return "Lining up your dealer partner now";
  }
  return "I'll update you as soon as I hear from our partner";
}

/** Timeline for the purchase-state layer, with the promise ledger in the details. */
export function getJourneyStageSteps(
  pathname: string,
  flow?: ExperienceFlow,
): JourneyStageStep[] {
  const stage = resolveJourneyStageIndex(pathname);
  return STEP_COPY.map((step, idx) => {
    const status: PlanStepStatus = idx < stage ? "done" : idx === stage ? "now" : "todo";
    const detail =
      status === "done"
        ? step.done
        : status === "now"
          ? idx === 1
            ? exactCarNowDetail(pathname, flow)
            : step.now
          : step.todo || getBookingDeliveryLine(flow);
    return { icon: step.icon, title: step.title, detail, status };
  });
}

export type JourneyReceipt = {
  title: string;
  meta: string;
};

/** Paper trail by stage — what exists so far, oldest first. */
export function getJourneyReceipts(pathname: string): JourneyReceipt[] {
  const stage = resolveJourneyStageIndex(pathname);
  const receipts: JourneyReceipt[] = [
    { title: "Booking amount receipt", meta: "₹10,000 · paid" },
  ];
  if (stage >= 2) {
    receipts.push({ title: "Proforma invoice", meta: "On-road price breakup" });
  }
  if (stage >= 3) {
    receipts.push({ title: "Insurance policy", meta: "ACKO Drive Shield · zero dep" });
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
