import Image from "next/image";
import { cn } from "@/lib/utils";
import styles from "./DigilockerFetchButton.module.scss";


import {
  KYC_UPLOAD_DIGILOCKER_COLOR,
  KYC_UPLOAD_DIGILOCKER_FETCH_LABEL,
  KYC_UPLOAD_DIGILOCKER_LOGO,
} from "@/components/kyc/kyc-upload-content";

type DigilockerFetchButtonProps = {
  onClick: () => void;
  className?: string;
};

export function DigilockerFetchButton({ onClick, className = styles.mb4 }: DigilockerFetchButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(styles.flex_0, className)}
      style={{ color: KYC_UPLOAD_DIGILOCKER_COLOR }}
    >
      <span>{KYC_UPLOAD_DIGILOCKER_FETCH_LABEL}</span>
      <span className={styles.relative_0} aria-hidden>
        <Image
          src={KYC_UPLOAD_DIGILOCKER_LOGO}
          alt=""
          fill
          className={styles.object_contain_1}
          unoptimized
          sizes="20px"
        />
      </span>
    </button>
  );
}
