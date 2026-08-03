import type { Metadata } from "next";

import { AuroraBackgroundDemo } from "./aurora-background-demo";

export const metadata: Metadata = {
  title: "Video background experiment (dev)",
};

export default function AuroraDevPage() {
  return <AuroraBackgroundDemo />;
}
