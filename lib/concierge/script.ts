import {
  BOOKING_CAR_COLOR,
  BOOKING_CAR_TITLE,
  BOOKING_CAR_VARIANT,
} from "@/components/kyc/booking-car-card-content";
import type { ExperienceFlow } from "@/lib/experience-flow";
import { isStandardDeliveryFlow } from "@/lib/experience-flow-content";
import { getDeliveryDateFull, getDeliveryDateShort } from "@/lib/journey-stage";

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
  /** Demo: manufacturing finished ahead of the estimated date (`?early=1`). */
  earlyAllocation?: boolean;
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
  footnote: "Worth doing now, so your booking amount and delivery date hold.",
};

const STANDARD_ARRIVAL: TurnWords = {
  says: [
    "Hi Sharath, I'm Shivi. Your booking amount is in.",
    "You're almost there. One short paperwork step comes next — then I'll get your Creta into the queue.",
    "Here's what happens next",
  ],
  replyLabel: "Let's do the paper work",
  replyEcho: "Let's do the paper work",
  footnote: "Worth doing now, so nothing slows down your delivery.",
};

/** Arrival lead — identical before and after payment so the headline never reflows. */
export function getArrivalLeadPaid(flow: ExperienceFlow): string {
  return (isStandardDeliveryFlow(flow) ? STANDARD_ARRIVAL : EXPRESS_ARRIVAL).says[0]!;
}

const DEALER_SEARCH_FOOTNOTE_LEAD = "A quick heads-up:";
/** Shown once the partner is assigned on this turn — fees apply from here. */
const DEALER_SEARCH_FOOTNOTE =
  "I've locked in a partner. A ₹5,000 change fee applies if you switch your pick, and cancelling holds back half of your booking amount.";

/**
 * Standard — unlike express, every nearby dealer already knows the car is
 * headed into the manufacturing queue either way, so there's no "who can
 * deliver soonest" race and no overnight suspense. Resolves live, in-session.
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
          `I'm lining up a dealer partner for ${exact}. This won't take long.`,
        ]
      : [
          "That's the paperwork done, Sharath.",
          `I'm lining up a dealer partner for ${exact}. This won't take long.`,
        ],
    workingLines: [
      "Checking nearby partners",
      `Assigning your ${familiar} to one`,
    ],
    workingDoneLabel: `Partner assigned for your ${familiar}.`,
    replyLabel: "What's next?",
    replyEcho: "What's next?",
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
          `Now I'm reaching out to dealers for ${exact}. They usually take a few hours to confirm stock, so this runs overnight. I'll let you know the moment I hear back.`,
        ]
      : [
          "That's the paperwork done, Sharath.",
          `Now I'm reaching out to dealers for ${exact}. They usually take a few hours to confirm stock, so this runs overnight. I'll let you know the moment I hear back.`,
        ],
    workingLines: [
      "Reaching out to dealers near you",
      `Checking stock for your ${car.variant} in ${car.colour}`,
      "Finding who can deliver soonest",
    ],
    workingMode: "ongoing",
    workingEtaLabel: "I'll have news by tomorrow morning",
    timeSkipLabel: "Next morning",
    callLabel: "Can't sleep on it? I can call you",
    footnoteLead: DEALER_SEARCH_FOOTNOTE_LEAD,
    footnote: DEALER_SEARCH_FOOTNOTE,
  };
}

function dealerFoundWords(
  car: ConciergeCarRef,
  afterSelectionChange: boolean,
): TurnWords {
  const familiar = carFamiliarName(car.title);

  return {
    says: afterSelectionChange
      ? [
          "Found a match for your new pick, Sharath.",
          `I've reserved a fresh ${familiar} for you. Share the one-time code when our partner calls — that's how we assign this exact car to you. I'll put the engine and chassis numbers on the card once it's locked.`,
        ]
      : [
          "Found a match, Sharath.",
          `I've reserved a fresh ${familiar} for you. Share the one-time code when our partner calls — that's how Hyundai assigns this exact car to you. I'll put the engine and chassis numbers on the card once it's locked.`,
        ],
    timeSkipLabel: "After the call",
    callLabel: "Questions? I can call you",
  };
}

function carReservedWords(car: ConciergeCarRef): TurnWords {
  const familiar = carFamiliarName(car.title);

  return {
    says: [
      `Your code checked out, Sharath. This ${familiar} is yours.`,
      "Its engine and chassis numbers are on the card below. Next, let's sort the payment, the last big thing between you and your delivery date.",
    ],
    replyLabel: "Start the payment",
    replyEcho: "Let's start the payment",
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
    workingDoneLabel: "Verified. Your purchase is now open in your name.",
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
  dealerFound: dealerFoundWords(DEFAULT_CAR, false),
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
      "Your Creta is built, Sharath.",
      "Fresh off the line. Its engine and chassis numbers are on the card below. Next, let's sort the payment, the last big thing between you and your delivery date.",
    ],
    replyLabel: "Start the payment",
    replyEcho: "Let's start the payment",
  },

  moneyIntro: {
    says: [
      "Morning, Sharath. Let's sort out the payment.",
      "₹13,63,780 is left to pay on your Creta. You can finance it through me, or arrange it yourself. Whichever you prefer.",
    ],
    replyLabel: "Show me my options",
    replyEcho: "Show me my options",
    callLabel: "Rather talk it through? I can call you",
  },
};

function moneyIntroFootnote(flow: ExperienceFlow): string {
  const date = getDeliveryDateShort(flow);
  return `Your ${date} delivery holds once payment is set up. Every day this waits moves it back.`;
}

function allocationPendingEta(flow: ExperienceFlow): string {
  return `Estimated by ${getDeliveryDateFull(flow)}`;
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
    return dealerFoundWords(car, afterSelectionChange);
  }

  if (moment === "carReserved") {
    return carReservedWords(car);
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
  if (moment === "allocationDone") {
    const familiar = carFamiliarName(car.title);
    if (context?.earlyAllocation) {
      return {
        ...base,
        says: [
          `Good news, Sharath. Your ${familiar} is ready earlier than we planned.`,
          "Fresh off the line ahead of schedule. Engine and chassis are on the card below. Next, let's sort the payment so we can pull your delivery date in.",
        ],
      };
    }
    return {
      ...base,
      says: [
        `Your ${familiar} is built, Sharath.`,
        "Fresh off the line. Its engine and chassis numbers are on the card below. Next, let's sort the payment, the last big thing between you and your delivery date.",
      ],
    };
  }
  return base;
}
