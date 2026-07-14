"use client";

import Image, { type StaticImageData } from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import { ModifySelectionPageHeading } from "@/components/kyc/ModifySelectionPageHeading";
import { ModifySelectionConfirmBottomSheet } from "@/components/kyc/ModifySelectionConfirmBottomSheet";
import { ModifySelectionScreenHeader } from "@/components/kyc/ModifySelectionScreenHeader";
import {
  modifySelectionSelectableCardClass,
  MODIFY_SELECTION_SELECTABLE_CARD_BASE_CLASS,
  ModifySelectionRadioIndicator,
} from "@/components/kyc/modify-selection-option-card-ui";
import {
  MODIFY_SELECTION_OPTIONS,
  MODIFY_SELECTION_PAGE_SHELL_CLASS,
  MODIFY_SELECTION_TITLE,
  resolveModifySelectionConfirmPoints,
  resolveModifySelectionSubline,
  type ModifySelectionChoiceId,
} from "@/lib/modify-selection-content";
import {
  modifySelectionCardStaggerDelay,
  MODIFY_SELECTION_STAGGER_MS,
} from "@/lib/modify-selection-stagger";

const { title: STAGGER_TITLE_MS, subtext: STAGGER_SUBTEXT_MS, firstCard: STAGGER_FIRST_OPTION_MS } =
  MODIFY_SELECTION_STAGGER_MS;

type ModifyOptionCardProps = {
  id: ModifySelectionChoiceId;
  selected: boolean;
  onSelect: () => void;
  illustrationSrc: string | StaticImageData;
  title: string;
  description: string;
};

function ModifyOptionCard({
  id,
  selected,
  onSelect,
  illustrationSrc,
  title,
  description,
}: ModifyOptionCardProps) {
  return (
    <button
      type="button"
      id={`modify-option-${id}`}
      onClick={onSelect}
      aria-pressed={selected}
      className={`${MODIFY_SELECTION_SELECTABLE_CARD_BASE_CLASS} p-4 ${modifySelectionSelectableCardClass(selected)}`}
    >
      <div className="flex items-start justify-between">
        <div className="relative h-12 w-12 shrink-0">
          <Image
            src={illustrationSrc}
            alt=""
            fill
            className="object-contain object-left"
            unoptimized
            sizes="48px"
          />
        </div>
        <span className="mt-0.5 flex shrink-0">
          <ModifySelectionRadioIndicator selected={selected} />
        </span>
      </div>

      <p className="mt-3 text-base font-medium leading-6 text-[#121212]">{title}</p>
      <p className="mt-1 text-xs leading-4 text-[#4b4b4b]">{description}</p>
    </button>
  );
}

/**
 * Modify booking — what to change (layout aligned with `ChoosePaymentOptionsScreen`).
 */
export function ChooseModifyBookingScreen() {
  const router = useRouter();
  const [choice, setChoice] = useState<ModifySelectionChoiceId>("colour");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [subline, setSubline] = useState(() => resolveModifySelectionSubline());

  useEffect(() => {
    setSubline(resolveModifySelectionSubline());
  }, []);

  const selectedOption = MODIFY_SELECTION_OPTIONS.find((o) => o.id === choice)!;

  const confirmPoints = useMemo(
    () => resolveModifySelectionConfirmPoints(choice),
    [choice],
  );

  const onContinue = useCallback(() => {
    setConfirmOpen(true);
  }, []);

  const onConfirmAgree = useCallback(() => {
    setConfirmOpen(false);
    router.push(selectedOption.continuePath);
  }, [router, selectedOption.continuePath]);

  return (
    <div className={MODIFY_SELECTION_PAGE_SHELL_CLASS}>
      <ModifySelectionScreenHeader />

      <main className="mx-auto w-full max-w-[640px] px-5 pb-[calc(7rem+env(safe-area-inset-bottom))] pt-2">
        <ModifySelectionPageHeading
          title={MODIFY_SELECTION_TITLE}
          subline={subline}
          titleDelayMs={STAGGER_TITLE_MS}
          sublineDelayMs={STAGGER_SUBTEXT_MS}
        />

        <div
          className="mt-8 flex flex-col gap-4"
          role="group"
          aria-label="Modification options"
        >
          {MODIFY_SELECTION_OPTIONS.map((option, index) => (
            <div
              key={option.id}
              className="payment-success-stagger w-full"
              style={{
                animationDelay: `${modifySelectionCardStaggerDelay(index, STAGGER_FIRST_OPTION_MS)}ms`,
              }}
            >
              <ModifyOptionCard
                id={option.id}
                selected={choice === option.id}
                onSelect={() => setChoice(option.id)}
                illustrationSrc={option.illustrationSrc}
                title={option.title}
                description={option.description}
              />
            </div>
          ))}
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-10 pb-[env(safe-area-inset-bottom)] footer-elevated">
        <div className="mx-auto w-full max-w-[640px] bg-white px-5 py-4">
          <button type="button" onClick={onContinue} className="primary-cta w-full">
            {selectedOption.continueCtaLabel}
          </button>
        </div>
      </div>

      <ModifySelectionConfirmBottomSheet
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={onConfirmAgree}
        header={selectedOption.confirmHeader}
        points={confirmPoints}
        iconSrc={selectedOption.illustrationSrc}
        confirmCtaLabel={selectedOption.continueCtaLabel}
      />
    </div>
  );
}
