"use client";

import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";

import { PrimaryCta } from "@/components/atoms/cta/PrimaryCta";
import { CarContentCard } from "@/components/molecules/card/CarContentCard";
import { PageLeadHeading } from "@/components/organisms/PageLeadHeading";
import { StandaloneScreenHeader } from "@/components/organisms/StandaloneScreenHeader";
import { ModifySelectionColourCard } from "@/components/organisms/kyc/ModifySelectionColourCard";
import { ModifySelectionDeliveryOptionBottomSheet } from "@/components/organisms/kyc/ModifySelectionDeliveryOptionBottomSheet";
import {
  getModifySelectionAvailableColourOptions,
  MODIFY_SELECTION_AVAILABLE_COLOURS_HEADING,
  MODIFY_SELECTION_COLOUR_CONFIRM_PATH,
  MODIFY_SELECTION_COLOUR_SCREEN_SUBLINE,
  MODIFY_SELECTION_COLOUR_SCREEN_TITLE,
  type ModifySelectionDeliveryChoice,
} from "@/constants/modify-selection-colours-content";
import {
  MODIFY_SELECTION_CURRENT_SELECTION_HEADING,
  MODIFY_SELECTION_PAGE_SHELL_CLASS,
} from "@/constants/modify-selection-content";
import {
  readModifySelectionColourPending,
  writeModifySelectionColourPending,
} from "@/helpers/modify-selection-colour-pending";
import styles from "./ModifySelectionColourScreen.module.scss";

import {
  modifySelectionCardStaggerDelay,
  MODIFY_SELECTION_STAGGER_MS,
} from "@/helpers/modify-selection-stagger";
import { useCtaNavigation } from "@/hooks/use-cta-navigation";

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
  const { loading, start } = useCtaNavigation();
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
    start(() => goToConfirmation("standard"));
  }, [goToConfirmation, selectedColour, start]);

  const onDeliveryConfirm = useCallback(
    (deliveryChoice: ModifySelectionDeliveryChoice) => {
      goToConfirmation(deliveryChoice);
    },
    [goToConfirmation],
  );

  return (
    <div className={MODIFY_SELECTION_PAGE_SHELL_CLASS}>
      <StandaloneScreenHeader />

      <main className={styles.mx_auto_0}>
        <header className={styles.lead}>
          <PageLeadHeading
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
          <CarContentCard variant="detailsOnly" />
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
          <PrimaryCta
            disabled={selectedColourId == null}
            loading={loading}
            onClick={onContinue}
            className={styles.primary_cta_9}
          >
            Continue
          </PrimaryCta>
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
