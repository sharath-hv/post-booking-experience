"use client";

import Image, { type StaticImageData } from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, type ReactNode } from "react";

import infoIcon from "@/assets/Info.svg";

import { ConciergeTurnShell } from "@/components/concierge/ConciergeTurnShell";
import type { ConciergeReply } from "@/components/concierge/ConciergeReplies";
import { isDemoNavCtaLabel } from "@/lib/demo-nav-cta";

const DEFAULT_PROCESSING_HEADLINE = "We're processing your booking, Sharath!";

const DEFAULT_PROCESSING_SUBLINE =
  "We are finding the right dealer with your exact Creta variant and colour in stock.";

const DEFAULT_NEXT_HREF = "/kyc/booking-confirmed";

export type KycBookingProcessingScreenProps = {
  headline?: string;
  /** When set, shown as a second block below `headline` (word-by-word after line 1 completes). */
  headlineLine2?: string;
  subline?: string;
  /** Optional info box below `subline` (dealer OTP callout, car allocation explainer, etc.). */
  sublineLine2?: string;
  /** Optional titled info callout below `subline` (preferred when a heading is needed). */
  infoBox?: { title?: string; body: ReactNode };
  /** Info callout icon (default: Info.svg). */
  infoBoxIconSrc?: string | StaticImageData;
  /** Primary “Next” CTA destination. */
  nextHref?: string;
  /** Route to warm in the background (defaults to `nextHref`). */
  prefetchHref?: string;
  /** Orange deadline copy above the primary CTA (same pattern as `/payment/default`). */
  ctaWarningLine?: string;
  /** Primary CTA label (default “Next” → renders as a demo time-skip). */
  nextCtaLabel?: string;
  /** Alternate demo branch under the time skip (e.g. the failure path). */
  altTimeSkip?: { label: string; href: string };
  /**
   * When set, primary CTA invokes this instead of navigating to `nextHref` (e.g. open a confirm sheet).
   */
  onPrimaryCtaClick?: () => void;
  /** Optional summary card rendered as an artifact below Shivi's lines. */
  heroSummaryCard?: ReactNode;
  /** Legacy hero slots — concierge turns are dialogue-first, so these are ignored. */
  heroIllustrationSlot?: ReactNode;
  belowHeadline?: ReactNode;
  heroIllustrationSrc?: string | StaticImageData;
  heroIllustrationWidth?: number;
  heroIllustrationHeight?: number;
  /** Conversation date divider — e.g. “Thu 24 Apr · morning”. */
  dayStamp?: string;
  /** Echo written when the primary reply navigates (defaults to the label). */
  replyEcho?: string | null;
  /** Contextual call affordance — essential on waiting screens, where anxiety peaks. */
  callLabel?: string;
  /** Manage-booking sheet — post–car-allocation car card (engine/chassis + copy). */
  manageBookingShowVehicleIdentification?: boolean;
};

/**
 * Concierge adapter — every screen that used the old booking-processing hero
 * (finance, delivery, self-finance) renders as a Shivi turn: her lines from
 * `headline`/`subline`, artifacts from the info box and summary card, and the
 * CTA as the user's reply (demo “Next” becomes a time-skip pill). The full
 * journey plan lives in the manage layer behind the expand button.
 */
export function KycBookingProcessingScreen({
  headline = DEFAULT_PROCESSING_HEADLINE,
  headlineLine2,
  subline = DEFAULT_PROCESSING_SUBLINE,
  sublineLine2,
  infoBox,
  infoBoxIconSrc = infoIcon,
  nextHref = DEFAULT_NEXT_HREF,
  prefetchHref = nextHref,
  ctaWarningLine,
  nextCtaLabel = "Next",
  altTimeSkip,
  onPrimaryCtaClick,
  heroSummaryCard,
  belowHeadline,
  dayStamp,
  replyEcho,
  callLabel,
  manageBookingShowVehicleIdentification,
}: KycBookingProcessingScreenProps = {}) {
  const router = useRouter();

  useEffect(() => {
    router.prefetch(prefetchHref);
  }, [router, prefetchHref]);

  const says = useMemo(() => {
    const lead = headlineLine2 ? `${headline} ${headlineLine2}` : headline;
    return subline.length > 0 ? [lead, subline] : [lead];
  }, [headline, headlineLine2, subline]);

  const isDemoNav = isDemoNavCtaLabel(nextCtaLabel);

  const replies = useMemo<readonly ConciergeReply[] | undefined>(() => {
    if (isDemoNav) return undefined;
    if (onPrimaryCtaClick) {
      return [{ label: nextCtaLabel, onClick: onPrimaryCtaClick, echo: null }];
    }
    return [{ label: nextCtaLabel, href: nextHref, echo: replyEcho }];
  }, [isDemoNav, nextCtaLabel, onPrimaryCtaClick, nextHref, replyEcho]);

  const timeSkip = isDemoNav ? { label: "Skip ahead", href: nextHref } : undefined;

  const artifact = (
    <>
      {infoBox != null || sublineLine2 ? (
        <div className="flex items-center gap-3 rounded-2xl bg-white card-elevated px-3 py-3 text-left">
          <span className="relative h-5 w-5 shrink-0">
            <Image src={infoBoxIconSrc} alt="" fill className="object-contain" unoptimized sizes="20px" />
          </span>
          <div className="min-w-0 text-xs leading-[18px] text-[#121212]">
            {infoBox?.title ? <p className="font-medium text-[#121212]">{infoBox.title}</p> : null}
            <p className={infoBox?.title ? "mt-1 text-[#121212]" : undefined}>
              {infoBox?.body ?? sublineLine2}
            </p>
          </div>
        </div>
      ) : null}
      {heroSummaryCard}
    </>
  );

  return (
    <ConciergeTurnShell
      dayStamp={dayStamp}
      says={says}
      afterBody={belowHeadline}
      artifact={artifact}
      replies={replies}
      timeSkip={timeSkip}
      altTimeSkip={altTimeSkip}
      footnote={ctaWarningLine}
      callLabel={callLabel}
      manageShowVehicleIdentification={manageBookingShowVehicleIdentification}
    />
  );
}
