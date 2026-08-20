import { CtaButton, type CtaButtonProps } from "@/components/atoms/cta/CtaButton";

export type OutlineCtaProps = Omit<CtaButtonProps, "variant">;

/** Outlined 48px CTA — `.demo-nav-cta`. */
export function OutlineCta(props: OutlineCtaProps) {
  return <CtaButton variant="outline" {...props} />;
}
