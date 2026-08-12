import { Suspense } from "react";

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
