import StatusTable from "../components/dashboard/StatusTable";
import DonutCard from "../components/dashboard/DonutCard";
import { CAMPUS_ROWS } from "../data/campusData";

export default function Dashboard() {
  return (
    <>
      <StatusTable rows={CAMPUS_ROWS} />
 
      <div className="flex flex-col lg:flex-row gap-6">
        {CAMPUS_ROWS.map((row) => (
          <DonutCard
            key={row.key}
            title="Répartition des partenaires par statut"
            badge={row.badge}
            row={row}
          />
        ))}
      </div>
    </>
  );
}