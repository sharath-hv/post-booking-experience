"use client";

import { TopNavHeader } from "@/components/organisms/TopNavHeader";
import { GetHelpCallButton } from "@/components/organisms/GetHelpCallButton";

/** Sticky nav for standalone (non-concierge) screens — solid bar + Get help. */
export function StandaloneScreenHeader() {
  return <TopNavHeader surface="white" solid endSlot={<GetHelpCallButton />} />;
}
