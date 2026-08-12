import Image from "next/image";

import tickIcon from "@/assets/tick.svg";
import styles from "./DocumentUploadInfoTipsCard.module.scss";


/** Gap from page title to tips card — shared across KYC and loan document upload. */
export const DOCUMENT_UPLOAD_TITLE_TO_TIPS_CLASS = styles.documentUploadTitleToTips;

/** Gap from tips/banner block to document cards — shared across upload flows. */
export const DOCUMENT_UPLOAD_TIPS_TO_SECTIONS_CLASS = styles.documentUploadTipsToSections;

type DocumentUploadInfoTipsCardProps = {
  tips: readonly string[];
};

export function DocumentUploadInfoTipsCard({ tips }: DocumentUploadInfoTipsCardProps) {
  return (
    <div className={styles.rounded_2xl_0}>
      <ul className={styles.flex_1}>
        {tips.map((tip) => (
          <li key={tip} className={styles.flex_2}>
            <span className={styles.relative_3}>
              <Image
                src={tickIcon}
                alt=""
                fill
                className={styles.object_contain_4}
                unoptimized
                sizes="20px"
              />
            </span>
            <span className={styles.text_xs_5}>{tip}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
