"use client";

import { useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

export function LegacyBuyingGuideStepRedirect() {
  const router = useRouter();
  const params = useParams<{ step: string }>();
  const searchParams = useSearchParams();

  useEffect(() => {
    const step = params?.step ?? "1";
    const qs = searchParams.toString();
    const target = qs ? `/onboarding/${step}?${qs}` : `/onboarding/${step}`;
    router.replace(target);
  }, [params, router, searchParams]);

  return null;
}
