import type { StaticImageData } from "next/image";

import tpCoverIcon from "@/assets/TP cover.svg";
import zdCoverIcon from "@/assets/ZD cover.svg";

export type InsuranceCoverageItem = {
  iconSrc: StaticImageData;
  durationLabel: string;
  planTitle: string;
  description: string;
};

/** Coverage rows — Figma Insurance coverage (2585:68086). */
export const INSURANCE_COVERAGE_ITEMS: readonly InsuranceCoverageItem[] = [
  {
    iconSrc: zdCoverIcon,
    durationLabel: "1-year ",
    planTitle: "Zero depreciation (Bumper to bumper) Cover",
    description:
      "Covers theft and damage caused to your car by accidents, natural calamities and fire. It also pays 100% of the cost of replaced parts during a claim.",
  },
  {
    iconSrc: tpCoverIcon,
    durationLabel: "3-year ",
    planTitle: "Third Party Cover",
    description: "Covers damage caused by your car to others and their property.",
  },
] as const;

/* ------------------------------------------------------------------------ */
/* Premium                                                                    */
/* ------------------------------------------------------------------------ */

export const INSURANCE_PREMIUM_INR = 37_000;
/** Compare-at premium shown struck through beside the payable amount. */
export const INSURANCE_COMPARE_AT_PREMIUM_INR = 60_000;

/* ------------------------------------------------------------------------ */
/* Tenure options                                                              */
/* ------------------------------------------------------------------------ */

export type InsuranceTenureId = "1+3" | "3+3";

export type InsuranceTenureOption = {
  id: InsuranceTenureId;
  label: string;
  ownDamageYears: number;
  thirdPartyYears: number;
  premiumInr: number;
  compareAtInr: number;
  /** Short positioning chip — only shown on non-default options. */
  badge?: string;
  /** Why this is worth the upgrade — shown below the price when the card is selected. */
  upgradeBlurb?: string;
};

/** Standard (default) 1+3 and extended 3+3 cover options. */
export const INSURANCE_TENURE_OPTIONS: readonly InsuranceTenureOption[] = [
  {
    id: "1+3",
    label: "1 + 3 Years",
    ownDamageYears: 1,
    thirdPartyYears: 3,
    premiumInr: INSURANCE_PREMIUM_INR,
    compareAtInr: INSURANCE_COMPARE_AT_PREMIUM_INR,
  },
  {
    id: "3+3",
    label: "3 + 3 Years",
    ownDamageYears: 3,
    thirdPartyYears: 3,
    premiumInr: 52_000,
    compareAtInr: 85_000,
    badge: "Extended",
    upgradeBlurb: "Lock in today's rate for 3 years — no renewal risk, no surprises.",
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
  eyebrow: "Covered up to",
  value: "₹13,73,780",
  caption:
    "Stolen or written off, you get the full on-road price you paid back — not a depreciated number.",
} as const;

/** Coverage highlights under the hero — rows, each with its own explanation. */
export const INSURANCE_CARD_HIGHLIGHTS = [
  { title: "Zero depreciation", detail: "Replaced parts paid at 100% in every claim" },
  { title: "Full ex-showroom IDV", detail: "Claims valued against ₹9,54,900 — no new-car haircut" },
  { title: "5 add-ons included", detail: "Engine protect, roadside assistance, key cover & more" },
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

/** Shivi's framing at the top of the sheet — she sells the contract, not the card. */
export const INSURANCE_SHEET_SHIVI_LINE =
  "Before you pay — here's exactly what ₹37,000 buys. No fine print between us.";

/** Pricing-team commitment — the line that ends the support call before it starts. */
export const INSURANCE_PRICE_PROMISE =
  "Find this exact cover for less anywhere, and I'll refund the difference — that's a promise.";

/* ------------------------------------------------------------------------ */
/* Owned mode — after the premium is paid, the policy is a possession         */
/* ------------------------------------------------------------------------ */

export const INSURANCE_OWNED_SHEET_TITLE = "Your Shield policy";

export const INSURANCE_OWNED_SHIVI_LINE =
  "Paid and live — this is the cover you're driving home with. I hold a copy too, always.";

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
