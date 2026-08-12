"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { isModifyNoChargesFlow } from "@/helpers/experience-flow";
import { JOURNEY_PATHS } from "@/helpers/journey-routes";

export default function KycCarAllocationConfirmedRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace(
      isModifyNoChargesFlow()
        ? JOURNEY_PATHS.identity.hub
        : JOURNEY_PATHS.carAllocation.confirmed,
    );
  }, [router]);

  return null;
}
