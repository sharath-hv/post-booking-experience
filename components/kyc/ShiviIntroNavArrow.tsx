import Image from "next/image";

import arrowCoachmark from "@/assets/Arrow.svg";
import styles from "./ShiviIntroNavArrow.module.scss";


/**
 * Coachmark arrow — `assets/Arrow.svg` ([Figma 2479:7600](https://www.figma.com/design/nW5SWmJdxxsCEDlqBN7C0L/Post-booking-experience?node-id=2479-7600)).
 */
export function ShiviIntroNavArrow() {
  return (
    <Image
      src={arrowCoachmark}
      alt=""
      width={120}
      height={240}
      className={styles.pointer_events_none_0}
      unoptimized
      aria-hidden
      sizes="120px"
    />
  );
}
