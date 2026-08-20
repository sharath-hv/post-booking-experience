import { Suspense } from "react";

import { LegacyPathRedirect } from "@/components/molecules/LegacyPathRedirect";
import { BUYING_GUIDE_ENTRY_PATH } from "@/helpers/buying-guide-urls";

/** Legacy — Shivi RM intro removed; redirects to buying-guide step 1. */
export default function LegacyBookingSuccessNextPage() {
  return (
    <Suspense fallback={null}>
      <LegacyPathRedirect to={BUYING_GUIDE_ENTRY_PATH} />
    </Suspense>
  );
}
