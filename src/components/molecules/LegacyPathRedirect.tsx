"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type LegacyPathRedirectProps = {
  /** Canonical path (no query). Query string from the current URL is preserved. */
  to: string;
};

/**
 * Thin client redirect for renamed journey URLs.
 * Preserves search params so demos/bookmarks keep working.
 */
export function LegacyPathRedirect({ to }: LegacyPathRedirectProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const qs = searchParams.toString();
    const target = qs ? `${to}?${qs}` : to;
    if (pathname !== to) {
      router.replace(target);
    }
  }, [pathname, router, searchParams, to]);

  return null;
}
