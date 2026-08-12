"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type LegacyPrefixRedirectProps = {
  fromPrefix: string;
  toPrefix: string;
};

/** Swap a legacy path prefix for the canonical one; preserves query string. */
export function LegacyPrefixRedirect({ fromPrefix, toPrefix }: LegacyPrefixRedirectProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const next = pathname.startsWith(fromPrefix)
      ? `${toPrefix}${pathname.slice(fromPrefix.length)}`
      : pathname;
    const qs = searchParams.toString();
    router.replace(qs ? `${next}?${qs}` : next);
  }, [fromPrefix, pathname, router, searchParams, toPrefix]);

  return null;
}
