"use client";

import { ShimmerInfoCard } from "@/components/molecules/ShimmerInfoCard";

export type NoteCalloutProps = {
  children: React.ReactNode;
};

/** Aside in the shimmer info-callout style (matches “A quick heads-up”). */
export function NoteCallout({ children }: NoteCalloutProps) {
  return <ShimmerInfoCard>{children}</ShimmerInfoCard>;
}
