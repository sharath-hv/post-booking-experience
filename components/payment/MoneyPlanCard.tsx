"use client";

import { cn } from "@/lib/utils";

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
      <span className="relative z-10 flex size-6 items-center justify-center rounded-full bg-[#e7f6ee]">
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
      <span className="relative z-10 flex size-6 items-center justify-center rounded-full bg-[#e7f6ee]">
        <span
          aria-hidden
          className="absolute inset-1 animate-ping rounded-full bg-[#0fa457]/40 [animation-duration:2.2s] motion-reduce:hidden"
        />
        <span className="relative size-2 rounded-full bg-[#0fa457]" />
      </span>
    );
  }
  return (
    <span className="relative z-10 flex size-6 items-center justify-center rounded-full bg-[#fff7e5]">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden className="text-[#a76406]">
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
    <div className="overflow-hidden rounded-2xl bg-white card-elevated text-left">
      <div className="border-b border-[#e8e8e8] px-4 py-3">
        <p className="text-sm font-semibold leading-5 text-[#121212]">{heading}</p>
        {subheading ? (
          <p className="mt-0.5 text-xs leading-[18px] text-[#757575]">{subheading}</p>
        ) : null}
      </div>

      <ol className="m-0 flex list-none flex-col px-4 py-4">
        {steps.map((step, idx) => (
          <li key={step.title} className={cn("relative flex gap-3", idx > 0 && "pt-5")}>
            {idx < steps.length - 1 ? (
              <span
                aria-hidden
                className="absolute bottom-[-20px] left-3 top-7 w-px -translate-x-1/2 bg-[#e8e8e8]"
              />
            ) : null}
            <StepNode state={step.state} />
            <div className="min-w-0 flex-1 pt-0.5">
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-sm font-medium leading-5 text-[#121212]">{step.title}</p>
                {step.amountLabel ? (
                  <p className="shrink-0 text-sm font-semibold leading-5 text-[#121212] tabular-nums">
                    {step.amountLabel}
                  </p>
                ) : null}
              </div>
              {step.detail ? (
                <p className="mt-0.5 text-xs leading-[18px] text-[#757575]">{step.detail}</p>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
