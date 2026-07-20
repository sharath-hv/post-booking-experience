import styles from "./CancelBookingRefundSummaryCard.module.scss";
import {
  CANCEL_BOOKING_REFUND_AMOUNT_LABEL,
  CANCEL_BOOKING_REFUND_BOOKING_AMOUNT_LABEL,
  CANCEL_BOOKING_REFUND_CANCELLATION_FEE_LABEL,
  CANCEL_BOOKING_REFUND_TIMELINE,
  cancelBookingRefundAmountInr,
  cancelBookingRefundBookingAmountInr,
  cancelBookingRefundCancellationFeeDisplay,
  formatCancelBookingInr,
} from "@/lib/cancel-booking-content";

/**
 * Refund breakdown — Figma Post-booking-experience / node 2711:17474.
 */
export function CancelBookingRefundSummaryCard() {
  const bookingAmount = cancelBookingRefundBookingAmountInr();
  const refundAmount = cancelBookingRefundAmountInr();

  return (
    <div className={[styles.overflow_hidden_0, "card-elevated"].filter(Boolean).join(" ")}>
      <div className={styles.px_4_1}>
        <div className={styles.flex_2}>
          <p className={styles.text_sm_3}>
            {CANCEL_BOOKING_REFUND_BOOKING_AMOUNT_LABEL}
          </p>
          <p className={styles.shrink_0_4}>
            {formatCancelBookingInr(bookingAmount)}
          </p>
        </div>
        <div className={styles.mt_4_5}>
          <p className={styles.text_sm_3}>
            {CANCEL_BOOKING_REFUND_CANCELLATION_FEE_LABEL}
          </p>
          <p className={styles.shrink_0_4}>
            {cancelBookingRefundCancellationFeeDisplay()}
          </p>
        </div>
      </div>
      <div className={styles.bg_f5f5f5__6}>
        <div className={styles.flex_7}>
          <p className={styles.text_base_8}>
            {CANCEL_BOOKING_REFUND_AMOUNT_LABEL}
          </p>
          <p className={styles.shrink_0_9}>
            {formatCancelBookingInr(refundAmount)}
          </p>
        </div>
        <p className={styles.mt_1_10}>
          {CANCEL_BOOKING_REFUND_TIMELINE}
        </p>
      </div>
    </div>
  );
}
