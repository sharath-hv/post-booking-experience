"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo } from "react";

import { ModifySelectionCarModelRow } from "@/components/organisms/kyc/ModifySelectionCarModelRow";
import { PageLeadHeading } from "@/components/organisms/PageLeadHeading";
import { StandaloneScreenHeader } from "@/components/organisms/StandaloneScreenHeader";
import {
  getModifySelectionCarBrandById,
  MODIFY_SELECTION_CAR_BRAND_PATH,
} from "@/constants/modify-selection-car-brands-content";
import {
  getModifySelectionCarModelsForBrand,
  modifySelectionCarModelPath,
  modifySelectionCarModelScreenTitle,
} from "@/constants/modify-selection-car-models-content";
import { MODIFY_SELECTION_PAGE_SHELL_CLASS } from "@/constants/modify-selection-content";
import { MODIFY_SELECTION_STAGGER_MS } from "@/helpers/modify-selection-stagger";
import styles from "./ModifySelectionCarModelScreen.module.scss";


const {
  title: STAGGER_TITLE_MS,
  modelList: STAGGER_LIST_MS,
  modelStep: STAGGER_MODEL_STEP_MS,
} = MODIFY_SELECTION_STAGGER_MS;

type ModifySelectionCarModelScreenProps = {
  brandId: string;
};

/**
 * Choose a different car — model list for selected brand (Figma 2686:11003).
 */
export function ModifySelectionCarModelScreen({ brandId }: ModifySelectionCarModelScreenProps) {
  const router = useRouter();
  const brand = useMemo(() => getModifySelectionCarBrandById(brandId), [brandId]);
  const models = useMemo(() => getModifySelectionCarModelsForBrand(brandId), [brandId]);

  useEffect(() => {
    if (brand == null) {
      router.replace(MODIFY_SELECTION_CAR_BRAND_PATH);
    }
  }, [brand, router]);

  const onSelectModel = useCallback(
    (modelId: string) => {
      router.push(modifySelectionCarModelPath(brandId, modelId));
    },
    [brandId, router],
  );

  if (brand == null) {
    return null;
  }

  const title = modifySelectionCarModelScreenTitle(brand.name);

  return (
    <div className={MODIFY_SELECTION_PAGE_SHELL_CLASS}>
      <StandaloneScreenHeader />

      <main className={styles.mx_auto_0}>
        <PageLeadHeading
          title={title}
          titleDelayMs={STAGGER_TITLE_MS}
        />

        <div
          className={[styles.payment_success_stagger_1, "payment-success-stagger"].filter(Boolean).join(" ")}
          style={{ animationDelay: `${STAGGER_LIST_MS}ms` }}
          role="list"
          aria-label={title}
        >
          {models.map((model, index) => (
            <div
              key={model.id}
              className={[styles.payment_success_stagger_2, "payment-success-stagger"].filter(Boolean).join(" ")}
              style={{
                animationDelay: `${STAGGER_LIST_MS + index * STAGGER_MODEL_STEP_MS}ms`,
              }}
              role="listitem"
            >
              <ModifySelectionCarModelRow
                model={model}
                onSelect={() => onSelectModel(model.id)}
              />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
