"use client";

import { useEffect, useState } from "react";

import { ShimmerInfoCard } from "@/components/ui/ShimmerInfoCard";
import styles from "./DeadlineCountdownFootnote.module.scss";

const TICK_MS = 1_000;

type DeadlineCountdownFootnoteProps = {
  durationMs: number;
  storageKey: string;
  copy: string;
};

function readDeadlineAt(storageKey: string, durationMs: number): number {
  try {
    const existing = sessionStorage.getItem(storageKey);
    if (existing != null) {
      const parsed = Number(existing);
      if (Number.isFinite(parsed)) return parsed;
    }
  } catch {
    /* private mode / blocked storage */
  }
  const deadline = Date.now() + durationMs;
  try {
    sessionStorage.setItem(storageKey, String(deadline));
  } catch {
    /* ignore */
  }
  return deadline;
}

/** "47h 59m 12s left" above an hour, "12m 05s left" once under an hour, "05s left" under a minute. */
function formatTimeLeft(ms: number): string {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1_000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  if (hours > 0) return `${hours}h ${pad(minutes)}m ${pad(seconds)}s left`;
  if (minutes > 0) return `${minutes}m ${pad(seconds)}s left`;
  return `${seconds}s left`;
}

/**
 * Clock callout with an inline countdown — same pattern as arrival paperwork stakes.
 */
export function DeadlineCountdownFootnote({
  durationMs,
  storageKey,
  copy,
}: DeadlineCountdownFootnoteProps) {
  const [deadlineAt, setDeadlineAt] = useState<number | null>(null);
  const [now, setNow] = useState(0);

  useEffect(() => {
    setDeadlineAt(readDeadlineAt(storageKey, durationMs));
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), TICK_MS);
    return () => window.clearInterval(id);
  }, [durationMs, storageKey]);

  const timeLeft = formatTimeLeft(deadlineAt == null ? durationMs : deadlineAt - now);

  return (
    <ShimmerInfoCard icon="clock">
      {copy}{" "}
      <span className={styles.timeLeft} aria-live="polite" aria-atomic="true">
        {timeLeft}
      </span>
    </ShimmerInfoCard>
  );
}

/** Arrival — 48h to finish paperwork. */
export function PaperworkDeadlineFootnote() {
  return (
    <DeadlineCountdownFootnote
      durationMs={48 * 60 * 60 * 1000}
      storageKey="concierge.paperworkDeadlineAt"
      copy="Finish your paperwork before the timer runs out to keep your booking active."
    />
  );
}

/** Verification failed — 24h to re-upload. */
export function ReuploadDeadlineFootnote() {
  return (
    <DeadlineCountdownFootnote
      durationMs={24 * 60 * 60 * 1000}
      storageKey="concierge.reuploadDeadlineAt"
      copy="Re-upload before time runs out, or this booking will be cancelled."
    />
  );
}
