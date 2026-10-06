import { FileSignature } from "lucide-react";
import ConventionCard from "./ConventionCard";

export default function ConventionCardGrid({ conventions, onViewDetails }) {
  if (!conventions || conventions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
        <div className="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center">
          <FileSignature size={24} className="text-slate-300" />
        </div>
        <p className="text-sm font-medium text-slate-500">
          Aucune convention trouvée.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {conventions.map((conv) => (
        <ConventionCard
          key={conv.id_conv ?? conv.num_conv}
          convention={conv}
          onViewDetails={onViewDetails}
        /> 
      ))}
    </div>
  );
}