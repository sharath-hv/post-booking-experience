import { ModifySelectionDifferentCarVariantScreen } from "@/components/organisms/kyc/ModifySelectionDifferentCarVariantScreen";
import { ModifySelectionFlowGuard } from "@/components/organisms/kyc/ModifySelectionFlowGuard";
import { getModifySelectionCarModelStaticParams } from "@/constants/modify-selection-car-models-content";

type PageProps = {
  params: Promise<{ brand: string; model: string }>;
};

export function generateStaticParams() {
  return getModifySelectionCarModelStaticParams();
}

/** Variant selection after model pick. */
export default async function ModifySelectionDifferentCarModelPage({ params }: PageProps) {
  const { brand, model } = await params;
  return (
    <ModifySelectionFlowGuard>
      <ModifySelectionDifferentCarVariantScreen brandId={brand} modelId={model} />
    </ModifySelectionFlowGuard>
  );
}
