import { KycPendingScreen } from "@/components/kyc/KycPendingScreen";
import { HeroPageTransition } from "@/components/ui/page-transition";

/**
 * KYC verification (pending) — [Figma 2052:7630](https://www.figma.com/design/nW5SWmJdxxsCEDlqBN7C0L/Post-booking-experience?node-id=2052-7630).
 */
export default function KycPage() {
  return (
    <HeroPageTransition>
      <KycPendingScreen />
    </HeroPageTransition>
  );
}
