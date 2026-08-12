import { BuyingGuideShell } from "@/components/organisms/kyc/BuyingGuideShell";

export default function BuyingGuideLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <BuyingGuideShell>{children}</BuyingGuideShell>;
}
