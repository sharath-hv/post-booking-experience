import { ModifySelectionColourScreen } from "@/components/organisms/kyc/ModifySelectionColourScreen";
import { ModifySelectionFlowGuard } from "@/components/organisms/kyc/ModifySelectionFlowGuard";
import { ModifySelectionPlaceholderScreen } from "@/components/organisms/kyc/ModifySelectionPlaceholderScreen";
import { ModifySelectionVariantScreen } from "@/components/organisms/kyc/ModifySelectionVariantScreen";

type PageProps = {
  params: Promise<{ choice: string }>;
};

export function generateStaticParams() {
  return [{ choice: "colour" }, { choice: "variant" }];
}

/**
 * Demo next step after modify choice — replace with real pickers per branch.
 */
export default async function ModifySelectionChoicePage({ params }: PageProps) {
  const { choice } = await params;
  return (
    <ModifySelectionFlowGuard>
      {choice === "colour" ? (
        <ModifySelectionColourScreen />
      ) : choice === "variant" ? (
        <ModifySelectionVariantScreen />
      ) : (
        <ModifySelectionPlaceholderScreen choiceSlug={choice} />
      )}
    </ModifySelectionFlowGuard>
  );
}
