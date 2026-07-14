"use client";

import { useRouter } from "next/navigation";

import { ModifySelectionPageHeading } from "@/components/kyc/ModifySelectionPageHeading";
import { ModifySelectionScreenHeader } from "@/components/kyc/ModifySelectionScreenHeader";
import { BookingCarSummaryCard } from "@/components/kyc/BookingCarSummaryCard";
import { MODIFY_SELECTION_PAGE_SHELL_CLASS, MODIFY_SELECTION_PATH, modifySelectionChoiceLabel } from "@/lib/modify-selection-content";
import { MODIFY_SELECTION_STAGGER_MS } from "@/lib/modify-selection-stagger";

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
      <ModifySelectionScreenHeader />

      <main className="mx-auto flex w-full max-w-[640px] flex-1 flex-col px-5 pb-[calc(7rem+env(safe-area-inset-bottom))] pt-2">
        <ModifySelectionPageHeading title={label} titleDelayMs={STAGGER_TITLE_MS} />
        <div
          className="payment-success-stagger mt-8"
          style={{ animationDelay: `${STAGGER_SECTION_MS}ms` }}
        >
          <BookingCarSummaryCard variant="detailsOnly" />
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-10 pb-[env(safe-area-inset-bottom)] footer-elevated">
        <div className="mx-auto w-full max-w-[640px] bg-white px-5 py-4">
          <button
            type="button"
            onClick={() => router.push(MODIFY_SELECTION_PATH)}
            className="primary-cta w-full"
          >
            Back to modify options
          </button>
        </div>
      </div>
    </div>
  );
}
