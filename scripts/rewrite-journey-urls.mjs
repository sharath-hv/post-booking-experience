#!/usr/bin/env node
/**
 * Rewrite hardcoded journey URLs + JOURNEY_PATHS accessors after chapter remap.
 * Does not change UI — path strings and accessors only.
 */
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");

/** Longer keys first. */
const REPLACEMENTS = [
  // JOURNEY_PATHS accessors
  ["JOURNEY_PATHS.kyc.bookingConfirmed", "JOURNEY_PATHS.booking.confirmed"],
  ["JOURNEY_PATHS.kyc.bookingAccepted", "JOURNEY_PATHS.booking.accepted"],
  ["JOURNEY_PATHS.kyc.modifySelection", "JOURNEY_PATHS.booking.modify"],
  ["JOURNEY_PATHS.kyc.cancelBooking", "JOURNEY_PATHS.booking.cancel"],
  ["JOURNEY_PATHS.kyc.processing", "JOURNEY_PATHS.booking.processing"],
  ["JOURNEY_PATHS.buyingGuide", "JOURNEY_PATHS.onboarding"],
  ["JOURNEY_PATHS.payment.bookingSuccess", "JOURNEY_PATHS.booking.received"],
  [
    "JOURNEY_PATHS.payment.carDeliveryRtoAdditionalDocuments",
    "JOURNEY_PATHS.delivery.rtoAdditionalDocuments",
  ],
  ["JOURNEY_PATHS.payment.carDeliveryRto", "JOURNEY_PATHS.delivery.rto"],
  [
    "JOURNEY_PATHS.payment.carDeliveryInsurancePrep",
    "JOURNEY_PATHS.delivery.insurancePrep",
  ],
  [
    "JOURNEY_PATHS.payment.carDeliverySchedule",
    "JOURNEY_PATHS.delivery.schedule",
  ],

  // Hardcoded path strings (URL segments)
  ["/payment/car-delivery-rto-additional-documents", "/delivery/rto/additional-documents"],
  ["/payment/car-delivery-insurance-prep", "/delivery/insurance-prep"],
  ["/payment/car-delivery-schedule", "/delivery/schedule"],
  ["/payment/car-delivery-rto", "/delivery/rto"],
  ["/payment/booking-success/next", "/booking/received/next"],
  ["/payment/booking-success", "/booking/received"],
  ["/kyc/modify-selection", "/booking/modify"],
  ["/kyc/cancel-booking/success", "/booking/cancel/success"],
  ["/kyc/cancel-booking", "/booking/cancel"],
  ["/kyc/booking-confirmed", "/booking/confirmed"],
  ["/kyc/booking-accepted", "/booking/accepted"],
  ["/kyc/buying-guide", "/onboarding"],
  ["/kyc/processing", "/booking/processing"],
];

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (
      entry.name === "node_modules" ||
      entry.name === ".next" ||
      entry.name === "out" ||
      entry.name === ".git"
    ) {
      continue;
    }
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (/\.(ts|tsx|js|jsx|mjs|md|mdc)$/.test(entry.name)) out.push(full);
  }
  return out;
}

let changed = 0;
const targets = [
  ...walk(path.join(root, "src")),
  ...walk(path.join(root, "docs")).filter((f) => !f.endsWith(".docx")),
  path.join(root, "README.md"),
];

for (const file of targets) {
  if (!fs.existsSync(file)) continue;
  if (file.endsWith("journey-routes.ts")) continue;
  // Don't rewrite the canonical map itself (already correct) — still OK to run
  let text = fs.readFileSync(file, "utf8");
  const before = text;
  for (const [from, to] of REPLACEMENTS) {
    text = text.split(from).join(to);
  }
  if (text !== before) {
    fs.writeFileSync(file, text);
    changed += 1;
  }
}

console.log(`Updated ${changed} files`);
