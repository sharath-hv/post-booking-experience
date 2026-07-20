"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { getCancelBookingFlowRedirectTarget } from "@/lib/experience-flow-journey";

type CancelBookingFlowGuardProps = {
  children: React.ReactNode;
};

/**
 * Obsolete — cancel-booking is available in every flow (policy §7).
 * Kept so accidental remounts no longer block express/standard cancel.
 */
export function CancelBookingFlowGuard({ children }: CancelBookingFlowGuardProps) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const target = getCancelBookingFlowRedirectTarget(pathname);
    if (target) {
      router.replace(target);
    }
  }, [pathname, router]);

  return children;
}
