"use client";

import { useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

export function LegacyModifyChoiceRedirect() {
  const router = useRouter();
  const params = useParams<{ choice: string }>();
  const searchParams = useSearchParams();

  useEffect(() => {
    const choice = params?.choice ?? "colour";
    const qs = searchParams.toString();
    const target = qs ? `/booking/modify/${choice}?${qs}` : `/booking/modify/${choice}`;
    router.replace(target);
  }, [params, router, searchParams]);

  return null;
}
