"use client";

import { Suspense } from "react";

import { LegacyPathRedirect } from "@/components/molecules/LegacyPathRedirect";

function RedirectInner() {
  return <LegacyPathRedirect to="/booking/modify/variant/colour" />;
}

export default function LegacyRedirectPage() {
  return (
    <Suspense fallback={null}>
      <RedirectInner />
    </Suspense>
  );
}
