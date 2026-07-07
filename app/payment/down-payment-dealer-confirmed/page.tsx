import { LoanDealerDownPaymentConfirmedScreen } from "@/components/payment/LoanDealerDownPaymentConfirmedScreen";

/**
 * Dealer has confirmed down payment receipt — Shivi instructs the bank to disburse.
 * Sits between /payment/loan-sanctioned and /payment/loan-disbursement-received.
 */
export default function DownPaymentDealerConfirmedPage() {
  return <LoanDealerDownPaymentConfirmedScreen />;
}
