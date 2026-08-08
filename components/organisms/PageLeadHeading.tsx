import {
  MODIFY_SELECTION_BODY_CLASS,
  MODIFY_SELECTION_LEAD_CLASS,
} from "@/components/molecules/modify-selection-option-card-ui";
import styles from "./PageLeadHeading.module.scss";

type PageLeadHeadingProps = {
  title: string;
  /** Optional body line — ShiviDialogue body style. */
  subline?: string;
  titleDelayMs?: number;
  sublineDelayMs?: number;
};

/** Page title block — lead + optional body for standalone screens (not Shivi concierge). */
export function PageLeadHeading({
  title,
  subline,
  titleDelayMs = 0,
  sublineDelayMs,
}: PageLeadHeadingProps) {
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
