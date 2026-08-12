import { ModifySelectionDifferentCarConfirmPageClient } from "@/components/organisms/kyc/ModifySelectionDifferentCarConfirmPageClient";
import { ModifySelectionFlowGuard } from "@/components/organisms/kyc/ModifySelectionFlowGuard";
import { getModifySelectionCarModelStaticParams } from "@/constants/modify-selection-car-models-content";

type PageProps = {
  params: Promise<{ brand: string; model: string }>;
};

export function generateStaticParams() {
  return getModifySelectionCarModelStaticParams();
}

/** Different car — review selection and pay booking amount delta. */
export default async function ModifySelectionDifferentCarConfirmPage({ params }: PageProps) {
  const { brand, model } = await params;
  return (
    <ModifySelectionFlowGuard>
      <ModifySelectionDifferentCarConfirmPageClient brandId={brand} modelId={model} />
    </ModifySelectionFlowGuard>
  );
}
