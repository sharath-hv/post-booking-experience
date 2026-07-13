import Image from "next/image";

import tickIcon from "@/assets/tick.svg";

type DocumentUploadVerifiedBannerProps = {
  message: string;
};

/** Green verified strip — loan wizard (PAN/Aadhaar already done) and similar flows. */
export function DocumentUploadVerifiedBanner({ message }: DocumentUploadVerifiedBannerProps) {
  return (
    <div className="flex items-center gap-[8px] rounded-2xl bg-[#ebfbee] px-4 py-2">
      <Image
        src={tickIcon}
        alt=""
        width={20}
        height={20}
        className="shrink-0 object-contain"
        unoptimized
      />
      <p className="text-sm font-normal leading-5 text-[#121212]">{message}</p>
    </div>
  );
}
