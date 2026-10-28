import { useEffect, useState } from "react";

import StatusTable from "../components/dashboard/StatusTable";
import DonutCard from "../components/dashboard/DonutCard";
import PartnershipEvolutionChart from "../components/dashboard/PartnershipEvolutionChart";
import Loader from "../components/common/Loader";

import { getDashboardStats } from "../services/dashboardService";

export default function Dashboard() {
  const [year, setYear] = useState(new Date().getFullYear());

  const [campusRows, setCampusRows] = useState([]);
  const [evolution, setEvolution] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const fetchStats = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await getDashboardStats(year);
        console.log("data",data);

        if (!active) return;

        setCampusRows(data.campus ?? []);
        setEvolution(data.evolution ?? []);

      } catch (err) {
        if (!active) return;

        console.error("Erreur Dashboard :", err);
        setError("Impossible de charger les statistiques.");

      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchStats();

    return () => {
      active = false;
    };
  }, [year]);

  if (loading) {
    return <Loader fullScreen={false} label="Chargement des données..." />;
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Graphique d'évolution */}
      <PartnershipEvolutionChart
        data={evolution}
        year={year}
        onYearChange={setYear}
      />

      {/* Tableau des statuts par campus */}
      <StatusTable rows={campusRows} />

      {/* Répartition des partenaires par statut */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {campusRows.map((row) => (
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