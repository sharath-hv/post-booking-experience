"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { JOURNEY_PATHS } from "@/helpers/journey-routes";

/**
 * Legacy — the cancellation success is now a phase of the cancel turn itself.
 */
export default function LegacyCancelBookingSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace(JOURNEY_PATHS.booking.cancel);
  }, [router]);

  return null;
}
