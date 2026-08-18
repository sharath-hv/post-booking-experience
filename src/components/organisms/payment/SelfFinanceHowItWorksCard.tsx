import Image from "next/image";

import { IconWell } from "@/components/atoms/icon/IconWell";
import { SoftIconPad } from "@/components/atoms/icon/SoftIconPad";
import {
  SELF_FINANCE_HOW_IT_WORKS_STEPS,
  type SelfFinanceHowItWorksStep,
} from "@/components/organisms/payment/self-finance-confirmed-content";
import styles from "./SelfFinanceHowItWorksCard.module.scss";

type SelfFinanceHowItWorksCardProps = {
  /** When false, omit the inner heading (e.g. bottom sheet already has a title). */
  showTitle?: boolean;
  /** `embedded` — SoftIconPad for bottom sheets; default keeps IconWell on success card. */
  variant?: "card" | "embedded";
  /** Override steps (e.g. full-payment confirm sheet). Defaults to self-finance steps. */
  steps?: readonly SelfFinanceHowItWorksStep[];
};

export function SelfFinanceHowItWorksCard({
  showTitle = true,
  variant = "card",
  steps = SELF_FINANCE_HOW_IT_WORKS_STEPS,
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
        {steps.map((step, index) => (
          <div key={index} className={styles.flex_1}>
            {isEmbedded ? (
              <SoftIconPad aria-hidden>
                <Image
                  src={step.icon}
                  alt=""
                  width={20}
                  height={20}
                  className={styles.object_contain_3}
                  unoptimized
                />
              </SoftIconPad>
            ) : (
              <IconWell as="div" aria-hidden>
                <Image
                  src={step.icon}
                  alt=""
                  width={20}
                  height={20}
                  className={styles.object_contain_3}
                  unoptimized
                />
              </IconWell>
            )}
            <p className={isEmbedded ? styles.step_body_sm : styles.step_body_xs}>
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
