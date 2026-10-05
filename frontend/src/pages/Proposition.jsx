import { CalendarDays, Users2 } from "lucide-react";
import { ACTIVITY_PROPOSALS, PARTNER_PROPOSALS } from "../data/propositionData";
import ProposalSection from "../components/proposition/ProposalSection";
import { useToast } from "../context/ToastContext";

export default function Proposition() {
  const toast = useToast();

  const handleValidate = (item) => {
    // TODO: brancher sur l'API — passe la proposition en statut "validee"
    toast.success(`"${item.titre}" validée.`);
  };
  const handleReject = (item) => {
    // TODO: brancher sur l'API — passe la proposition en statut "refusee"
    toast.success(`"${item.titre}" refusée.`);
  };

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs text-slate-400">Visualisation des informations</p>
        <h1 className="text-lg font-bold text-slate-900">Propositions</h1>
      </div>

      <ProposalSection
        icon={CalendarDays}
        title="Propositions d'activités (par les partenaires)"
        items={ACTIVITY_PROPOSALS}
        itemLabel="propositions"
        onValidate={handleValidate}
        onReject={handleReject}
        onOpenFilters={() => {/* à brancher */}}
      />

      <ProposalSection
        icon={Users2}
        title="Propositions de partenaires (par les services de l'ESMIA)"
        items={PARTNER_PROPOSALS}
        itemLabel="partenaires proposés" 
        onValidate={handleValidate}
        onReject={handleReject}
        onOpenFilters={() => {/* à brancher */}}
      />
    </div>
  );
}