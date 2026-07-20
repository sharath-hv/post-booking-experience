"use client";

import { cn } from "@/lib/utils";
import styles from "./MoneyPlanCard.module.scss";


export type MoneyPlanStepState = "done" | "moving" | "later";

export type MoneyPlanStep = {
  title: string;
  /** One honest line — what's happening, or why it waits. */
  detail?: string;
  /** Right-aligned amount, e.g. “₹37,000”. */
  amountLabel?: string;
  state: MoneyPlanStepState;
};

function StepNode({ state }: { state: MoneyPlanStepState }) {
  if (state === "done") {
    return (
      <span className={styles.relative_0}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M6.5 12.5l3.5 3.5 7.5-8"
            stroke="#0c7a42"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    );
  }
  if (state === "moving") {
    return (
      <span className={styles.relative_0}>
        <span
          aria-hidden
          className={styles.absolute_1}
        />
        <span className={styles.relative_2} />
      </span>
    );
  }
  return (
    <span className={styles.relative_3}>
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden className={styles.text_a76406__4}>
        <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="2.2" />
        <path
          d="M12 7.5V12l3 2"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export type MoneyPlanCardProps = {
  /** Card heading — e.g. “One payment left”. */
  heading: string;
  /** Quiet line beside/under the heading, e.g. “Everything else is in or in motion.” */
  subheading?: string;
  steps: readonly MoneyPlanStep[];
};

/**
 * The money story, at a glance — what's paid, what's in motion, and the one
 * payment still ahead. Exists so “insurance comes later” reads as a plan with
 * a reason, not a footnote users scroll past and call support about.
 */
export function MoneyPlanCard({ heading, subheading, steps }: MoneyPlanCardProps) {
  return (
    <div className={[styles.overflow_hidden_5, "card-elevated"].filter(Boolean).join(" ")}>
      <div className={styles.border_b_6}>
        <p className={styles.text_sm_7}>{heading}</p>
        {subheading ? (
          <p className={styles.mt_0_5_8}>{subheading}</p>
        ) : null}
      </div>

      <ol className={styles.m_0_9}>
        {steps.map((step, idx) => (
          <li key={step.title} className={cn(styles.relative_15, idx > 0 && styles.pt_5_16)}>
            {idx < steps.length - 1 ? (
              <span
                aria-hidden
                className={styles.absolute_10}
              />
            ) : null}
            <StepNode state={step.state} />
            <div className={styles.min_w_0_11}>
              <div className={styles.flex_12}>
                <p className={styles.text_sm_13}>{step.title}</p>
                {step.amountLabel ? (
                  <p className={styles.shrink_0_14}>
                    {step.amountLabel}
                  </p>
                ) : null}
              </div>
              {step.detail ? (
                <p className={styles.mt_0_5_8}>{step.detail}</p>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
