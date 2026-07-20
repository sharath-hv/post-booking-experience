import Image from "next/image";

import { SELF_FINANCE_HOW_IT_WORKS_STEPS } from "@/components/payment/self-finance-confirmed-content";
import styles from "./SelfFinanceHowItWorksCard.module.scss";


type SelfFinanceHowItWorksCardProps = {
  /** When false, omit the inner heading (e.g. bottom sheet already has a title). */
  showTitle?: boolean;
  /** `embedded` — grey fill for bottom sheet; default keeps bordered card on success screen. */
  variant?: "card" | "embedded";
};

export function SelfFinanceHowItWorksCard({
  showTitle = true,
  variant = "card",
}: SelfFinanceHowItWorksCardProps) {
  const isEmbedded = variant === "embedded";

  const content = (
    <>
      {showTitle && (
        <h2 className={styles.mb_4_0}>
          Here is how it works
        </h2>
      )}
      <div className={isEmbedded ? styles.space_y_5 : styles.space_y_4}>
        {SELF_FINANCE_HOW_IT_WORKS_STEPS.map((step, index) => (
          <div key={index} className={styles.flex_1}>
            <div
              className={styles.relative_2}
            >
              <Image
                src={step.icon}
                alt=""
                width={20}
                height={20}
                className={styles.object_contain_3}
                unoptimized
              />
            </div>
            <p
              className={isEmbedded ? styles.step_body_sm : styles.step_body_xs}
            >
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </>
  );

  if (isEmbedded) {
    return <div className={styles.w_full_4}>{content}</div>;
  }

  return (
    <div className={[styles.w_full_5, "card-elevated"].filter(Boolean).join(" ")}>
      {content}
    </div>
  );
}
