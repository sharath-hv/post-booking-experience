"use client";

import { KycTopNavHeader } from "@/components/kyc/KycTopNavHeader";
import { ModifySelectionGetHelpButton } from "@/components/kyc/modify-selection-option-card-ui";

/** Sticky nav for modify-selection routes — always includes callback Get help. */
export function ModifySelectionScreenHeader() {
  return <KycTopNavHeader surface="white" endSlot={<ModifySelectionGetHelpButton />} />;
}
