"use client";

import { useCallback, useRef, useState } from "react";

/** How long the in-button Lottie stays up before the route change. */
export const CTA_LOADER_HOLD_MS = 2000;

/**
 * Locks a navigate-on-click CTA so the loader plays for {@link CTA_LOADER_HOLD_MS}
 * before the next page mounts.
 */
export function useCtaNavigation() {
  const [loading, setLoading] = useState(false);
  const lockedRef = useRef(false);
  const timeoutRef = useRef<number | null>(null);

  const start = useCallback((navigate: () => void) => {
    if (lockedRef.current) return;
    lockedRef.current = true;
    setLoading(true);
    timeoutRef.current = window.setTimeout(() => {
      timeoutRef.current = null;
      navigate();
    }, CTA_LOADER_HOLD_MS);
  }, []);

  const reset = useCallback(() => {
    lockedRef.current = false;
    setLoading(false);
    if (timeoutRef.current != null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  return { loading, start, reset } as const;
}
