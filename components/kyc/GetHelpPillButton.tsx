"use client";

import Image from "next/image";

import shiviAvatar from "@/assets/Shivi small.png";
import { cn } from "@/lib/utils";
import styles from "./GetHelpPillButton.module.scss";


type GetHelpPillButtonProps = {
  /** Coachmark state — Shivi intro on KYC pending ([Figma 2479:7600](https://www.figma.com/design/nW5SWmJdxxsCEDlqBN7C0L/Post-booking-experience?node-id=2479-7600)). */
  highlighted?: boolean;
  /** Translucent pill on dark loan-application header ([Figma 2841:8477](https://www.figma.com/design/nW5SWmJdxxsCEDlqBN7C0L/Post-booking-experience?node-id=2841-8477)). */
  variant?: "default" | "onDark";
  onClick?: () => void;
};

/** Nav “Get help” pill — aligned with `/kyc` (KycPendingScreen) and booking-processing shell. */
export function GetHelpPillButton({
  highlighted = false,
  variant = "default",
  onClick,
}: GetHelpPillButtonProps) {
  const onDark = variant === "onDark";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={highlighted ? "true" : undefined}
      className={cn(
        styles.flex_1,
        onDark
          ? styles.bg_white_20_2
          : styles.border_3,
        !onDark && (highlighted ? styles.highlighted : styles.borderIdle)
      )}
    >
      <span
        className={cn(
          styles.relative_4,
          onDark ? styles.w_9_5 : styles.w_9_6
        )}
        aria-hidden
      >
        <Image
          src={shiviAvatar}
          alt=""
          fill
          className={styles.object_cover_0}
          unoptimized
          sizes="36px"
        />
      </span>
      <span className={cn(styles.text_xs_7, onDark && styles.text_white_8)}>
        Get help
      </span>
    </button>
  );
}
