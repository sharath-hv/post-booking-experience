"use client";

import { GetHelpPillButton } from "@/components/kyc/GetHelpPillButton";
import { ShiviIntroNavArrow } from "@/components/kyc/ShiviIntroNavArrow";
import styles from "./ShiviIntroCoachmark.module.scss";


/**
 * “Get help” + centered arrow above the Shivi intro backdrop ([Figma 2479:7600](https://www.figma.com/design/nW5SWmJdxxsCEDlqBN7C0L/Post-booking-experience?node-id=2479-7600)).
 */
export function ShiviIntroCoachmark() {
  return (
    <div className={styles.pointer_events_none_0}>
      <div className={styles.flex_1}>
        <div className={styles.pointer_events_auto_2}>
          <GetHelpPillButton highlighted />
        </div>
      </div>

      <div className={styles.flex_3}>
        <ShiviIntroNavArrow />
      </div>
    </div>
  );
}
