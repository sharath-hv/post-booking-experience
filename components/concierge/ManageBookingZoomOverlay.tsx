"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";

import downloadIcon from "@/assets/Download.svg";
import invoiceIcon from "@/assets/Invoice.svg";

import { PlanList } from "@/components/concierge/artifacts";
import { DEMO_BOOKING_ID } from "@/components/kyc/booking-car-card-content";
import { ManageBookingCarCard, ManageBookingSections } from "@/components/kyc/ManageBookingBottomSheet";
import { BottomSheetPortal } from "@/components/ui/BottomSheetPortal";
import { readExperienceFlow, type ExperienceFlow } from "@/lib/experience-flow";
import {
  getDeliveryDateFull,
  getJourneyReceipts,
  getJourneyStageSteps,
} from "@/lib/journey-stage";
import { cn } from "@/lib/utils";
import { OVERLAY_GLASS_CARD_CLASS } from "@/lib/overlay-glass-card";
import styles from "./ManageBookingZoomOverlay.module.scss";


/** Matches the page-recede transition in ConciergeTurnShell. */
export const ZOOM_OVERLAY_MS = 650;
/** Transition names `scale`/`filter` explicitly for the zoom overlay. */
const ZOOM_TRANSITION = styles.zoomTransition;

export type ManageBookingZoomOverlayProps = {
  /** Layer is in the DOM (mount before animating so layout/decode never eats animation frames). */
  mounted: boolean;
  /** Animated-in state — drives the zoom; toggled a frame after mount by the shell. */
  shown: boolean;
  onClose: () => void;
  showVehicleIdentification?: boolean;
  /** Who the delivery date currently waits on — from the shell's turn. */
  dateHolder?: "you" | "shivi";
};

function ReceiptGlyph() {
  return (
    <Image
      src={invoiceIcon}
      alt=""
      width={20}
      height={20}
      className={styles.shrink_0_0}
      unoptimized
      aria-hidden
    />
  );
}

/**
 * Dot-style layer presentation for the manage-booking content: the page
 * recedes into depth (handled by the shell) while this layer settles in,
 * scaling down from slightly above as it lands. Controlled by the shell's
 * state machine so both layers move on the exact same clock.
 */
export function ManageBookingZoomOverlay({
  mounted,
  shown,
  onClose,
  showVehicleIdentification = false,
  dateHolder = "shivi",
}: ManageBookingZoomOverlayProps) {
  const pathname = usePathname();
  const [flow, setFlow] = useState<ExperienceFlow | undefined>(undefined);

  useEffect(() => {
    if (!mounted) return;
    setFlow(readExperienceFlow());
  }, [mounted]);

  const steps = useMemo(() => getJourneyStageSteps(pathname, flow), [pathname, flow]);
  const receipts = useMemo(() => getJourneyReceipts(pathname), [pathname]);
  const nowStep = steps.find((step) => step.status === "now");
  const deliveryDate = getDeliveryDateFull(flow);
  /** Scroll lock — compensate for the scrollbar so the page never reflows. */
  useEffect(() => {
    if (!mounted) return;
    const { overflow, paddingRight } = document.body.style;
    const gutter = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (gutter > 0) document.body.style.paddingRight = `${gutter}px`;
    return () => {
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
    };
  }, [mounted]);

  useEffect(() => {
    if (!shown) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [shown, onClose]);

  const onScrimClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (event.target === event.currentTarget) onClose();
    },
    [onClose]
  );

  if (!mounted) return null;

  return (
    <BottomSheetPortal>
      <div className={styles.fixed_1} role="dialog" aria-modal="true" aria-label="Your car">
        {/* Light veil over the aurora surface — the page itself fades out fully. */}
        <div
          aria-hidden
          className={cn(
            styles.absolute_18,
            shown ? styles.opacity_100_19 : styles.opacity_0_20
          )}
        />
        <div
          className={styles.absolute_2}
          onClick={onScrimClick}
        >
          <div
            className={cn(styles.relative_0,
              cn(ZOOM_TRANSITION, styles.willChangeZoom),
              styles.motionReduceNone,
              shown ? styles.zoomShown : styles.zoomHidden
            )}
          >
            <div className={styles.mb_5_3}>
              <h2 className={styles.text_20px__4}>
                Your car
              </h2>
              <p className={styles.mt_1_5}>
                Reference ID: {DEMO_BOOKING_ID}
              </p>
            </div>

            <div className={styles.flex_6}>
              {/* The living delivery date — the one number this purchase is about. */}
              <div className={cn(styles.flex_21, OVERLAY_GLASS_CARD_CLASS)}>
                <div className={styles.min_w_0_7}>
                  <p className={styles.text_xs_8}>
                    Arriving
                  </p>
                  <p className={styles.text_xl_9}>
                    {deliveryDate}
                  </p>
                </div>
                <span
                  className={cn(
                    styles.shrink_0_22,
                    dateHolder === "you"
                      ? styles.bg_fff7e5__24
                      : styles.bg_e7f6ee__25
                  )}
                >
                  {dateHolder === "you"
                    ? `Waiting on you — ${nowStep?.title.toLowerCase() ?? "this step"}`
                    : "On track ✓"}
                </span>
              </div>

              <ManageBookingCarCard showVehicleIdentification={showVehicleIdentification} />
            </div>

            <section aria-labelledby="purchase-state-timeline-heading" className={styles.mt_8_10}>
              <h3
                id="purchase-state-timeline-heading"
                className={styles.mb_4_11}
              >
                Where we are
              </h3>
              <PlanList items={steps} variant="glass" />
            </section>

            <div className={styles.mt_8_10}>
              <Suspense fallback={null}>
                <ManageBookingSections
                  onClose={onClose}
                  showVehicleIdentification={showVehicleIdentification}
                  surface="overlay"
                  hideCarCard
                  beforeChange={
                    <section aria-labelledby="purchase-state-receipts-heading">
                      <h3
                        id="purchase-state-receipts-heading"
                        className={styles.mb_4_11}
                      >
                        Receipts and documents
                      </h3>
                      <div className={OVERLAY_GLASS_CARD_CLASS}>
                        {receipts.map((receipt, idx) => (
                          <button
                            key={receipt.title}
                            type="button"
                            className={cn(
                              styles.flex_26,
                              idx > 0 && styles.border_t_27
                            )}
                          >
                            <span className={styles.flex_12}>
                              <ReceiptGlyph />
                            </span>
                            <span className={styles.min_w_0_13}>
                              <span className={styles.block_14}>
                                {receipt.title}
                              </span>
                              <span className={styles.mt_0_5_15}>
                                {receipt.meta}
                              </span>
                            </span>
                            <span className={styles.relative_16} aria-hidden>
                              <Image
                                src={downloadIcon}
                                alt=""
                                fill
                                className={styles.object_contain_17}
                                unoptimized
                                sizes="20px"
                              />
                            </span>
                          </button>
                        ))}
                      </div>
                    </section>
                  }
                />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </BottomSheetPortal>
  );
}
