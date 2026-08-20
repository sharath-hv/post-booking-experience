import { ExperienceFlowRedirect } from "@/components/molecules/ExperienceFlowRedirect";
import { JOURNEY_PATHS } from "@/helpers/journey-routes";

export default function KycCarAllocationPendingRedirect() {
  return (
    <ExperienceFlowRedirect
      modifyHref={JOURNEY_PATHS.identity.hub}
      defaultHref={JOURNEY_PATHS.carAllocation.pending}
    />
  );
}
