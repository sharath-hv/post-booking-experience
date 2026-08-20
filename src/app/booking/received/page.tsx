import {
  ConciergeMomentArtifact,
  ConciergeMomentProvider,
  ConciergeMomentTurn,
} from "@/components/organisms/concierge/ConciergeMoment";

/**
 * Arrival — the booking amount payment landed and Shivi takes over.
 * Replaces the old payment-success → buying-guide → KYC chain with one turn.
 */
export default function ArrivalPage() {
  return (
    <ConciergeMomentProvider moment="arrival">
      <ConciergeMomentTurn>
        <ConciergeMomentArtifact />
      </ConciergeMomentTurn>
    </ConciergeMomentProvider>
  );
}
