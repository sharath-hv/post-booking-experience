"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";

import { DownPaymentInstalmentSuccess } from "@/components/organisms/payment/DownPaymentInstalmentSuccess";
import {
  buildMarginMoneySlipActionHref,
  buildPayDownPaymentHref,
  buildPayFullPaymentHref,
  buildPostDownPaymentCompleteHref,
  FULL_PAYMENT_BANK_ID,
} from "@/helpers/paymentUrls";
import { parsePositiveIntQuery } from "@/readers/payment";

function formatInr(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function DownPaymentSuccessScreen() {
  const searchParams = useSearchParams();

  const { subline, nextHref } = useMemo(() => {
    const bank = searchParams.get("bank");
    const loanAmount = searchParams.get("loan_amount");
    const original =
      parsePositiveIntQuery(searchParams.get("original_down_payment")) ??
      parsePositiveIntQuery(searchParams.get("total"));
    const paid = parsePositiveIntQuery(searchParams.get("paid"));
    const remaining = parsePositiveIntQuery(searchParams.get("remaining"));

    if (original != null && paid != null && remaining != null) {
      if (remaining > 0) {
        return {
          subline: `We’ve received ${formatInr(paid)}.`,
          nextHref:
            bank === FULL_PAYMENT_BANK_ID
              ? buildPayFullPaymentHref(remaining, original)
              : buildPayDownPaymentHref(bank, loanAmount, remaining, original),
        };
      }
      return {
        subline: `We’ve received ${formatInr(paid)}.`,
        nextHref:
          bank === "self_finance"
            ? buildMarginMoneySlipActionHref({
                bank,
                loanAmount,
                originalDownPaymentInr: original,
              })
            : buildPostDownPaymentCompleteHref(bank, loanAmount),
      };
    }

    if (original != null) {
      const isFullPayment = bank === FULL_PAYMENT_BANK_ID;
      return {
        subline: isFullPayment
          ? `${formatInr(original)} full payment received.`
          : `${formatInr(original)} down payment received.`,
        nextHref:
          bank === "self_finance"
            ? buildMarginMoneySlipActionHref({
                bank,
                loanAmount,
                originalDownPaymentInr: original,
              })
            : buildPostDownPaymentCompleteHref(bank, loanAmount),
      };
    }

    return {
      subline: "Your payment was received.",
      nextHref: buildPostDownPaymentCompleteHref(bank, loanAmount),
    };
  }, [searchParams]);

  return <DownPaymentInstalmentSuccess subline={subline} nextHref={nextHref} />;
}
