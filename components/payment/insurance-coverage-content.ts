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
/* Premium                                                                    */
/* ------------------------------------------------------------------------ */

export const INSURANCE_PREMIUM_INR = 37_000;
/** Compare-at premium shown struck through beside the payable amount. */
export const INSURANCE_COMPARE_AT_PREMIUM_INR = 60_000;

export const INSURANCE_EXTENDED_PREMIUM_INR = 52_000;
/**
 * Extended compare-at — same market discount ratio as standard 1+3
 * (₹37,000 vs ₹60,000), applied to the 3+3 premium.
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
  premiumInr: number;
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
    label: "1 + 3 Years",
    illustrationSrc: insuranceTenure13Icon,
    ownDamageYears: 1,
    thirdPartyYears: 3,
    premiumInr: INSURANCE_PREMIUM_INR,
    compareAtInr: INSURANCE_COMPARE_AT_PREMIUM_INR,
    badge: "Standard",
    blurb:
      "You'll need to renew after 1st year, and premiums typically go up each renewal.",
  },
  {
    id: "3+3",
    label: "3 + 3 Years",
    illustrationSrc: insuranceTenure33Icon,
    ownDamageYears: 3,
    thirdPartyYears: 3,
    premiumInr: INSURANCE_EXTENDED_PREMIUM_INR,
    compareAtInr: INSURANCE_EXTENDED_COMPARE_AT_INR,
    badge: "Extended",
    blurb:
      "I'd lock you in for 3 years — today's rate, no renewal at year one, and nothing creeping up on you.",
  },
] as const;

/** Text link below tenure cards — opens the standard vs extended compare sheet. */
export const INSURANCE_TENURE_DIFFERENCE_CTA = "Not sure yet? compare now";

/** Compare sheet — [Figma 322:5666](https://www.figma.com/design/FEPATa8H2Eflz7FZm5LKuL/3-3-insurance-upsell?node-id=322-5666). */
export const INSURANCE_TENURE_COMPARE_SHEET_TITLE = "Compare Standard and Extended cover";

export const INSURANCE_TENURE_COMPARE_WHAT_YOU_GET = "What you'll get";

export type InsuranceTenureCompareRow = {
  id: string;
  lines: readonly string[];
  standardYears: number;
  extendedYears: number;
};

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

/** Benefit rows below the compare table — Figma copy order. */
export const INSURANCE_TENURE_COMPARE_BENEFITS: readonly InsuranceCoverageItem[] = [
  {
    iconSrc: zdCoverIcon,
    title: "Zero depreciation Own Damage (Bumper to bumper) Cover",
    description:
      "Covers theft and damage caused to your car by accidents, natural calamities and fire. It also pays 100% of the cost of replaced parts during a claim.",
  },
  {
    iconSrc: tpCoverIcon,
    title: "Third Party Cover",
    description: "Covers damage caused by your car to others and their property.",
  },
  {
    iconSrc: extraCarProtectIcon,
    title: "Extra car protection",
    description:
      "Provides 24x7 car breakdown assistance. Covers the cost of key repair/replacement up to ₹7,000. It also pays accommodation expenses up to ₹6,500 during outstation repairs.",
  },
  {
    iconSrc: personalAccidentIcon,
    title: "15 lakh personal accident cover",
    description: "Pays up to ₹15 lakh for accidental death or injury of the car owner.",
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
/* Add-ons included (no extra charge)                                         */
/* ------------------------------------------------------------------------ */

export const INSURANCE_INCLUDED_ADDONS = [
  { title: "Return to Invoice", detail: "Total loss pays the on-road price, not the depreciated value" },
  { title: "Engine & gearbox protect", detail: "Water ingress and oil-leak damage — usually excluded" },
  { title: "Consumables cover", detail: "Oils, nuts, bolts and fluids paid in full during claims" },
  { title: "24×7 roadside assistance", detail: "Towing, jumpstart, flat tyre — anywhere in India" },
  { title: "Key & lock replacement", detail: "Lost or stolen keys replaced without a claim hit" },
] as const;

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
    title: "A write-off pays what you actually spent",
    detail:
      "Return to Invoice covers the on-road price — ₹13,73,780 with registration and all — not a depreciated number.",
  },
  {
    title: "The five add-ons are usually paid extras",
    detail:
      "Engine protect, consumables, roadside assistance, key cover, RTI — built into one price instead of sold line by line.",
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

export const INSURANCE_CLAIMS_LINE =
  "If anything ever happens: open the app, add photos, and I take the claim from there — garage, approvals, updates, all tracked here.";
