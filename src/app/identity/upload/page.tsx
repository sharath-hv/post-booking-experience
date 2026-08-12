"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { JOURNEY_PATHS } from "@/helpers/journey-routes";

/**
 * Legacy — document upload now happens inline on the `/identity` turn
 * (verification-failed re-upload links land here too).
 */
export default function LegacyIdentityUploadPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace(JOURNEY_PATHS.identity.hub);
  }, [router]);

  return null;
}
