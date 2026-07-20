import Image from "next/image";

import tickIcon from "@/assets/tick.svg";
import styles from "./DocumentUploadVerifiedBanner.module.scss";


type DocumentUploadVerifiedBannerProps = {
  message: string;
};

/** Green verified strip — loan wizard (PAN/Aadhaar already done) and similar flows. */
export function DocumentUploadVerifiedBanner({ message }: DocumentUploadVerifiedBannerProps) {
  return (
    <div className={styles.flex_0}>
      <Image
        src={tickIcon}
        alt=""
        width={20}
        height={20}
        className={styles.shrink_0_1}
        unoptimized
      />
      <p className={styles.text_sm_2}>{message}</p>
    </div>
  );
}
