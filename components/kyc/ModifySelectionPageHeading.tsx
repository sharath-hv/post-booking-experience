import {
  MODIFY_SELECTION_BODY_CLASS,
  MODIFY_SELECTION_LEAD_CLASS,
} from "@/components/kyc/modify-selection-option-card-ui";

type ModifySelectionPageHeadingProps = {
  title: string;
  /** Optional body line — ShiviDialogue body style. */
  subline?: string;
  titleDelayMs?: number;
  sublineDelayMs?: number;
};

/** Page title block — lead + optional body, matches concierge `ShiviDialogue` typography. */
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
        className={`payment-success-stagger ${MODIFY_SELECTION_LEAD_CLASS}`}
        style={{ animationDelay: `${titleDelayMs}ms` }}
      >
        {title}
      </h1>
      {subline ? (
        <p
          className={`payment-success-stagger mt-2 ${MODIFY_SELECTION_BODY_CLASS}`}
          style={{ animationDelay: `${bodyDelay}ms` }}
        >
          {subline}
        </p>
      ) : null}
    </>
  );
}
