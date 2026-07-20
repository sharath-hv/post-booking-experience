"use client";

import Image, { type StaticImageData } from "next/image";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import { ModifySelectionPageHeading } from "@/components/kyc/ModifySelectionPageHeading";
import { ModifySelectionConfirmBottomSheet } from "@/components/kyc/ModifySelectionConfirmBottomSheet";
import { ModifySelectionScreenHeader } from "@/components/kyc/ModifySelectionScreenHeader";
import styles from "./ChooseModifyBookingScreen.module.scss";

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
      className={cn(MODIFY_SELECTION_SELECTABLE_CARD_BASE_CLASS, styles.p_4_0, modifySelectionSelectableCardClass(selected))}
    >
      <div className={styles.flex_0}>
        <div className={styles.relative_1}>
          <Image
            src={illustrationSrc}
            alt=""
            fill
            className={styles.object_contain_2}
            unoptimized
            sizes="48px"
          />
        </div>
        <span className={styles.mt_0_5_3}>
          <ModifySelectionRadioIndicator selected={selected} />
        </span>
      </div>

      <p className={styles.mt_3_4}>{title}</p>
      <p className={styles.mt_1_5}>{description}</p>
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

      <main className={styles.mx_auto_6}>
        <ModifySelectionPageHeading
          title={MODIFY_SELECTION_TITLE}
          subline={subline}
          titleDelayMs={STAGGER_TITLE_MS}
          sublineDelayMs={STAGGER_SUBTEXT_MS}
        />

        <div
          className={styles.mt_8_7}
          role="group"
          aria-label="Modification options"
        >
          {MODIFY_SELECTION_OPTIONS.map((option, index) => (
            <div
              key={option.id}
              className={[styles.payment_success_stagger_8, "payment-success-stagger"].filter(Boolean).join(" ")}
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

      <div className={[styles.fixed_9, "footer-elevated"].filter(Boolean).join(" ")}>
        <div className={styles.mx_auto_10}>
          <button type="button" onClick={onContinue} className={[styles.primary_cta_11, "primary-cta"].filter(Boolean).join(" ")}>
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
