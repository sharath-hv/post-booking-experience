"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { QuoteFlowMenuSheet } from "@/components/quote/QuoteFlowMenuSheet";
import {
  DEFAULT_EXPERIENCE_FLOW,
  getExperienceFlowDefinition,
  readExperienceFlow,
  writeExperienceFlow,
  type ExperienceFlow,
} from "@/lib/experience-flow";
import { resetChangePolicy } from "@/lib/change-policy";
import { isStandardDeliveryFlow } from "@/lib/experience-flow-content";
import { resetKycVerificationFailureCount } from "@/lib/kyc-verification-attempts";
import { BOOKING_LOCK_AMOUNT_INR } from "@/lib/paymentUrls";
import { QUOTE_ASSETS } from "./quote-assets";
import styles from "./QuoteScreen.module.scss";


function MenuIconButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={styles.flex_0}
      aria-label="Switch experience flow"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M4 7h16M4 12h16M4 17h16"
          stroke="#121212"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
}

function DottedRule() {
  return (
    <hr
      className={styles.my_4_1}
      style={{ borderColor: "var(--quote-border-light)" }}
    />
  );
}

export function QuoteScreen() {
  const router = useRouter();
  const [otherOpen, setOtherOpen] = useState(true);
  const [discountOpen, setDiscountOpen] = useState(true);
  const [flowMenuOpen, setFlowMenuOpen] = useState(false);
  const [activeFlow, setActiveFlow] = useState<ExperienceFlow>(DEFAULT_EXPERIENCE_FLOW);

  useEffect(() => {
    setActiveFlow(readExperienceFlow());
  }, []);

  const handleFlowChange = useCallback(
    (flow: ExperienceFlow) => {
      writeExperienceFlow(flow);
      resetKycVerificationFailureCount();
      resetChangePolicy();
      setActiveFlow(flow);
      const entryPath = getExperienceFlowDefinition(flow).entryPath;
      router.replace(entryPath);
    },
    [router],
  );

  const bookingCtaLabel = isStandardDeliveryFlow(activeFlow)
    ? `Book now at ₹${BOOKING_LOCK_AMOUNT_INR.toLocaleString("en-IN")}`
    : `Lock this price at ₹${BOOKING_LOCK_AMOUNT_INR.toLocaleString("en-IN")}`;

  return (
    <div className={styles.relative_2}>
      {/* Floating flow menu — sits above header / content */}
      <div className={styles.pointer_events_none_3}>
        <div className={styles.pointer_events_auto_4}>
          <MenuIconButton onClick={() => setFlowMenuOpen(true)} />
        </div>
      </div>

      {/* Dark header */}
      <header
        className={styles.relative_5}
        style={{ minHeight: 240 }}
      >
        <div className={styles.relative_6} aria-hidden />
        <div className={styles.relative_7}>
          <div className={styles.min_w_0_8}>
            <h1 className={styles.text_base_9}>
              Kia Seltos 1.0 HTX
            </h1>
            <p className={styles.mt_1_10}>
              Petrol • Manual
            </p>
            <div className={styles.mt_3_11}>
              <span
                className={styles.inline_block_12}
                style={{ background: "#c41e3a" }}
                aria-hidden
              />
              <span className={styles.text_xs_13}>
                Intense Red - Metallic
              </span>
            </div>
          </div>
          <div className={styles.relative_14}>
            <Image
              src={QUOTE_ASSETS.carHero}
              alt="Kia Seltos"
              fill
              className={styles.object_cover_15}
              sizes="128px"
              unoptimized
              priority
            />
          </div>
        </div>
      </header>

      <div className={styles.relative_16}>
        {/* Price hero card */}
        <section className={[styles.overflow_hidden_17, "card-elevated"].filter(Boolean).join(" ")}>
          <div className={styles.px_3_18}>
            <p className={styles.text_sm_19}>
              Your ACKO Drive price for Bengaluru
            </p>
            <p className={styles.mt_1_20}>
              ₹13,63,780
            </p>
            <p className={styles.mt_1_21}>
              Your total savings ₹76,043
            </p>
          </div>
          <div
            className={styles.flex_22}
            style={{ background: "var(--quote-purple-tint)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M13 2L3 14h8l-1 8 10-12h-8l1-8z"
                stroke="var(--quote-purple-text)"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
            <span
              className={styles.text_xs_23}
              style={{ color: "var(--quote-purple-text)" }}
            >
              Express Delivery by 25 Nov 2025
            </span>
          </div>
        </section>

        {/* Insurance coverage */}
        <h2 className={styles.mb_3_24}>
          ACKO Insurance coverage included
        </h2>
        <button
          type="button"
          className={[styles.flex_25, "card-elevated"].filter(Boolean).join(" ")}
        >
          <div className={styles.min_w_0_8}>
            <p className={styles.text_sm_26}>3 year</p>
            <p className={styles.text_xs_27}>Third Party cover</p>
          </div>
          <div
            className={styles.flex_28}
            aria-hidden
          />
          <div className={styles.relative_29}>
            <span className={styles.absolute_30}>
              <span className={styles.text_xs_31}>+</span>
            </span>
            <p className={styles.text_sm_26}>1 year</p>
            <p className={styles.text_xs_27}>
              Zero depreciation cover
            </p>
          </div>
          <svg
            className={styles.h_4_32}
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden
          >
            <path
              d="M9 18l6-6-6-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        {/* Price quote */}
        <h2 className={styles.mb_3_33}>
          Price quote
        </h2>
        <div className={[styles.overflow_hidden_17, "card-elevated"].filter(Boolean).join(" ")}>
          <div className={styles.flex_34}>
            <span className={styles.text_sm_35}>Ex-Showroom Price</span>
            <span className={styles.shrink_0_36}>
              ₹9,54,900
            </span>
          </div>

          <div className={styles.border_t_37}>
            <button
              type="button"
              onClick={() => setOtherOpen((o) => !o)}
              className={styles._mx_1_38}
            >
              <span className={styles.text_sm_35}>Other charges</span>
              <span className={styles.flex_39}>
                <span className={styles.text_sm_26}>₹3,72,177</span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  className={cn(styles.shrink_0_0, otherOpen ? styles.rotate_180_0 : "")}
                  aria-hidden
                >
                  <path
                    d="M6 9l6 6 6-6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </button>
            {otherOpen ? (
              <div
                className={styles.mt_3_40}
                style={{ background: "var(--quote-nested-bg)" }}
              >
                <Row label="Registration amount" value="₹1,50,261" small />
                <Row label="Dealer insurance premium" value="₹56,672" small />
                <Row label="Tax collected at source" value="₹12,579" small />
              </div>
            ) : null}
          </div>

          <DottedRule />

          <div className={styles.px_3_41}>
            <p className={styles.text_xs_42}>
              Insurance
            </p>
            <div className={styles.mt_2_43}>
              <p className={styles.min_w_0_44}>
                ACKO Comprehensive Insurance (1year OD + 3 years TP)
              </p>
              <span className={styles.shrink_0_36}>
                ₹36,488
              </span>
            </div>
          </div>

          <DottedRule />

          <div className={styles.px_3_45}>
            <p className={styles.text_xs_42}>FASTag</p>
            <div className={styles.mt_2_46}>
              <div>
                <p className={styles.text_sm_35}>HDFC FASTag</p>
                <button
                  type="button"
                  className={styles.mt_1_47}
                >
                  Remove
                </button>
              </div>
              <span className={styles.text_sm_26}>₹500</span>
            </div>
          </div>

          <DottedRule />

          <div className={styles.px_3_45}>
            <p className={styles.text_xs_42}>
              Accessories
            </p>
            <div className={styles.mt_2_46}>
              <div>
                <p className={styles.text_sm_35}>Premium package</p>
                <button
                  type="button"
                  className={styles.mt_1_47}
                >
                  Remove
                </button>
              </div>
              <span className={styles.text_sm_26}>₹9,750</span>
            </div>
          </div>

          <DottedRule />

          <div className={styles.px_3_45}>
            <button
              type="button"
              onClick={() => setDiscountOpen((d) => !d)}
              className={styles._mx_1_48}
            >
              <span className={styles.text_sm_35}>Total discount</span>
              <span className={styles.flex_39}>
                <span className={styles.text_sm_49}>
                  -₹76,043
                </span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  className={cn(styles.transition_transform_1, discountOpen ? styles.rotate_180_1 : "")}
                  aria-hidden
                >
                  <path
                    d="M6 9l6 6 6-6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </button>
            {discountOpen ? (
              <div
                className={styles.mt_3_40}
                style={{ background: "var(--quote-nested-bg)" }}
              >
                <div className={styles.flex_50}>
                  <span className={styles.text_var_quote_text_body_51}>ACKO Drive discount</span>
                  <span className={styles.font_medium_52}>-₹53,835</span>
                </div>
                <p className={styles.text_11px__53}>
                  (
                  <span className={styles.font_medium_52}>₹5,000</span> New car
                  savings balance applied)
                </p>
                <div className={styles.flex_50}>
                  <span className={styles.text_var_quote_text_body_51}>Loan discount</span>
                  <span className={styles.font_medium_52}>-₹10,000</span>
                </div>
                <div className={styles.flex_50}>
                  <span className={styles.text_var_quote_text_body_51}>Exchange discount</span>
                  <span className={styles.font_medium_52}>-₹10,000</span>
                </div>
              </div>
            ) : null}
          </div>

          <div
            className={styles.px_3_54}
            style={{
              background:
                "linear-gradient(94.92deg, #deffe5 0%, #d7fdff 99.43%)",
            }}
          >
            <div className={styles.flex_55}>
              <p className={styles.text_base_56}>
                ACKO Drive price
              </p>
              <p className={styles.text_base_57}>
                ₹13,63,780
              </p>
            </div>
            <p className={styles.mt_3_58}>
              <span className={styles.font_medium_59}>Did you know?</span> Our prices are
              lower than dealership price as we don&apos;t charge any commissions
            </p>
          </div>
        </div>

        {/* Cancellation policy — mirrors the booking policy: confirmation is the lock point */}
        <h2 className={styles.mb_3_33}>
          Cancellation policy
        </h2>
        <div className={styles.overflow_hidden_60}>
          <div className={styles.flex_61}>
            <div className={styles.w_128px__62}>
              Before your car is confirmed
            </div>
            <div className={styles.flex_63}>
              Free. Every rupee comes back.
            </div>
          </div>
          <div className={styles.flex_61}>
            <div className={styles.w_128px__62}>
              After your car is confirmed
            </div>
            <div className={styles.flex_64}>
              50% of your booking amount is retained
            </div>
          </div>
          <div className={styles.flex_65}>
            <div className={styles.w_128px__62}>
              If we can&apos;t deliver
            </div>
            <div className={styles.flex_63}>
              100% refund. Our failure is never your cost.
            </div>
          </div>
        </div>

        <div
          className={styles.mt_4_66}
          style={{
            background: "var(--quote-info-bg)",
            borderColor: "var(--quote-info-border)",
          }}
        >
          <Image
            src={QUOTE_ASSETS.infoIcon}
            alt=""
            width={24}
            height={24}
            className={styles.shrink_0_67}
            unoptimized
          />
          <div className={styles.min_w_0_68}>
            <p className={styles.font_medium_59}>
              When does &ldquo;confirmed&rdquo; happen?
            </p>
            <p className={styles.mt_1_69}>
              After your paperwork clears and we lock your exact car with a dealer, you&apos;ll
              be told clearly before that happens. Until then you can walk away free, and even
              after, you can change colour or model once for ₹5,000 instead of cancelling.
            </p>
          </div>
        </div>

        <button
          type="button"
          className={styles.mt_4_70}
        >
          Learn more about cancellation policies
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M9 18l6-6-6-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>

      </div>

      {/* Sticky footer */}
        <div className={[styles.fixed_71, "footer-elevated"].filter(Boolean).join(" ")}>
        <div
          className={styles.flex_72}
          style={{
            background: "var(--quote-timer-bg)",
            color: "var(--quote-timer-text)",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
            <path
              d="M12 7v5l3 2"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          Offer expires in 24hr 53min
        </div>
        <div className={styles.px_5_73}>
          <button
            type="button"
            onClick={() => router.push("/payment")}
            className={[styles.primary_cta_74, "primary-cta"].filter(Boolean).join(" ")}
          >
            {bookingCtaLabel}
          </button>
        </div>
      </div>

      <QuoteFlowMenuSheet
        open={flowMenuOpen}
        activeFlow={activeFlow}
        onClose={() => setFlowMenuOpen(false)}
        onFlowChange={handleFlowChange}
      />
    </div>
  );
}

function Row({
  label,
  value,
  small,
}: {
  label: string;
  value: string;
  small?: boolean;
}) {
  return (
    <div className={styles.flex_75}>
      <span className={small ? styles.text_var_quote_text_body_2 : styles.text_121212__3}>
        {label}
      </span>
      <span className={styles.font_medium_59}>{value}</span>
    </div>
  );
}
