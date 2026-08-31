import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import StatusTable from "../components/dashboard/StatusTable";
import DonutCard from "../components/dashboard/DonutCard";
import { CAMPUS_ROWS } from "../data/campusData";

export default function Dashboard() {
  return (
    <div className="min-h-screen w-full flex bg-slate-50">
      <Sidebar />

      <div className="flex-1 min-w-0 flex flex-col">
        <Header />

        <main className="flex-1 px-6 md:px-8 py-6 space-y-6">
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
        </main>
      </div>
    </div>
  );
}