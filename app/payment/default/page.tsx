"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { JOURNEY_PATHS } from "@/lib/journey-routes";

/**
 * Legacy money-intro URL. Car-assigned + payment amount now live on
 * booking-confirmed / allocation-confirmed; continue straight to options.
 */
export default function PaymentDefaultPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace(JOURNEY_PATHS.payment.choose);
  }, [router]);

  return null;
}
