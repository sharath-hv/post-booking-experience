"use client";

import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";

import { LOAN_APPLICATION_CONTROL_TEXT_CLASS } from "@/components/payment/loan-application/loan-application-layout";
import styles from "./LoanApplicationFormField.module.scss";


type LoanApplicationFormFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "email" | "tel";
  autoComplete?: string;
  multiline?: boolean;
  className?: string;
  /** Default `labeled` follows skills/forms-controls.md. `placeholder` is Figma personal override only. */
  variant?: "labeled" | "placeholder";
  /** Shown below the field (e.g. Mother's name verification copy). */
  hint?: string;
};

const FLOAT_TRANSITION = styles.floatTransition;

const INPUT_WRAP_LABELED_CLASS = styles.inputWrapLabeled;
const LABELED_INNER_INPUT_CLASS = styles.labeledInnerInput;
const MULTILINE_WRAP_LABELED_CLASS = styles.multilineWrapLabeled;

const FLOAT_LABEL_ACTIVE_CLASS = styles.floatLabelActive;
const FLOAT_LABEL_INACTIVE_CLASS = styles.floatLabelInactive;
const FLOAT_LABEL_INACTIVE_MULTILINE_CLASS = styles.floatLabelInactiveMultiline;

const PLACEHOLDER_VALUE_CLASS = cn(LOAN_APPLICATION_CONTROL_TEXT_CLASS, styles.textInk);

type FloatingPlaceholderFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "email" | "tel";
  autoComplete?: string;
  multiline?: boolean;
};

function FloatingPlaceholderField({
  id,
  label,
  value,
  onChange,
  type = "text",
  autoComplete,
  multiline = false,
}: FloatingPlaceholderFieldProps) {
  const [focused, setFocused] = useState(false);
  const active = focused || value.trim().length > 0;

  const onFocus = useCallback(() => setFocused(true), []);
  const onBlur = useCallback(() => setFocused(false), []);

  const wrapClass = [
    styles.relative_0,
    FLOAT_TRANSITION,
    multiline ? styles.flex_1 : styles.flex_0,
    active ? styles.borderActive : styles.border_e8e8e8__2,
  ].join(" ");

  const floatLabelClass = [
    styles.pointer_events_none_3,
    FLOAT_TRANSITION,
    active
      ? FLOAT_LABEL_ACTIVE_CLASS
      : multiline
        ? FLOAT_LABEL_INACTIVE_MULTILINE_CLASS
        : FLOAT_LABEL_INACTIVE_CLASS,
  ].join(" ");

  const inputClass = [
    styles.w_full_4,
    PLACEHOLDER_VALUE_CLASS,
    multiline ? styles.min_h_0_5 : "",
  ].join(" ");

  return (
    <div className={wrapClass}>
      <label htmlFor={id} className={floatLabelClass}>
        {label}
      </label>
      {multiline ? (
        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
          rows={3}
          autoComplete={autoComplete}
          className={inputClass}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
          autoComplete={autoComplete}
          className={inputClass}
        />
      )}
    </div>
  );
}

export function LoanApplicationFormField({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  autoComplete,
  multiline = false,
  className = "",
  variant = "labeled",
  hint,
}: LoanApplicationFormFieldProps) {
  const isPlaceholderVariant = variant === "placeholder";

  if (isPlaceholderVariant) {
    return (
      <div className={cn(styles.w_full_0, className)}>
        <FloatingPlaceholderField
          id={id}
          label={placeholder ?? label}
          value={value}
          onChange={onChange}
          type={type}
          autoComplete={autoComplete}
          multiline={multiline}
        />
        {hint ? (
          <p className={styles.mt_2_0}>{hint}</p>
        ) : null}
      </div>
    );
  }

  const labelEl = (
    <label htmlFor={id} className={styles.mb_2_1}>
      {label}
    </label>
  );

  const control = multiline ? (
    <div className={MULTILINE_WRAP_LABELED_CLASS}>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        autoComplete={autoComplete}
        className={cn(LABELED_INNER_INPUT_CLASS, styles.h_full_1)}
      />
    </div>
  ) : (
    <div className={INPUT_WRAP_LABELED_CLASS}>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={LABELED_INNER_INPUT_CLASS}
      />
    </div>
  );

  return (
    <div className={cn(styles.w_full_2, className)}>
      {labelEl}
      {control}
      {hint ? (
        <p className={styles.mt_2_0}>{hint}</p>
      ) : null}
    </div>
  );
}
