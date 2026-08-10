import { cn } from "@/lib/utils";

import {
  loanApplicationApplicantEyebrowLabel,
  type LoanApplicationApplicant,
} from "@/lib/loan-application-content";
import { LOAN_APPLICATION_PAGE_TITLE_CLASS } from "@/components/payment/loan-application/loan-application-layout";
import styles from "./LoanApplicationApplicantEyebrow.module.scss";

type LoanApplicationApplicantEyebrowProps = {
  applicant: LoanApplicationApplicant;
  /** When false, only the title is rendered (single-applicant path). */
  show: boolean;
  title: string;
  titleClassName?: string;
};

/**
 * Eyebrow above the page H1 on person-shaped steps — “You” / “Co-applicant”.
 */
export function LoanApplicationApplicantEyebrow({
  applicant,
  show,
  title,
  titleClassName = LOAN_APPLICATION_PAGE_TITLE_CLASS,
}: LoanApplicationApplicantEyebrowProps) {
  return (
    <div className={styles.headingBlock}>
      {show ? (
        <p className={styles.eyebrow}>{loanApplicationApplicantEyebrowLabel(applicant)}</p>
      ) : null}
      <h1
        className={cn(
          titleClassName,
          styles.title,
          show && styles.titleAfterEyebrow,
        )}
      >
        {title}
      </h1>
    </div>
  );
}
