import type { StaticImageData } from "next/image";

import extraCarProtectIcon from "@/assets/extra car protect.svg";
import insuranceTenure13Icon from "@/assets/1+3.svg";
import insuranceTenure33Icon from "@/assets/3+3.svg";
import personalAccidentIcon from "@/assets/Personal Accident.svg";
import tpCoverIcon from "@/assets/TP cover.svg";
import zdCoverIcon from "@/assets/ZD cover.svg";

export type InsuranceCoverageItem = {
  iconSrc: StaticImageData;
  title: string;
  description: string;
};

/** Coverage rows shown in the insurance coverage sheet. */
export const INSURANCE_COVERAGE_ITEMS: readonly InsuranceCoverageItem[] = [
  {
    iconSrc: zdCoverIcon,
    title: "Zero depreciation own damage · 1 year",
    description:
      "Your car, your repairs — accidents, theft, fire, and natural disasters, all covered. Parts replaced at 100% cost, no depreciation cut.",
  },
  {
    iconSrc: tpCoverIcon,
    title: "Third-party cover · 3 years",
    description:
      "If your car causes damage to someone else or their property, it's handled — legally and financially.",
  },
  {
    iconSrc: extraCarProtectIcon,
    title: "Extra car protection · 1 year",
    description:
      "24×7 breakdown assistance on call. Key repair or replacement up to ₹7,000. Accommodation covered up to ₹6,500 if you're stranded during an outstation repair.",
  },
  {
    iconSrc: personalAccidentIcon,
    title: "₹15 lakh personal accident cover · 1 year",
    description:
      "If something happens to you as the driver — disability or worse — up to ₹15 lakh goes to you or your nominee.",
  },
] as const;

/* ------------------------------------------------------------------------ */
/* Premium — base Shield + optional add-ons                                   */
/* ------------------------------------------------------------------------ */

/** ACKO Drive Shield base (core covers only) — standard 1+3. */
export const INSURANCE_BASE_PREMIUM_INR = 28_000;
/** ACKO Drive Shield base — extended 3+3. */
export const INSURANCE_EXTENDED_BASE_PREMIUM_INR = 40_000;

/**
 * Recommended full package (base + all optional add-ons) — 1+3.
 * Kept as the journey “typical” insurance amount in price-identity copy.
 */
export const INSURANCE_PREMIUM_INR = 37_000;
/** Compare-at premium shown struck through beside the full-package amount. */
export const INSURANCE_COMPARE_AT_PREMIUM_INR = 60_000;

export const INSURANCE_EXTENDED_PREMIUM_INR = 52_000;
/**
 * Extended compare-at — same market discount ratio as standard 1+3
 * (₹37,000 vs ₹60,000), applied to the 3+3 full package.
 */
export const INSURANCE_EXTENDED_COMPARE_AT_INR = Math.round(
  (INSURANCE_EXTENDED_PREMIUM_INR * INSURANCE_COMPARE_AT_PREMIUM_INR) / INSURANCE_PREMIUM_INR,
);
export const INSURANCE_EXTENDED_SAVINGS_INR =
  INSURANCE_EXTENDED_COMPARE_AT_INR - INSURANCE_EXTENDED_PREMIUM_INR;

/* ------------------------------------------------------------------------ */
/* Tenure options                                                              */
/* ------------------------------------------------------------------------ */

export type InsuranceTenureId = "1+3" | "3+3";

export type InsuranceTenureOption = {
  id: InsuranceTenureId;
  label: string;
  illustrationSrc: StaticImageData;
  ownDamageYears: number;
  thirdPartyYears: number;
  /** Base Shield premium for this tenure (before optional add-ons). */
  premiumInr: number;
  /** Compare-at for the recommended full package on this tenure. */
  compareAtInr: number;
  badge: string;
  /** Shivi-voice product copy below the card title — matches payment option cards. */
  blurb: string;
  /** Why this is worth the upgrade — always shown in the card footer on extended. */
  upgradeBlurb?: string;
};

/** Standard (default) 1+3 and extended 3+3 cover options. */
export const INSURANCE_TENURE_OPTIONS: readonly InsuranceTenureOption[] = [
  {
    id: "1+3",
    label: "Standard cover",
    illustrationSrc: insuranceTenure13Icon,
    ownDamageYears: 1,
    thirdPartyYears: 3,
    premiumInr: INSURANCE_BASE_PREMIUM_INR,
    compareAtInr: INSURANCE_COMPARE_AT_PREMIUM_INR,
    badge: "Standard",
    blurb:
      "You'll need to renew after 1st year, and premiums typically go up each renewal.",
  },
  {
    id: "3+3",
    label: "Extended cover",
    illustrationSrc: insuranceTenure33Icon,
    ownDamageYears: 3,
    thirdPartyYears: 3,
    premiumInr: INSURANCE_EXTENDED_BASE_PREMIUM_INR,
    compareAtInr: INSURANCE_EXTENDED_COMPARE_AT_INR,
    badge: "Extended",
    blurb:
      "I'd lock you in for 3 years — today's rate, no renewal at year one, and nothing creeping up on you.",
  },
] as const;

/** Text link below tenure cards — opens the standard vs extended compare sheet. */
export const INSURANCE_TENURE_DIFFERENCE_CTA = "Not sure yet? Compare now";

export const INSURANCE_TENURE_SCREEN_TITLE = "How long do you want this locked in?";

export const INSURANCE_TENURE_OPTIONS_HEADING = "Choose tenure";

export function insuranceTenureScreenSubline(addonCount: number): string {
  const addonNote =
    addonCount > 0
      ? `Your premium includes the ${addonCount} add-on${addonCount === 1 ? "" : "s"} you picked.`
      : "This is base ACKO Drive Shield — you can go back to add protection.";
  return `Extended cover locks in your premium for 3 years. No renewals, no rate hikes. ${addonNote}`;
}

/** Compare sheet — [Figma 322:5666](https://www.figma.com/design/FEPATa8H2Eflz7FZm5LKuL/3-3-insurance-upsell?node-id=322-5666). */
export const INSURANCE_TENURE_COMPARE_SHEET_TITLE = "Compare Standard and Extended cover";

export type InsuranceTenureCompareRow = {
  id: string;
  lines: readonly string[];
  standardYears: number;
  extendedYears: number;
};

/** Base Shield rows — always shown in the tenure compare table. */
export const INSURANCE_TENURE_COMPARE_ROWS: readonly InsuranceTenureCompareRow[] = [
  {
    id: "tp",
    lines: ["Third-party", "liability (TP)"],
    standardYears: 3,
    extendedYears: 3,
  },
  {
    id: "od",
    lines: ["Own damage", "(OD)"],
    standardYears: 1,
    extendedYears: 3,
  },
  {
    id: "zd",
    lines: ["Zero", "depreciation"],
    standardYears: 1,
    extendedYears: 3,
  },
  {
    id: "extra",
    lines: ["Extra car", "protection"],
    standardYears: 1,
    extendedYears: 3,
  },
  {
    id: "pa",
    lines: ["15 lakh personal accident cover"],
    standardYears: 1,
    extendedYears: 3,
  },
] as const;

/* ------------------------------------------------------------------------ */
/* IDV — the single biggest number in the policy                              */
/* ------------------------------------------------------------------------ */

/** Full ex-showroom IDV — zero new-car haircut (pricing-team commitment #1). */
export const INSURANCE_IDV_INR = 9_54_900;
/** Return-to-invoice payout on total loss — full on-road price. */
export const INSURANCE_RTI_PAYOUT_INR = 13_73_780;

/* ------------------------------------------------------------------------ */
/* The one headline number — the worst day, already answered                  */
/* ------------------------------------------------------------------------ */

/**
 * IDV and the RTI payout are different on purpose (IDV is ex-showroom; RTI
 * tops a write-off up to the on-road price) — but side by side they read as
 * a contradiction. The card leads with the payout; IDV is explained below.
 */
export const INSURANCE_COVER_HERO = {
  eyebrow: "Insured declared value",
  value: "₹9,54,900",
  caption:
    "Your car's full ex-showroom price. Every claim is valued against this number, with zero depreciation on replaced parts.",
} as const;

/** Coverage highlights under the hero — rows, each with its own explanation. */
export const INSURANCE_CARD_HIGHLIGHTS = [
  { title: "Zero depreciation own damage", detail: "Replaced parts paid at 100% — no depreciation cut" },
  { title: "Third-party cover", detail: "Damage to others or their property, covered" },
  { title: "Extra car protection", detail: "24×7 breakdown, key replacement, outstation accommodation" },
  { title: "₹15 lakh personal accident cover", detail: "Paid to you or your nominee in case of disability or death" },
] as const;

/* ------------------------------------------------------------------------ */
/* Optional add-ons — opt in on top of base Shield                            */
/* ------------------------------------------------------------------------ */

export type InsuranceAddonId =
  | "engine"
  | "ncb"
  | "rti"
  | "consumables"
  | "electrical"
  | "non_electrical"
  | "passenger"
  | "paid_driver";

export type InsuranceAddonOption = {
  id: InsuranceAddonId;
  /** Product name in the grey footer, e.g. "Engine Protect". */
  title: string;
  /** Joiner before the price — "-" or "@" as in the design. */
  priceConnector: "-" | "@";
  /** Benefit headline in the white body. */
  headline: string;
  detail: string;
  /** Extra premium on standard 1+3. */
  premiumInr: number;
  /** Extra premium on extended 3+3. */
  extendedPremiumInr: number;
};

/** Demo add-on price shown on standard tenure (matches design). */
const ADDON_PREMIUM_INR = 399;
/** Extended tenure uplift — same market ratio as full-package anchors. */
const ADDON_EXTENDED_PREMIUM_INR = Math.round(
  (ADDON_PREMIUM_INR * INSURANCE_EXTENDED_PREMIUM_INR) / INSURANCE_PREMIUM_INR,
);

/**
 * Optional protection on top of ACKO Drive Shield.
 * Card layout: [Figma 2961:9254](https://www.figma.com/design/nW5SWmJdxxsCEDlqBN7C0L/Post-booking-experience?node-id=2961-9254).
 */
export const INSURANCE_OPTIONAL_ADDONS: readonly InsuranceAddonOption[] = [
  {
    id: "engine",
    title: "Engine Protect",
    priceConnector: "-",
    headline: "Save yourself from costly engine repairs",
    detail:
      "Covers engine and gearbox damage caused by non-accidental events like floods, heavy rains, and oil leaks",
    premiumInr: ADDON_PREMIUM_INR,
    extendedPremiumInr: ADDON_EXTENDED_PREMIUM_INR,
  },
  {
    id: "ncb",
    title: "NCB Protection",
    priceConnector: "-",
    headline: "Protect your No Claim Bonus",
    detail: "Make a claim without losing your No Claim Bonus (NCB). Valid only for 1 claim.",
    premiumInr: ADDON_PREMIUM_INR,
    extendedPremiumInr: ADDON_EXTENDED_PREMIUM_INR,
  },
  {
    id: "rti",
    title: "Return to Invoice Cover",
    priceConnector: "-",
    headline: "Ensure full coverage for total loss",
    detail:
      "Get the complete invoice value of your car or the current on-road price, whichever is lower, if your car is stolen or damaged beyond repair.",
    premiumInr: ADDON_PREMIUM_INR,
    extendedPremiumInr: ADDON_EXTENDED_PREMIUM_INR,
  },
  {
    id: "consumables",
    title: "Consumables Cover",
    priceConnector: "-",
    headline: "Save on repair extras",
    detail:
      "Covers the cost of consumables like nuts, bolts, brake oil, engine oil etc. that get replaced during repair. These are not covered by your base plan.",
    premiumInr: ADDON_PREMIUM_INR,
    extendedPremiumInr: ADDON_EXTENDED_PREMIUM_INR,
  },
  {
    id: "electrical",
    title: "Electrical Accessories Cover",
    priceConnector: "-",
    headline: "Protect your car accessories",
    detail:
      "Cover theft or damage of items like music system, speakers, and other electrical car accessories",
    premiumInr: ADDON_PREMIUM_INR,
    extendedPremiumInr: ADDON_EXTENDED_PREMIUM_INR,
  },
  {
    id: "non_electrical",
    title: "Non-electrical Accessories Cover",
    priceConnector: "-",
    headline: "Secure non-electrical items",
    detail:
      "Cover theft or damage of items like alloy wheels, seat covers, and other non-electrical accessories.",
    premiumInr: ADDON_PREMIUM_INR,
    extendedPremiumInr: ADDON_EXTENDED_PREMIUM_INR,
  },
  {
    id: "passenger",
    title: "Passenger Protection",
    priceConnector: "-",
    headline: "For your loved ones",
    detail:
      "Pays up to ₹2 lakh per passenger if they are permanently disabled or die in an accident.",
    premiumInr: ADDON_PREMIUM_INR,
    extendedPremiumInr: ADDON_EXTENDED_PREMIUM_INR,
  },
  {
    id: "paid_driver",
    title: "Paid Driver Protection",
    priceConnector: "-",
    headline: "For your driver",
    detail:
      "Pays up to your legal obligation amount if your paid driver is permanently disabled or dies in an accident.",
    premiumInr: ADDON_PREMIUM_INR,
    extendedPremiumInr: ADDON_EXTENDED_PREMIUM_INR,
  },
] as const;

export const INSURANCE_ADDON_ADD_LABEL = "Add";
export const INSURANCE_ADDON_ADDED_LABEL = "Added";

/** @deprecated Use {@link INSURANCE_OPTIONAL_ADDONS} — kept for any residual imports. */
export const INSURANCE_INCLUDED_ADDONS = INSURANCE_OPTIONAL_ADDONS.map(({ title, detail }) => ({
  title,
  detail,
}));

export const INSURANCE_ADDONS_SECTION_HEADING = "Want to add more protection?";
export const INSURANCE_ADDONS_SECTION_SUBLINE =
  "All optional — skip anything you don't need. Tap Add and your premium updates instantly.";

/** Section label / a11y name for the optional add-on list. */
export const INSURANCE_ADDONS_AVAILABLE_HEADING = "Optional add-ons";

export const INSURANCE_ADDONS_CONTINUE_CTA = "Choose your tenure";
export const INSURANCE_ADDONS_TOTAL_LABEL = "Total premium";

const ADDON_ID_SET = new Set<string>(INSURANCE_OPTIONAL_ADDONS.map((a) => a.id));

export function isInsuranceAddonId(value: string): value is InsuranceAddonId {
  return ADDON_ID_SET.has(value);
}

export function parseInsuranceAddonIds(raw: string | null | undefined): InsuranceAddonId[] {
  if (!raw) return [];
  const seen = new Set<InsuranceAddonId>();
  for (const part of raw.split(",")) {
    const id = part.trim();
    if (isInsuranceAddonId(id)) seen.add(id);
  }
  return INSURANCE_OPTIONAL_ADDONS.map((a) => a.id).filter((id) => seen.has(id));
}

export function serializeInsuranceAddonIds(ids: readonly InsuranceAddonId[]): string {
  const seen = new Set(ids);
  return INSURANCE_OPTIONAL_ADDONS.map((a) => a.id)
    .filter((id) => seen.has(id))
    .join(",");
}

/**
 * Compare-table rows for the current quote: base Shield + any selected add-ons.
 * Add-ons follow OD tenure (1 year standard / 3 year extended).
 */
export function insuranceTenureCompareRowsForSelection(
  addonIds: readonly InsuranceAddonId[] = [],
): InsuranceTenureCompareRow[] {
  const selected = new Set(addonIds);
  const addonRows = INSURANCE_OPTIONAL_ADDONS.filter((addon) => selected.has(addon.id)).map(
    (addon): InsuranceTenureCompareRow => ({
      id: addon.id,
      lines: [addon.title],
      standardYears: 1,
      extendedYears: 3,
    }),
  );
  return [...INSURANCE_TENURE_COMPARE_ROWS, ...addonRows];
}

export function insuranceBasePremiumInr(tenure: InsuranceTenureId): number {
  return tenure === "3+3" ? INSURANCE_EXTENDED_BASE_PREMIUM_INR : INSURANCE_BASE_PREMIUM_INR;
}

export function insuranceAddonPremiumInr(
  addonIds: readonly InsuranceAddonId[],
  tenure: InsuranceTenureId,
): number {
  const selected = new Set(addonIds);
  return INSURANCE_OPTIONAL_ADDONS.reduce((sum, addon) => {
    if (!selected.has(addon.id)) return sum;
    return sum + (tenure === "3+3" ? addon.extendedPremiumInr : addon.premiumInr);
  }, 0);
}

/** Payable premium for a tenure + add-on selection. */
export function insurancePremiumForSelection(
  tenure: InsuranceTenureId,
  addonIds: readonly InsuranceAddonId[] = [],
): number {
  return insuranceBasePremiumInr(tenure) + insuranceAddonPremiumInr(addonIds, tenure);
}

/** Struck-through compare-at — same market ratio as the full-package anchors. */
export function insuranceCompareAtForSelection(
  tenure: InsuranceTenureId,
  addonIds: readonly InsuranceAddonId[] = [],
): number {
  const premium = insurancePremiumForSelection(tenure, addonIds);
  if (tenure === "3+3") {
    return Math.round((premium * INSURANCE_EXTENDED_COMPARE_AT_INR) / INSURANCE_EXTENDED_PREMIUM_INR);
  }
  return Math.round((premium * INSURANCE_COMPARE_AT_PREMIUM_INR) / INSURANCE_PREMIUM_INR);
}

/* ------------------------------------------------------------------------ */
/* Why it's priced this way — the policy argues for itself                    */
/* ------------------------------------------------------------------------ */

export const INSURANCE_VALUE_TITLE = "Why it costs what it costs";

export type InsuranceValuePoint = { title: string; detail: string };

export const INSURANCE_VALUE_POINTS: readonly InsuranceValuePoint[] = [
  {
    title: "Your IDV has no new-car haircut",
    detail:
      "Most quotes trim a new car's declared value by ~5% to look cheaper upfront. Shield holds the full ₹9,54,900 — that's ₹47,745 more cover behind every claim.",
  },
  {
    title: "A write-off can pay what you actually spent",
    detail:
      "Add Return to Invoice and a total loss pays the on-road price — ₹13,73,780 with registration and all — not a depreciated number.",
  },
  {
    title: "Add-ons only when you want them",
    detail:
      "Engine protect, NCB, RTI, consumables, accessories, passenger and driver cover — pick what matters; your premium updates before you choose tenure.",
  },
] as const;

/* ------------------------------------------------------------------------ */
/* Sheet framing                                                              */
/* ------------------------------------------------------------------------ */

export const INSURANCE_COVERAGE_SHEET_TITLE = "ACKO Drive Shield — your new car's cover";

/** Pricing-team commitment — the line that ends the support call before it starts. */
export const INSURANCE_PRICE_PROMISE =
  "Find this exact cover for less anywhere, and I'll refund the difference — that's a promise.";

/* ------------------------------------------------------------------------ */
/* Owned mode — after the premium is paid, the policy is a possession         */
/* ------------------------------------------------------------------------ */

export const INSURANCE_OWNED_SHEET_TITLE = "Your Shield policy";

/** Demo policy identity — issued the moment the premium lands. */
export const INSURANCE_POLICY_NUMBER = "ADRV-2026-0841927";

export type InsurancePolicyFact = { label: string; value: string };

export const INSURANCE_POLICY_FACTS: readonly InsurancePolicyFact[] = [
  { label: "Policy number", value: INSURANCE_POLICY_NUMBER },
  { label: "Status", value: "Active — from today" },
  { label: "Zero depreciation", value: "1 year" },
  { label: "Third-party cover", value: "3 years" },
] as const;
