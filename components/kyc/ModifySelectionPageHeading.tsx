import {
  MODIFY_SELECTION_BODY_CLASS,
  MODIFY_SELECTION_LEAD_CLASS,
} from "@/components/kyc/modify-selection-option-card-ui";
import styles from "./ModifySelectionPageHeading.module.scss";

type ModifySelectionPageHeadingProps = {
  title: string;
  /** Optional body line — ShiviDialogue body style. */
  subline?: string;
  titleDelayMs?: number;
  sublineDelayMs?: number;
};

/** Page title block — lead + optional body for standalone screens (not Shivi concierge). */
export function ModifySelectionPageHeading({
  title,
  subline,
  titleDelayMs = 0,
  sublineDelayMs,
}: ModifySelectionPageHeadingProps) {
  const bodyDelay = sublineDelayMs ?? titleDelayMs + 60;

  return (
    <>
      <h1
        className={[styles.title, "payment-success-stagger", MODIFY_SELECTION_LEAD_CLASS].filter(Boolean).join(" ")}
        style={{ animationDelay: `${titleDelayMs}ms` }}
      >
        {title}
      </h1>
      {subline ? (
        <p
          className={[styles.subline, "payment-success-stagger", MODIFY_SELECTION_BODY_CLASS].filter(Boolean).join(" ")}
          style={{ animationDelay: `${bodyDelay}ms` }}
        >
          {subline}
        </p>
      ) : null}
    </>
  );
}
