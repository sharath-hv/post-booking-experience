import { ModifySelectionDifferentCarColourScreen } from "@/components/organisms/kyc/ModifySelectionDifferentCarColourScreen";
import { ModifySelectionFlowGuard } from "@/components/organisms/kyc/ModifySelectionFlowGuard";
import { getModifySelectionCarModelStaticParams } from "@/constants/modify-selection-car-models-content";

type PageProps = {
  params: Promise<{ brand: string; model: string }>;
};

export function generateStaticParams() {
  return getModifySelectionCarModelStaticParams();
}

/** Colour selection after variant pick. */
export default async function ModifySelectionDifferentCarColourPage({ params }: PageProps) {
  const { brand, model } = await params;
  return (
    <ModifySelectionFlowGuard>
      <ModifySelectionDifferentCarColourScreen brandId={brand} modelId={model} />
    </ModifySelectionFlowGuard>
  );
}
