import type { Metadata } from "next";

import { AuroraBackgroundDemo } from "@/components/ui/aurora-background-demo";

export const metadata: Metadata = {
  title: "Aurora background (dev)",
};

export default function AuroraDevPage() {
  return <AuroraBackgroundDemo />;
}
