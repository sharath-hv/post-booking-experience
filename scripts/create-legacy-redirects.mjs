#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");

function write(rel, body) {
  const full = path.join(root, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, body);
  console.log("wrote", rel);
}

function simpleRedirect(to) {
  return `"use client";

import { Suspense } from "react";

import { LegacyPathRedirect } from "@/components/molecules/LegacyPathRedirect";

function RedirectInner() {
  return <LegacyPathRedirect to="${to}" />;
}

export default function LegacyRedirectPage() {
  return (
    <Suspense fallback={null}>
      <RedirectInner />
    </Suspense>
  );
}
`;
}

function prefixRedirectPage({ staticParamsImport, staticParamsCall }) {
  return `import { Suspense } from "react";

import { LegacyPrefixRedirect } from "@/components/molecules/LegacyPrefixRedirect";
${staticParamsImport}

export function generateStaticParams() {
  return ${staticParamsCall};
}

export default function LegacyPrefixRedirectPage() {
  return (
    <Suspense fallback={null}>
      <LegacyPrefixRedirect fromPrefix="/kyc/modify-selection" toPrefix="/booking/modify" />
    </Suspense>
  );
}
`;
}

const SIMPLE = [
  ["src/app/kyc/processing/page.tsx", "/booking/processing"],
  ["src/app/kyc/booking-accepted/page.tsx", "/booking/accepted"],
  ["src/app/kyc/booking-confirmed/page.tsx", "/booking/confirmed"],
  ["src/app/kyc/cancel-booking/page.tsx", "/booking/cancel"],
  ["src/app/kyc/cancel-booking/success/page.tsx", "/booking/cancel/success"],
  ["src/app/kyc/modify-selection/page.tsx", "/booking/modify"],
  ["src/app/payment/booking-success/page.tsx", "/booking/received"],
  ["src/app/payment/booking-success/next/page.tsx", "/booking/received/next"],
  ["src/app/payment/car-delivery-insurance-prep/page.tsx", "/delivery/insurance-prep"],
  ["src/app/payment/car-delivery-rto/page.tsx", "/delivery/rto"],
  [
    "src/app/payment/car-delivery-rto-additional-documents/page.tsx",
    "/delivery/rto/additional-documents",
  ],
  ["src/app/payment/car-delivery-schedule/page.tsx", "/delivery/schedule"],
  ["src/app/kyc/modify-selection/colour/confirm/page.tsx", "/booking/modify/colour/confirm"],
  ["src/app/kyc/modify-selection/variant/colour/page.tsx", "/booking/modify/variant/colour"],
  ["src/app/kyc/modify-selection/variant/confirm/page.tsx", "/booking/modify/variant/confirm"],
  ["src/app/kyc/modify-selection/different-car/page.tsx", "/booking/modify/different-car"],
];

for (const [rel, to] of SIMPLE) write(rel, simpleRedirect(to));

write(
  "src/app/kyc/buying-guide/[step]/page.tsx",
  `import { Suspense } from "react";

import { LegacyBuyingGuideStepRedirect } from "@/components/molecules/LegacyBuyingGuideStepRedirect";

export function generateStaticParams() {
  return [{ step: "1" }, { step: "2" }, { step: "3" }];
}

export default function LegacyBuyingGuideRedirectPage() {
  return (
    <Suspense fallback={null}>
      <LegacyBuyingGuideStepRedirect />
    </Suspense>
  );
}
`,
);

write(
  "src/app/kyc/modify-selection/[choice]/page.tsx",
  `import { Suspense } from "react";

import { LegacyModifyChoiceRedirect } from "@/components/molecules/LegacyModifyChoiceRedirect";

export function generateStaticParams() {
  return [{ choice: "colour" }, { choice: "variant" }];
}

export default function LegacyModifyChoiceRedirectPage() {
  return (
    <Suspense fallback={null}>
      <LegacyModifyChoiceRedirect />
    </Suspense>
  );
}
`,
);

write(
  "src/app/kyc/modify-selection/different-car/[brand]/page.tsx",
  prefixRedirectPage({
    staticParamsImport:
      'import { getModifySelectionCarBrandStaticParams } from "@/constants/modify-selection-car-brands-content";',
    staticParamsCall: "getModifySelectionCarBrandStaticParams()",
  }),
);

for (const rel of [
  "src/app/kyc/modify-selection/different-car/[brand]/[model]/page.tsx",
  "src/app/kyc/modify-selection/different-car/[brand]/[model]/colour/page.tsx",
  "src/app/kyc/modify-selection/different-car/[brand]/[model]/confirm/page.tsx",
]) {
  write(
    rel,
    prefixRedirectPage({
      staticParamsImport:
        'import { getModifySelectionCarModelStaticParams } from "@/constants/modify-selection-car-models-content";',
      staticParamsCall: "getModifySelectionCarModelStaticParams()",
    }),
  );
}

console.log("done");
