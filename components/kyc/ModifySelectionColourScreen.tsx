"use client";

import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";

import { BookingCarSummaryCard } from "@/components/kyc/BookingCarSummaryCard";
import { ModifySelectionPageHeading } from "@/components/kyc/ModifySelectionPageHeading";
import { ModifySelectionScreenHeader } from "@/components/kyc/ModifySelectionScreenHeader";
import { ModifySelectionColourCard } from "@/components/kyc/ModifySelectionColourCard";
import { ModifySelectionDeliveryOptionBottomSheet } from "@/components/kyc/ModifySelectionDeliveryOptionBottomSheet";
import {
  getModifySelectionAvailableColourOptions,
  MODIFY_SELECTION_AVAILABLE_COLOURS_HEADING,
  MODIFY_SELECTION_COLOUR_CONFIRM_PATH,
  MODIFY_SELECTION_COLOUR_SCREEN_SUBLINE,
  MODIFY_SELECTION_COLOUR_SCREEN_TITLE,
  type ModifySelectionDeliveryChoice,
} from "@/lib/modify-selection-colours-content";
import {
  MODIFY_SELECTION_CURRENT_SELECTION_HEADING,
  MODIFY_SELECTION_PAGE_SHELL_CLASS,
} from "@/lib/modify-selection-content";
import {
  readModifySelectionColourPending,
  writeModifySelectionColourPending,
} from "@/lib/modify-selection-colour-pending";
import styles from "./ModifySelectionColourScreen.module.scss";

import {
  modifySelectionCardStaggerDelay,
  MODIFY_SELECTION_STAGGER_MS,
} from "@/lib/modify-selection-stagger";

/** Stagger: nav + footer CTA immediate; then title → summary → heading → colour cards. */
const {
  title: STAGGER_TITLE_MS,
  subtext: STAGGER_SUBTEXT_MS,
  section: STAGGER_CAR_SUMMARY_MS,
  heading: STAGGER_SECTION_HEADING_MS,
  firstCard: STAGGER_FIRST_COLOUR_MS,
} = MODIFY_SELECTION_STAGGER_MS;

/**
 * Change colour — booked car summary + available colour cards (Figma 2672:10452).
 */
export function ModifySelectionColourScreen() {
  const router = useRouter();
  const availableColours = useMemo(() => getModifySelectionAvailableColourOptions(), []);
  const [selectedColourId, setSelectedColourId] = useState<string | null>(() => {
    const pending = readModifySelectionColourPending();
    return pending?.colourId ?? null;
  });
  const [deliverySheetOpen, setDeliverySheetOpen] = useState(false);
  const pendingDeliveryChoice = useMemo(
    () => readModifySelectionColourPending()?.deliveryChoice,
    [],
  );

  const selectedColour = useMemo(
    () => availableColours.find((option) => option.id === selectedColourId) ?? null,
    [availableColours, selectedColourId],
  );

  const goToConfirmation = useCallback(
    (deliveryChoice: ModifySelectionDeliveryChoice) => {
      if (selectedColour == null) return;
      writeModifySelectionColourPending({
        colourId: selectedColour.id,
        deliveryChoice,
      });
      setDeliverySheetOpen(false);
      router.push(MODIFY_SELECTION_COLOUR_CONFIRM_PATH);
    },
    [router, selectedColour],
  );

  const onContinue = useCallback(() => {
    if (selectedColour == null) return;
    if (selectedColour.isExpressDelivery) {
      setDeliverySheetOpen(true);
      return;
    }
    goToConfirmation("standard");
  }, [goToConfirmation, selectedColour]);

  const onDeliveryConfirm = useCallback(
    (deliveryChoice: ModifySelectionDeliveryChoice) => {
      goToConfirmation(deliveryChoice);
    },
    [goToConfirmation],
  );

  return (
    <div className={MODIFY_SELECTION_PAGE_SHELL_CLASS}>
      <ModifySelectionScreenHeader />

      <main className={styles.mx_auto_0}>
        <header className={styles.lead}>
          <ModifySelectionPageHeading
            title={MODIFY_SELECTION_COLOUR_SCREEN_TITLE}
            subline={MODIFY_SELECTION_COLOUR_SCREEN_SUBLINE}
            titleDelayMs={STAGGER_TITLE_MS}
            sublineDelayMs={STAGGER_SUBTEXT_MS}
          />
        </header>

        <section
          className={[styles.currentSelection, "payment-success-stagger"].filter(Boolean).join(" ")}
          style={{ animationDelay: `${STAGGER_CAR_SUMMARY_MS}ms` }}
          aria-labelledby="modify-selection-current-selection-heading"
        >
          <h2
            id="modify-selection-current-selection-heading"
            className={styles.currentSelectionLabel}
          >
            {MODIFY_SELECTION_CURRENT_SELECTION_HEADING}
          </h2>
          <BookingCarSummaryCard variant="detailsOnly" />
        </section>

        <section
          className={styles.availableColours}
          aria-labelledby="modify-selection-available-colours-heading"
        >
          <h2
            id="modify-selection-available-colours-heading"
            className={[styles.availableColoursHeading, "payment-success-stagger"].filter(Boolean).join(" ")}
            style={{ animationDelay: `${STAGGER_SECTION_HEADING_MS}ms` }}
          >
            {MODIFY_SELECTION_AVAILABLE_COLOURS_HEADING}
          </h2>

          <div
            className={styles.colourList}
            role="group"
            aria-label={MODIFY_SELECTION_AVAILABLE_COLOURS_HEADING}
          >
            {availableColours.map((option, index) => (
              <div
                key={option.id}
                className={[styles.colourListItem, "payment-success-stagger"].filter(Boolean).join(" ")}
                style={{
                  animationDelay: `${modifySelectionCardStaggerDelay(index, STAGGER_FIRST_COLOUR_MS)}ms`,
                }}
              >
                <ModifySelectionColourCard
                  option={option}
                  selected={selectedColourId === option.id}
                  onSelect={() => setSelectedColourId(option.id)}
                />
              </div>
            ))}
          </div>
        </section>
      </main>

      <div className={[styles.fixed_7, "footer-elevated"].filter(Boolean).join(" ")}>
        <div className={styles.mx_auto_8}>
          <button
            type="button"
            disabled={selectedColourId == null}
            onClick={onContinue}
            className={[styles.primary_cta_9, "primary-cta"].filter(Boolean).join(" ")}
          >
            Continue
          </button>
        </div>
      </div>

      {selectedColour?.isExpressDelivery ? (
        <ModifySelectionDeliveryOptionBottomSheet
          open={deliverySheetOpen}
          onClose={() => setDeliverySheetOpen(false)}
          onConfirm={onDeliveryConfirm}
          initialDeliveryChoice={pendingDeliveryChoice}
          expressDeliveryPriceInr={selectedColour.ackoDrivePriceInr}
          expressDeliveryLine={selectedColour.deliveryLine}
        />
      ) : null}
    </div>
  );
}
