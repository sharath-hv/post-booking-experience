import { CtaButton, type CtaButtonProps } from "@/components/atoms/cta/CtaButton";

export type PrimaryCtaProps = Omit<CtaButtonProps, "variant">;

/**
 * Primary CTA that swaps its label for the in-button loader while navigating.
 * Does not use native `disabled` during loading (that greys the button).
 */
export function PrimaryCta(props: PrimaryCtaProps) {
  return <CtaButton variant="primary" {...props} />;
}
