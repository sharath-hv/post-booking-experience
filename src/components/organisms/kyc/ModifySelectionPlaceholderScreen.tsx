"use client";

import { useRouter } from "next/navigation";

import { PageLeadHeading } from "@/components/organisms/PageLeadHeading";
import { StandaloneScreenHeader } from "@/components/organisms/StandaloneScreenHeader";
import { BookingCarSummaryCard } from "@/components/organisms/BookingCarSummaryCard";
import { MODIFY_SELECTION_PAGE_SHELL_CLASS, MODIFY_SELECTION_PATH, modifySelectionChoiceLabel } from "@/constants/modify-selection-content";
import { MODIFY_SELECTION_STAGGER_MS } from "@/helpers/modify-selection-stagger";
import styles from "./ModifySelectionPlaceholderScreen.module.scss";


/** Stagger: nav + footer CTA immediate; then title → summary card. */
const { title: STAGGER_TITLE_MS, section: STAGGER_SECTION_MS } = MODIFY_SELECTION_STAGGER_MS;

type ModifySelectionPlaceholderScreenProps = {
  choiceSlug: string;
};

/** Demo placeholder until colour / variant / car pickers are built. */
export function ModifySelectionPlaceholderScreen({ choiceSlug }: ModifySelectionPlaceholderScreenProps) {
  const router = useRouter();
  const label = modifySelectionChoiceLabel(choiceSlug) ?? "Modify your booking";

  return (
    <div className={MODIFY_SELECTION_PAGE_SHELL_CLASS}>
      <StandaloneScreenHeader />

      <main className={styles.mx_auto_0}>
        <PageLeadHeading title={label} titleDelayMs={STAGGER_TITLE_MS} />
        <div
          className={[styles.payment_success_stagger_1, "payment-success-stagger"].filter(Boolean).join(" ")}
          style={{ animationDelay: `${STAGGER_SECTION_MS}ms` }}
        >
          <BookingCarSummaryCard variant="detailsOnly" />
        </div>
      </main>

      <div className={[styles.fixed_2, "footer-elevated"].filter(Boolean).join(" ")}>
        <div className={styles.mx_auto_3}>
          <button
            type="button"
            onClick={() => router.push(MODIFY_SELECTION_PATH)}
            className={[styles.primary_cta_4, "primary-cta"].filter(Boolean).join(" ")}
          >
            Back to modify options
          </button>
        </div>
      </div>
    </div>
  );
}
