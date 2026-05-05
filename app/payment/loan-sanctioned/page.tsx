import { LoanSanctionedScreen } from "@/components/payment/LoanSanctionedScreen";
import { CelebrationPageTransition } from "@/components/ui/page-transition";

/**
 * Loan sanctioned — same layout as `/payment/loan-processing`; CTA “Choose loan amount”.
 */
export default function LoanSanctionedPage() {
  return (
    <CelebrationPageTransition>
      <LoanSanctionedScreen />
    </CelebrationPageTransition>
  );
}
