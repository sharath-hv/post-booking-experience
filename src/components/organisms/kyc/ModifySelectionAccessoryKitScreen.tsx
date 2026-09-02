"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { PrimaryCta } from "@/components/atoms/cta/PrimaryCta";
import { PageLeadHeading } from "@/components/organisms/PageLeadHeading";
import { StandaloneScreenHeader } from "@/components/organisms/StandaloneScreenHeader";
import { ModifySelectionAccessoryKitCard } from "@/components/organisms/kyc/ModifySelectionAccessoryKitCard";
import { MODIFY_SELECTION_PAGE_SHELL_CLASS } from "@/constants/modify-selection-content";
import {
  MODIFY_SELECTION_ACCESSORY_AVAILABLE_HEADING,
  MODIFY_SELECTION_ACCESSORY_CONTINUE_CTA,
  MODIFY_SELECTION_ACCESSORY_SCREEN_SUBLINE,
  MODIFY_SELECTION_ACCESSORY_SCREEN_TITLE,
  MODIFY_SELECTION_BASIC_ACCESSORY_KIT_ID,
} from "@/constants/modify-selection-coverage-content";
import {
  ensureModifySelectionCoveragePending,
  writeModifySelectionCoveragePending,
} from "@/helpers/modify-selection-coverage-pending";
import {
  modifySelectionCardStaggerDelay,
  MODIFY_SELECTION_STAGGER_MS,
} from "@/helpers/modify-selection-stagger";
import { useCtaNavigation } from "@/hooks/use-cta-navigation";
import { cn } from "@/utils/utils";
import addonStyles from "@/components/organisms/payment/InsuranceAddonSelectionScreen.module.scss";

const {
  title: STAGGER_TITLE_MS,
  subtext: STAGGER_SUBTEXT_MS,
  firstCard: STAGGER_FIRST_CARD_MS,
} = MODIFY_SELECTION_STAGGER_MS;

/**
 * Modify-selection accessory kit — after insurance tenure, before confirm.
 */
export function ModifySelectionAccessoryKitScreen() {
  const router = useRouter();
  const { loading, start } = useCtaNavigation();
  const [ready, setReady] = useState(false);
  const [selected, setSelected] = useState(true);

  useEffect(() => {
    const coverage = ensureModifySelectionCoveragePending();
    if (coverage == null) {
      router.replace("/booking/modify");
      return;
    }
    setSelected(coverage.accessorySelected);
    setReady(true);
  }, [router]);

  const onToggle = useCallback((id: string) => {
    if (id !== MODIFY_SELECTION_BASIC_ACCESSORY_KIT_ID) return;
    setSelected((prev) => !prev);
  }, []);

  const onContinue = useCallback(() => {
    const coverage = ensureModifySelectionCoveragePending();
    if (coverage == null) {
      router.replace("/booking/modify");
      return;
    }
    writeModifySelectionCoveragePending({
      ...coverage,
      accessorySelected: selected,
      returnToConfirm: false,
    });
    start(() => router.push(coverage.confirmPath));
  }, [router, selected, start]);

  if (!ready) {
    return null;
  }

  return (
    <div className={MODIFY_SELECTION_PAGE_SHELL_CLASS}>
      <StandaloneScreenHeader />

      <main className={addonStyles.main}>
        <header className={addonStyles.lead}>
          <PageLeadHeading
            title={MODIFY_SELECTION_ACCESSORY_SCREEN_TITLE}
            subline={MODIFY_SELECTION_ACCESSORY_SCREEN_SUBLINE}
            titleDelayMs={STAGGER_TITLE_MS}
            sublineDelayMs={STAGGER_SUBTEXT_MS}
          />
        </header>

        <section
          className={addonStyles.addons}
          aria-labelledby="modify-accessory-kit-heading"
        >
          <h2 id="modify-accessory-kit-heading" className={addonStyles.srOnly}>
            {MODIFY_SELECTION_ACCESSORY_AVAILABLE_HEADING}
          </h2>

          <div
            className={addonStyles.addonList}
            role="group"
            aria-label={MODIFY_SELECTION_ACCESSORY_AVAILABLE_HEADING}
          >
            <div
              className={cn(addonStyles.addonListItem, "payment-success-stagger")}
              style={{
                animationDelay: `${modifySelectionCardStaggerDelay(0, STAGGER_FIRST_CARD_MS)}ms`,
              }}
            >
              <ModifySelectionAccessoryKitCard selected={selected} onToggle={onToggle} />
            </div>
          </div>
        </section>
      </main>

      <div className={cn(addonStyles.footer, "footer-elevated")}>
        <div className={addonStyles.footerInner}>
          <PrimaryCta onClick={onContinue} loading={loading} className={addonStyles.ctaFull}>
            {MODIFY_SELECTION_ACCESSORY_CONTINUE_CTA}
          </PrimaryCta>
        </div>
      </div>
    </div>
  );
}
