import StatusTable from "../components/dashboard/StatusTable";
import DonutCard from "../components/dashboard/DonutCard";
import { CAMPUS_ROWS } from "../data/campusData";

export default function Dashboard() {
  return (
    <div className="space-y-6">

      <StatusTable rows={CAMPUS_ROWS} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {CAMPUS_ROWS.map((row) => (
          <DonutCard
            key={row.key}
            title="Répartition des partenaires par statut"
            badge={row.badge}
            row={row}
          />
        ))}
      </div>

    </div>
  );
}