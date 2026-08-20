import Image from "next/image";

import warningAmberIcon from "@/assets/Warning amber.svg";

import styles from "./StatusGlyph.module.scss";

export type StatusGlyphState = "loading" | "done" | "queued" | "warning" | "clock";

export type StatusGlyphProps = {
  state: StatusGlyphState;
};

function SpinnerIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={styles.spin}
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.2" strokeWidth="2.5" />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function DoneTickIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden className={styles.static}>
      <circle cx="12" cy="12" r="9" fill="#0fa457" />
      <path
        d="M8.4 12.2l2.4 2.4 4.8-5"
        stroke="#ffffff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function QueuedIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden className={styles.static}>
      <circle cx="12" cy="12" r="8.5" stroke="#c2c2c2" strokeWidth="1" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 16 16" fill="none" aria-hidden className={styles.static}>
      <path
        d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z"
        stroke="#4B4B4B"
      />
      <path
        d="M8 5.60156V8.00156L9.2 9.20156"
        stroke="#4B4B4B"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function WarningIcon() {
  return (
    <Image
      src={warningAmberIcon}
      alt=""
      width={20}
      height={20}
      className={styles.static}
      unoptimized
      aria-hidden
    />
  );
}

/** Spinner / tick / queued / warning / clock — 20px status mark. */
export function StatusGlyph({ state }: StatusGlyphProps) {
  switch (state) {
    case "loading":
      return <SpinnerIcon />;
    case "done":
      return <DoneTickIcon />;
    case "queued":
      return <QueuedIcon />;
    case "warning":
      return <WarningIcon />;
    case "clock":
      return <ClockIcon />;
    default:
      return null;
  }
}
