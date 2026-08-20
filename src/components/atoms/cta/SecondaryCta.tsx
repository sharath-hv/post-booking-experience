import { CtaButton, type CtaButtonProps } from "@/components/atoms/cta/CtaButton";

export type SecondaryCtaProps = Omit<CtaButtonProps, "variant">;

/** Soft 48px CTA — `.reply-soft-cta`. */
export function SecondaryCta(props: SecondaryCtaProps) {
  return <CtaButton variant="secondary" {...props} />;
}
