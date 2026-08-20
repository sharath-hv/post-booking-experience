import shiviAvatar from "@/assets/Shivi image.png";
import { Avatar } from "@/components/atoms/media/Avatar";
import { cn } from "@/utils/utils";

import styles from "./ShiviHeader.module.scss";

export type ShiviHeaderProps = {
  name?: string;
  affiliation?: string;
  className?: string;
};

/** Avatar + “Shivi · ACKO Drive”. */
export function ShiviHeader({
  name = "Shivi",
  affiliation = "ACKO Drive",
  className,
}: ShiviHeaderProps) {
  return (
    <div className={cn(styles.identity, className)}>
      <Avatar src={shiviAvatar} size={32} priority />
      <div className={styles.metaRow}>
        <span className={styles.name}>{name}</span>
        <span aria-hidden className={styles.meta}>
          ·
        </span>
        <span className={styles.meta}>{affiliation}</span>
      </div>
    </div>
  );
}
