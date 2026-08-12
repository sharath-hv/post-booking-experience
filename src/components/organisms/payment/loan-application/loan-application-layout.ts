import styles from "./loan-application-layout.module.scss";
/** Dark green hero — [Figma 2841:8477](https://www.figma.com/design/nW5SWmJdxxsCEDlqBN7C0L/Post-booking-experience?node-id=2841-8477). */
export const LOAN_APPLICATION_HEADER_CLASS = styles.loanApplicationHeader;

/** Milestone rail sits below the 56px nav bar. */
export const LOAN_APPLICATION_HERO_MILESTONE_CLASS = styles.loanApplicationHeroMilestone;

/** Page title starts 24px below where the hero gradient ends. */
export const LOAN_APPLICATION_PAGE_TITLE_CLASS = styles.loanApplicationPageTitle;

export const LOAN_APPLICATION_MAIN_CLASS = styles.loanApplicationMain;

export const LOAN_APPLICATION_SECTION_LABEL_CLASS = styles.loanApplicationSectionLabel;

/** 24px between major sections (Figma). */
export const LOAN_APPLICATION_SECTION_GAP_CLASS = styles.loanApplicationSectionGap;

/** 32px between stacked placeholder fields (Figma personal screen). */
export const LOAN_APPLICATION_FIELD_STACK_GAP_CLASS = styles.loanApplicationFieldStackGap;

/** Divider between personal and work blocks — full bleed within main, dashed. */
export const LOAN_APPLICATION_SECTION_DIVIDER_CLASS = styles.loanApplicationSectionDivider;

/** 12px from section label to field/chips. */
export const LOAN_APPLICATION_FIELD_GAP_CLASS = styles.loanApplicationFieldGap;

/** 20px from page title to content below. */
export const LOAN_APPLICATION_TITLE_TO_CARD_GAP_CLASS = styles.loanApplicationTitleToCardGap;

/** 14px — inputs, amount field, and segment chips. */
export const LOAN_APPLICATION_CONTROL_TEXT_CLASS = styles.loanApplicationControlText;

/**
 * Page load sequence — nav, milestone rail, and fixed CTA stay immediate;
 * main content uses `LoanApplicationPageStagger` (same motion as payment-success-stagger).
 */
export const LOAN_APPLICATION_STAGGER_MS = {
  title: 90,
  subtitle: 180,
  card: 300,
  blockAfterSubtitle: 270,
  sectionStep: 90,
  documentsInfo: 240,
  documentsAadhaar: 320,
  documentsPan: 400,
  cta: 540,
} as const;

export function loanApplicationStaggerAfterCard(sectionIndex: number): number {
  return (
    LOAN_APPLICATION_STAGGER_MS.card +
    sectionIndex * LOAN_APPLICATION_STAGGER_MS.sectionStep
  );
}
