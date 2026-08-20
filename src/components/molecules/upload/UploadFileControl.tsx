"use client";

import { UploadTrigger } from "@/components/atoms/cta/UploadTrigger";
import { UploadFileRow } from "@/components/molecules/upload/UploadFileRow";

export type UploadFileControlProps =
  | { mode: "empty"; label?: string; onUpload: () => void; className?: string }
  | { mode: "file"; name: string; onRemove: () => void; className?: string };

/** Empty dashed upload, or a filled file row with delete. */
export function UploadFileControl(props: UploadFileControlProps) {
  if (props.mode === "empty") {
    return (
      <UploadTrigger onClick={props.onUpload} label={props.label} className={props.className} />
    );
  }
  return <UploadFileRow name={props.name} onRemove={props.onRemove} className={props.className} />;
}
