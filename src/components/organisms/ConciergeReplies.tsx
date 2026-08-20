"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

import { PrimaryCta } from "@/components/atoms/cta/PrimaryCta";
import { SecondaryCta } from "@/components/atoms/cta/SecondaryCta";
import { CTA_LOADER_HOLD_MS } from "@/hooks/use-cta-navigation";
import { writeConciergeEcho } from "@/lib/concierge/echo";
import { cn } from "@/utils/utils";
import styles from "./ConciergeReplies.module.scss";


export type ConciergeReply = {
  /** User-voice label — this is you answering Shivi. */
  label: string;
  href?: string;
  /** Invoked instead of navigating (e.g. open a confirm sheet). */
  onClick?: () => void;
  /**
   * Set when `onClick` routes to the next page (not when it only opens a sheet).
   * `href` replies always show the loader.
   */
  navigates?: boolean;
  /** Filled primary vs quiet secondary answer. */
  kind?: "primary" | "soft";
  /**
   * Words echoed on the next turn (defaults to `label`); `null` sends silently.
   */
  echo?: string | null;
  /** Not answerable yet (e.g. documents still missing). */
  disabled?: boolean;
};

export type ConciergeRepliesProps = {
  replies: readonly ConciergeReply[];
  className?: string;
  /** Side-by-side buttons for two short replies (default: stacked). */
  layout?: "column" | "row";
};

function replyNavigates(reply: ConciergeReply): boolean {
  return Boolean(reply.href) || reply.navigates === true;
}

/** The user's reply affordances — buttons that act as their side of the dialogue. */
export function ConciergeReplies({ replies, className, layout = "column" }: ConciergeRepliesProps) {
  const router = useRouter();
  const [sendingLabel, setSendingLabel] = useState<string | null>(null);
  const sentRef = useRef(false);

  const onReply = (reply: ConciergeReply) => {
    const willNavigate = replyNavigates(reply);
    if (willNavigate) {
      if (sentRef.current) return;
      sentRef.current = true;
      setSendingLabel(reply.label);
    }

    if (reply.onClick) {
      if (reply.echo != null) {
        writeConciergeEcho(reply.echo);
      }
      if (willNavigate) {
        window.setTimeout(() => {
          reply.onClick?.();
        }, CTA_LOADER_HOLD_MS);
        if (!reply.href) return;
      } else {
        reply.onClick();
        if (!reply.href) return;
      }
    }

    if (!reply.href) return;
    const href = reply.href;
    if (reply.echo !== null) {
      writeConciergeEcho(reply.echo ?? reply.label);
    }
    window.setTimeout(() => {
      router.push(href);
    }, CTA_LOADER_HOLD_MS);
  };

  return (
    <div className={cn(styles.flex_0, layout === "row" && styles.row, className)}>
      {replies.map((reply) => {
        const isSending = sendingLabel === reply.label;
        const Cta = reply.kind === "soft" ? SecondaryCta : PrimaryCta;
        return (
          <Cta
            key={reply.label}
            disabled={sendingLabel != null ? !isSending : reply.disabled}
            onClick={() => onReply(reply)}
            loading={isSending}
          >
            {reply.label}
          </Cta>
        );
      })}
    </div>
  );
}
