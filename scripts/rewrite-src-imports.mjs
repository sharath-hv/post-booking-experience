#!/usr/bin/env node
/**
 * One-shot import path rewrite after nextfront15-shaped src/ layout.
 */
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");

const LIB_MAP = {
  "@/lib/active-booking-snapshot": "@/services/active-booking-snapshot",
  "@/lib/app-toast": "@/utils/app-toast",
  "@/lib/booking-car-card-content": "@/constants/booking-car-card-content",
  "@/lib/bottom-sheet-confirm-bullet": "@/constants/bottom-sheet-confirm-bullet",
  "@/lib/buying-guide-urls": "@/helpers/buying-guide-urls",
  "@/lib/cancel-booking-content": "@/constants/cancel-booking-content",
  "@/lib/cancel-booking-stagger": "@/helpers/cancel-booking-stagger",
  "@/lib/cancel-booking-success-content": "@/constants/cancel-booking-success-content",
  "@/lib/change-policy": "@/constants/change-policy",
  "@/lib/concierge/use-backdrop-mode": "@/hooks/use-backdrop-mode",
  "@/lib/confetti-basic-cannon": "@/utils/confetti-basic-cannon",
  "@/lib/dealer-attribution-content": "@/constants/dealer-attribution-content",
  "@/lib/demo-nav-cta": "@/constants/demo-nav-cta",
  "@/lib/demo-vehicle-identification": "@/constants/demo-vehicle-identification",
  "@/lib/experience-flow": "@/helpers/experience-flow",
  "@/lib/experience-flow-content": "@/constants/experience-flow-content",
  "@/lib/experience-flow-journey": "@/helpers/experience-flow-journey",
  "@/lib/journey-routes": "@/helpers/journey-routes",
  "@/lib/journey-stage": "@/helpers/journey-stage",
  "@/lib/kyc-assets": "@/utils/kyc-assets",
  "@/lib/kyc-booking-confirmed-assets": "@/utils/kyc-booking-confirmed-assets",
  "@/lib/kyc-mock-upload": "@/services/kyc-mock-upload",
  "@/lib/kyc-upload-content": "@/constants/kyc-upload-content",
  "@/lib/kyc-upload-state": "@/helpers/kyc-upload-state",
  "@/lib/kyc-verification-attempts": "@/helpers/kyc-verification-attempts",
  "@/lib/kyc-verification-failed-content": "@/constants/kyc-verification-failed-content",
  "@/lib/kyc-verification-outcome": "@/helpers/kyc-verification-outcome",
  "@/lib/layout-classes": "@/helpers/layout-classes",
  "@/lib/loan-amount-demo-constants": "@/constants/loan-amount-demo-constants",
  "@/lib/loan-application-content": "@/constants/loan-application-content",
  "@/lib/loan-application-documents-content": "@/constants/loan-application-documents-content",
  "@/lib/loan-application-documents-state": "@/helpers/loan-application-documents-state",
  "@/lib/loan-application-state": "@/helpers/loan-application-state",
  "@/lib/loan-application-urls": "@/helpers/loan-application-urls",
  "@/lib/loan-emi": "@/helpers/loan-emi",
  "@/lib/loan-rejected-content": "@/constants/loan-rejected-content",
  "@/lib/manage-booking-modify": "@/helpers/manage-booking-modify",
  "@/lib/modify-selection-car-brands-content": "@/constants/modify-selection-car-brands-content",
  "@/lib/modify-selection-car-cutouts": "@/helpers/modify-selection-car-cutouts",
  "@/lib/modify-selection-car-models-content": "@/constants/modify-selection-car-models-content",
  "@/lib/modify-selection-colour-pending": "@/helpers/modify-selection-colour-pending",
  "@/lib/modify-selection-colours-content": "@/constants/modify-selection-colours-content",
  "@/lib/modify-selection-content": "@/constants/modify-selection-content",
  "@/lib/modify-selection-different-car-content": "@/constants/modify-selection-different-car-content",
  "@/lib/modify-selection-different-car-paths": "@/helpers/modify-selection-different-car-paths",
  "@/lib/modify-selection-different-car-pending": "@/helpers/modify-selection-different-car-pending",
  "@/lib/modify-selection-different-car-variant-choice":
    "@/helpers/modify-selection-different-car-variant-choice",
  "@/lib/modify-selection-review-pay-content": "@/constants/modify-selection-review-pay-content",
  "@/lib/modify-selection-review-pay-demo": "@/helpers/modify-selection-review-pay-demo",
  "@/lib/modify-selection-stagger": "@/helpers/modify-selection-stagger",
  "@/lib/modify-selection-variant-choice": "@/helpers/modify-selection-variant-choice",
  "@/lib/modify-selection-variant-pending": "@/helpers/modify-selection-variant-pending",
  "@/lib/modify-selection-variants-content": "@/constants/modify-selection-variants-content",
  "@/lib/overlay-glass-card": "@/helpers/overlay-glass-card",
  "@/lib/payment-summary-demo": "@/constants/payment-summary-demo",
  "@/lib/paymentUrls": "@/helpers/paymentUrls",
  "@/lib/public-asset-path": "@/utils/public-asset-path",
  "@/lib/shivi-business-hours": "@/helpers/shivi-business-hours",
  "@/lib/timeline-step-status": "@/helpers/timeline-step-status",
  "@/lib/utils": "@/utils/utils",
};

const COMPONENT_PREFIXES = [
  ["@/components/kyc/", "@/components/organisms/kyc/"],
  ["@/components/payment/", "@/components/organisms/payment/"],
  ["@/components/concierge/", "@/components/organisms/concierge/"],
  ["@/components/quote/", "@/components/organisms/quote/"],
];

const HOOK_MAP = {
  "@/components/payment/use-full-payment-journey": "@/hooks/use-full-payment-journey",
  "@/components/organisms/payment/use-full-payment-journey": "@/hooks/use-full-payment-journey",
  "@/components/payment/loan-application/use-loan-application-applicant":
    "@/hooks/use-loan-application-applicant",
  "@/components/organisms/payment/loan-application/use-loan-application-applicant":
    "@/hooks/use-loan-application-applicant",
  "@/components/payment/loan-application/use-loan-application-bank":
    "@/hooks/use-loan-application-bank",
  "@/components/organisms/payment/loan-application/use-loan-application-bank":
    "@/hooks/use-loan-application-bank",
  "@/components/payment/loan-application/use-loan-application-state":
    "@/hooks/use-loan-application-state",
  "@/components/organisms/payment/loan-application/use-loan-application-state":
    "@/hooks/use-loan-application-state",
};

function rewrite(content) {
  let next = content;
  next = next.replaceAll('@/components/providers"', '@/context"');
  next = next.replaceAll("@/components/providers'", "@/context'");

  for (const [from, to] of Object.entries(HOOK_MAP)) {
    next = next.replaceAll(from, to);
  }
  for (const [from, to] of COMPONENT_PREFIXES) {
    next = next.replaceAll(from, to);
  }
  // Longest keys first so nested paths win
  const libKeys = Object.keys(LIB_MAP).sort((a, b) => b.length - a.length);
  for (const from of libKeys) {
    next = next.replaceAll(from, LIB_MAP[from]);
  }
  return next;
}

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === ".next" || entry.name === "out") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (/\.(ts|tsx|js|jsx|mjs|scss|md|mdc)$/.test(entry.name)) out.push(full);
  }
  return out;
}

let changed = 0;
for (const file of walk(path.join(root, "src")).concat(
  walk(path.join(root, ".cursor")),
  walk(path.join(root, "docs")).filter((f) => !f.endsWith(".docx")),
  [path.join(root, "README.md")],
)) {
  if (!fs.existsSync(file)) continue;
  const before = fs.readFileSync(file, "utf8");
  const after = rewrite(before);
  if (after !== before) {
    fs.writeFileSync(file, after);
    changed += 1;
  }
}

// Fix BottomSheetShell relative hook import
const shell = path.join(root, "src/components/organisms/BottomSheetShell.tsx");
if (fs.existsSync(shell)) {
  let text = fs.readFileSync(shell, "utf8");
  text = text
    .replaceAll('from "./use-bottom-sheet-presence"', 'from "@/hooks/use-bottom-sheet-presence"')
    .replaceAll(
      'from "./use-bottom-sheet-presence";',
      'from "@/hooks/use-bottom-sheet-presence";',
    );
  fs.writeFileSync(shell, text);
}

console.log(`Updated ${changed} files`);
