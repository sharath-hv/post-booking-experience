"use client";

import { useState } from "react";

import { GetHelpPillButton } from "@/components/molecules/GetHelpPillButton";
import { ShiviCallSheet } from "@/components/organisms/ShiviCallSheet";

/** Nav “Get help” — opens Shivi’s callback confirmation sheet. */
export function GetHelpCallButton() {
  const [callSheetOpen, setCallSheetOpen] = useState(false);

  return (
    <>
      <GetHelpPillButton onClick={() => setCallSheetOpen(true)} />
      <ShiviCallSheet open={callSheetOpen} onClose={() => setCallSheetOpen(false)} />
    </>
  );
}
