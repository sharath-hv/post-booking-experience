import {
  BOOKING_CAR_COLOR,
  BOOKING_CAR_TITLE,
  BOOKING_CAR_VARIANT,
} from "@/lib/booking-car-card-content";
import type { ExperienceFlow } from "@/lib/experience-flow";
import { isStandardDeliveryFlow } from "@/lib/experience-flow-content";
import { EARLY_STANDARD_DELIVERY_LINE } from "@/lib/concierge/early-delivery";
import {
  BOOKING_STANDARD_DELIVERY_LINE,
  splitBookingDeliveryLine,
} from "@/lib/experience-flow-content";
import { getDeliveryDateShort, getVehicleUpdateDateFull } from "@/lib/journey-stage";
import { BOOKING_PAYMENT_SUMMARY_INR } from "@/lib/payment-summary-demo";

/**
 * Shivi's script — every word she says on the converted journey, in one place.
 *
 * Voice rules:
 * - First person singular. She did it, she's doing it, she'll do it.
 * - Each turn says at most three things: what just happened, what she's doing,
 *   what she needs (or when she'll be back).
 * - COLD-OPEN RULE: the journey plays out over days, so every turn must read
 *   correctly to someone who just reopened the app — lead lines are standalone
 *   news ("Your Creta is reserved in your name."), never reactions ("Done —")
 *   unless the user acted seconds ago on the previous screen. Stamps are real
 *   dates with event anchors ("Wed 23 Apr · after the dealer's call") — never
 *   journey bookkeeping like "Day 1"; omit them when no time has passed.
 *   Day-boundary turns greet the return ("Morning, Sharath —", "Welcome back —").
 * - Never the word "booking". Express: the user paid and the price is locked.
 *   Standard: the booking amount is in and the car goes into the queue. Money
 *   gets sorted, the car arrives.
 */

export type ConciergeMomentId =
  | "arrival"
  | "documentsReceived"
  | "manualVerification"
  | "verificationInProgress"
  | "dealerSearch"
  | "dealerFound"
  | "carReserved"
  | "allocationPending"
  | "earlyDeliveryOffer"
  | "earlyDeliveryConfirming"
  | "earlyDeliveryKept"
  | "allocationDone"
  | "moneyIntro";

export type ConciergeCarRef = {
  title: string;
  variant: string;
  colour: string;
};

/** Optional context so turns stay connected after a selection change. */
export type TurnWordsContext = {
  car?: ConciergeCarRef;
  /** True when `/kyc/processing` (etc.) follows a completed modify-selection pay. */
  afterSelectionChange?: boolean;
  /**
   * User accepted early delivery — confirmed turn after the confirming beat
   * (`?early=1`). Delivery line override is already written.
   */
  earlyAllocation?: boolean;
  /**
   * Early delivery landed with a different partner — OTP again on
   * `/kyc/booking-accepted?earlyDealer=1`.
   */
  earlyDealerChange?: boolean;
};

export type TurnWords = {
  /** Conversation date divider — real date + event anchor, e.g. “Wed 23 Apr · morning”. */
  dayStamp?: string;
  /** Her lines, in speaking order. First line is the lead. */
  says: readonly string[];
  /** Visible activity lines for working turns. */
  workingLines?: readonly string[];
  /**
   * `live` (default) — quick system actions that finish while you watch.
   * `ongoing` — real-world work (dealers, registries) that takes hours/days:
   * first line spins, the rest queue, nothing fake-completes; results are
   * reported on the NEXT turn after time passes.
   */
  workingMode?: "live" | "ongoing";
  workingDoneLabel?: string;
  /** Ongoing mode — lines before this index render done (already happened). */
  workingDoneCount?: number;
  /** Expectation row for ongoing work — when she'll have news. */
  workingEtaLabel?: string;
  /** Primary reply — the user's words back to her. */
  replyLabel?: string;
  /** Echo shown on the next turn (defaults to replyLabel). */
  replyEcho?: string;
  /** Demo time travel label — e.g. “Next morning”. */
  timeSkipLabel?: string;
  /** Orange commitment line (deadlines, expectations). */
  footnote?: string;
  /** Semibold prefix for the footnote card, e.g. “A quick heads-up:”. */
  footnoteLead?: string;
  /** Contextual call affordance under the replies. */
  callLabel?: string;
};

const DEFAULT_CAR: ConciergeCarRef = {
  title: BOOKING_CAR_TITLE,
  variant: BOOKING_CAR_VARIANT,
  colour: BOOKING_CAR_COLOR,
};

/** “Hyundai Creta” → “Creta”; other titles stay as given. */
export function carFamiliarName(title: string): string {
  const trimmed = title.trim();
  const hyundai = trimmed.match(/^Hyundai\s+(.+)$/i);
  if (hyundai?.[1]) return hyundai[1];
  return trimmed;
}

/** e.g. “your exact Creta, the 1.5 X-Line AT Diesel in Starry Night” */
export function exactCarClause(car: ConciergeCarRef): string {
  return `your exact ${carFamiliarName(car.title)}, the ${car.variant} in ${car.colour}`;
}

/**
 * Identity turn (`/kyc`) — bespoke screen with the upload interaction inline
 * (`ConciergeVerifyIdentityScreen`), so its words live here but outside the
 * moment map.
 */
export const VERIFY_IDENTITY_WORDS: TurnWords = {
  says: [
    "Just two documents, Sharath: your PAN and Aadhaar.",
    "These are what your invoice and registration are issued against. Add them below and I'll take care of the rest.",
  ],
  replyLabel: "Here are my documents",
  replyEcho: "Documents sent",
  callLabel: "Stuck? I can call you",
};

const EXPRESS_ARRIVAL: TurnWords = {
  says: [
    "Hi Sharath, I'm Shivi. Your payment is in and your price is locked.",
    "You're almost there. One short paperwork step comes next, then I can lock in your delivery date.",
    "Here's how the next few days look",
  ],
  replyLabel: "Let's do the paper work",
  replyEcho: "Let's do the paper work",
  footnote: "Finish the paperwork before time runs out — or I'll cancel this booking.",
};

const STANDARD_ARRIVAL: TurnWords = {
  says: [
    "Hi Sharath, I'm Shivi. Your booking amount is in.",
    "You're almost there. One short paperwork step comes next — then I'll get your Creta into the queue.",
    "Here's what happens next",
  ],
  replyLabel: "Let's do the paper work",
  replyEcho: "Let's do the paper work",
  footnote: "Finish the paperwork before time runs out — or I'll cancel this booking.",
};

/** Arrival lead — identical before and after payment so the headline never reflows. */
export function getArrivalLeadPaid(flow: ExperienceFlow): string {
  return (isStandardDeliveryFlow(flow) ? STANDARD_ARRIVAL : EXPRESS_ARRIVAL).says[0]!;
}

const DEALER_SEARCH_FOOTNOTE_LEAD = "A quick heads-up";
/** Fees kick in after this turn — once a partner is locked on the next step. */
const DEALER_SEARCH_FOOTNOTE =
  "From the next step, changing your pick costs ₹5,000, and if you cancel, half your booking amount stays with us.";

/**
 * Standard — lining up a dealer partner is still a real-world wait (hours).
 * Clocking state on this turn; demo skip advances to dealer found.
 */
function standardDealerSearch(
  car: ConciergeCarRef,
  afterSelectionChange: boolean,
): TurnWords {
  const exact = exactCarClause(car);
  const familiar = carFamiliarName(car.title);

  return {
    says: afterSelectionChange
      ? [
          "Change locked in, Sharath.",
          `I'm lining up a dealer partner for ${exact}. I'll update you once one's confirmed.`,
        ]
      : [
          "That's the paperwork done, Sharath.",
          `I'm lining up a dealer partner for ${exact}. I'll update you once one's confirmed.`,
        ],
    workingLines: [
      "Checking nearby partners",
      `Finding the right partner for your ${familiar}`,
    ],
    workingMode: "ongoing",
    workingEtaLabel: "Usually a few hours. I'll message you when a partner is confirmed.",
    timeSkipLabel: "Partner assigned",
    callLabel: "Questions? I can call you",
    footnoteLead: DEALER_SEARCH_FOOTNOTE_LEAD,
    footnote: DEALER_SEARCH_FOOTNOTE,
  };
}

function expressDealerSearch(
  car: ConciergeCarRef,
  afterSelectionChange: boolean,
): TurnWords {
  const exact = exactCarClause(car);

  return {
    says: afterSelectionChange
      ? [
          "Change locked in, Sharath.",
          `Now I'm reaching out to dealers for ${exact}. They usually take a few hours to confirm stock. I'll let you know the moment I hear back.`,
        ]
      : [
          "That's the paperwork done, Sharath.",
          `Now I'm reaching out to dealers for ${exact}. They usually take a few hours to confirm stock. I'll let you know the moment I hear back.`,
        ],
    workingLines: [
      "Reaching out to dealers near you",
      `Checking stock for your ${car.variant} in ${car.colour}`,
      "Finding who can deliver soonest",
    ],
    workingMode: "ongoing",
    workingEtaLabel: "I'll update you as soon as I have news",
    timeSkipLabel: "Next morning",
    callLabel: "Can't sleep on it? I can call you",
    footnoteLead: DEALER_SEARCH_FOOTNOTE_LEAD,
    footnote: DEALER_SEARCH_FOOTNOTE,
  };
}

function dealerFoundWords(
  car: ConciergeCarRef,
  afterSelectionChange: boolean,
  /** Standard: build-to-order. Express: stock reserved. */
  isStandard: boolean,
): TurnWords {
  const familiar = carFamiliarName(car.title);
  const lead = afterSelectionChange
    ? "Found a match for your new pick, Sharath."
    : "Found a match, Sharath.";
  const body = isStandard
    ? `Hyundai will build a fresh ${familiar} just for you. Share the one-time code when our partner calls. Once it's verified, Hyundai can start building.`
    : `I've reserved a fresh ${familiar} for you. Share the one-time code when our partner calls. I'll put your car's details on the card once the code is verified.`;

  return {
    says: [lead, body],
    timeSkipLabel: "After the call",
    callLabel: "Questions? I can call you",
  };
}

function formatAmountToPay(): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(BOOKING_PAYMENT_SUMMARY_INR.amountToPayInr);
}

/** Shared payment body after the car is assigned (OTP or build-complete). */
function paymentHandoffBody(): string {
  return `Engine and chassis are on the card. Next up: pay the remaining ${formatAmountToPay()}. Finance through me, or arrange it yourself.`;
}

function paymentHandoffCta(): Pick<TurnWords, "replyLabel" | "replyEcho" | "callLabel"> {
  return {
    replyLabel: "Show me my payment options",
    replyEcho: "Show me my payment options",
    callLabel: "Rather talk it through? I can call you",
  };
}

function carReservedWords(car: ConciergeCarRef): TurnWords {
  const familiar = carFamiliarName(car.title);

  return {
    says: [
      `Your code checked out, Sharath. This ${familiar} is assigned to you.`,
      paymentHandoffBody(),
    ],
    ...paymentHandoffCta(),
  };
}

const EXPRESS_SCRIPT: Record<ConciergeMomentId, TurnWords> = {
  arrival: EXPRESS_ARRIVAL,

  documentsReceived: {
    says: [
      "Got your documents, Sharath. I'm verifying them now.",
      "This won't take long.",
    ],
    workingLines: [
      "Reading your PAN",
      "Matching your Aadhaar details",
      "Checking your name and address",
    ],
    workingDoneLabel: "Verified. Booking is now open in your name.",
    replyLabel: "What's next?",
    replyEcho: "What's next?",
    callLabel: "Questions? I can call you",
  },

  /** kyc_failed demo branch — OCR can't auto-resolve; a human reviews offline. */
  manualVerification: {
    says: [
      "Got your documents, Sharath. I'm verifying them now.",
      "This won't take long.",
    ],
    workingLines: [
      "Reading your PAN",
      "Matching your Aadhaar details",
      "Checking your name and address",
    ],
    workingDoneLabel: "Taking a bit longer. I'll let you know when they're through.",
    callLabel: "Questions while you wait? I can call you",
    timeSkipLabel: "A little later",
  },

  /** Off the main path — the cancel-no-charges demo parks here (cancel via the ⋮ menu). */
  verificationInProgress: {
    says: [
      "All set — your paperwork cleared.",
      "I'm lining up dealers for your Creta now. Need anything meanwhile — a change, a question, even cancelling? The ⋮ menu up top has it all.",
    ],
    timeSkipLabel: "A little later",
    callLabel: "Questions? I can call you",
  },

  /** Built dynamically via {@link getTurnWords} — placeholder for the record type. */
  dealerSearch: expressDealerSearch(DEFAULT_CAR, false),
  dealerFound: dealerFoundWords(DEFAULT_CAR, false, false),
  carReserved: carReservedWords(DEFAULT_CAR),

  /** Standard-only in practice — express never routes here (see `dealerFound`'s time-skip). */
  allocationPending: {
    says: [
      "Your code checked out, Sharath.",
      "This Creta is confirmed. Our partner's opened it on Hyundai's system, and your exact Creta now goes into manufacturing. Nothing needed from you until it's built.",
    ],
    workingLines: [
      "Confirmed with our partner on Hyundai's system",
      "Building your Creta, fresh off the line",
    ],
    workingMode: "ongoing",
    workingDoneCount: 1,
    timeSkipLabel: "A few months later",
    callLabel: "Questions while it's built? I can call you",
  },

  /** Standard-only in practice — the manufacturing reveal, mirrors `carReserved`'s payment hand-off. */
  allocationDone: {
    says: [
      "Your Creta is built, Sharath. It's assigned to you.",
      paymentHandoffBody(),
    ],
    ...paymentHandoffCta(),
  },

  /** Standard demo — car ready early; user chooses early vs original date. */
  earlyDeliveryOffer: {
    says: [
      "Good news, Sharath. Your Creta is ready earlier than we planned.",
      "Would you like early delivery, or keep your original delivery date?",
    ],
    callLabel: "Want to talk it through? I can call you",
  },

  /** Standard demo — partner confirmation after the user opts into early delivery. */
  earlyDeliveryConfirming: {
    says: [
      "On it, Sharath. I'm confirming early delivery with our partner.",
      "I'll message you once the earlier slot is locked in. Nothing needed from you right now.",
    ],
    workingLines: [
      "Checking unit availability",
      "Confirming the earlier delivery slot with our partner",
    ],
    workingMode: "ongoing",
    workingDoneCount: 1,
    workingEtaLabel: "Usually confirmed within a few hours",
    callLabel: "Questions while you wait? I can call you",
  },

  /**
   * Standard demo — user kept the original date after an early-ready offer;
   * manufacturing wait resumes (same shape as allocationPending).
   */
  earlyDeliveryKept: {
    says: [
      "Understood, Sharath. We'll stick with your original delivery date.",
      "Your Creta stays in manufacturing. Nothing needed from you until it's built.",
    ],
    workingLines: [
      "Keeping your original delivery date",
      "Building your Creta, fresh off the line",
    ],
    workingMode: "ongoing",
    workingDoneCount: 1,
    timeSkipLabel: "A few months later",
    callLabel: "Questions while it's built? I can call you",
  },

  /**
   * Legacy alias — `/payment/default` redirects to choose. Kept so the moment
   * id still type-checks if anything references it.
   */
  moneyIntro: {
    says: [
      "Let's sort out the payment, Sharath.",
      `Next up: pay the remaining ${formatAmountToPay()}. Finance through me, or arrange it yourself.`,
    ],
    ...paymentHandoffCta(),
  },
};

function moneyIntroFootnote(flow: ExperienceFlow): string {
  const date = getDeliveryDateShort(flow);
  return `Your ${date} delivery holds once payment is set up. Every day this waits moves it back.`;
}

function allocationPendingEta(flow: ExperienceFlow): string {
  // Vehicle update lands ~2 weeks before delivery — date only, no offset explained.
  return `Next vehicle update by ${getVehicleUpdateDateFull(flow)}`;
}

/** Words for a turn — most moments share copy; flow-specific overrides live here. */
export function getTurnWords(
  moment: ConciergeMomentId,
  flow: ExperienceFlow,
  context?: TurnWordsContext,
): TurnWords {
  const car = context?.car ?? DEFAULT_CAR;
  const afterSelectionChange = context?.afterSelectionChange === true;

  if (moment === "arrival") {
    return isStandardDeliveryFlow(flow) ? STANDARD_ARRIVAL : EXPRESS_ARRIVAL;
  }

  if (moment === "dealerSearch") {
    return isStandardDeliveryFlow(flow)
      ? standardDealerSearch(car, afterSelectionChange)
      : expressDealerSearch(car, afterSelectionChange);
  }

  if (moment === "dealerFound") {
    if (context?.earlyDealerChange) {
      return {
        says: [
          "Verify to lock in your earlier delivery, Sharath.",
          "Share the one-time code when our partner calls. Once it's verified, your earlier delivery date is confirmed.",
        ],
        timeSkipLabel: "After the call",
        callLabel: "Questions? I can call you",
      };
    }
    return dealerFoundWords(car, afterSelectionChange, isStandardDeliveryFlow(flow));
  }

  if (moment === "carReserved") {
    return { ...carReservedWords(car), footnote: moneyIntroFootnote(flow) };
  }

  const base = EXPRESS_SCRIPT[moment];
  if (moment === "moneyIntro") {
    return { ...base, footnote: moneyIntroFootnote(flow) };
  }
  if (moment === "allocationPending") {
    const familiar = carFamiliarName(car.title);
    return {
      ...base,
      says: [
        "Your code checked out, Sharath.",
        `This ${familiar} is confirmed. Our partner's opened it on the system, and your exact ${familiar} now goes into manufacturing. Nothing needed from you until it's built.`,
      ],
      workingLines: [
        "Confirmed with our partner on the system",
        `Building your ${familiar}, fresh off the line`,
      ],
      workingEtaLabel: allocationPendingEta(flow),
    };
  }
  if (moment === "earlyDeliveryOffer") {
    const familiar = carFamiliarName(car.title);
    // Always the catalogue standard date — not a prior early-accept override.
    const originalDate =
      splitBookingDeliveryLine(BOOKING_STANDARD_DELIVERY_LINE)?.date.replace(/\s*'\d+$/, "") ??
      "25 Oct";
    return {
      ...base,
      says: [
        `Good news, Sharath. Your ${familiar} is ready earlier than we planned.`,
        `Would you like early delivery, or keep your original date of ${originalDate}?`,
      ],
      callLabel: "Want to talk it through? I can call you",
    };
  }

  if (moment === "earlyDeliveryConfirming") {
    return {
      ...base,
      says: [
        "On it, Sharath. I'm confirming early delivery with our partner.",
        "I'll message you once the earlier slot is locked in. Nothing needed from you right now.",
      ],
      workingLines: [
        "Checking unit availability",
        "Confirming the earlier delivery slot with our partner",
      ],
      workingMode: "ongoing",
      workingDoneCount: 1,
      workingEtaLabel: "Usually confirmed within a few hours",
      callLabel: "Questions while you wait? I can call you",
    };
  }

  if (moment === "earlyDeliveryKept") {
    const familiar = carFamiliarName(car.title);
    const originalDate =
      splitBookingDeliveryLine(BOOKING_STANDARD_DELIVERY_LINE)?.date.replace(/\s*'\d+$/, "") ??
      "25 Oct";
    return {
      ...base,
      says: [
        `Understood, Sharath. We'll stick with your original ${originalDate} delivery.`,
        `Your ${familiar} stays in manufacturing. Nothing needed from you until it's built.`,
      ],
      workingLines: [
        "Keeping your original delivery date",
        `Building your ${familiar}, fresh off the line`,
      ],
      workingMode: "ongoing",
      workingDoneCount: 1,
      workingEtaLabel: allocationPendingEta(flow),
      timeSkipLabel: "A few months later",
      callLabel: "Questions while it's built? I can call you",
    };
  }

  if (moment === "allocationDone") {
    const familiar = carFamiliarName(car.title);
    const footnote = moneyIntroFootnote(flow);
    if (context?.earlyAllocation) {
      const earlyDate =
        splitBookingDeliveryLine(EARLY_STANDARD_DELIVERY_LINE)?.date.replace(/\s*'\d+$/, "") ??
        "4 Oct";
      return {
        ...base,
        footnote,
        says: [
          `All set. Your ${familiar} is assigned to you, with delivery moved up to ${earlyDate}.`,
          paymentHandoffBody(),
        ],
        ...paymentHandoffCta(),
      };
    }
    return {
      ...base,
      footnote,
      says: [
        `Your ${familiar} is built, Sharath. It's assigned to you.`,
        paymentHandoffBody(),
      ],
      ...paymentHandoffCta(),
    };
  }
  return base;
}
