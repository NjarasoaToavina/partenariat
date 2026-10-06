import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import { getAllConventionsFromPartner } from "../services/conventionService";
import { useEffect, useMemo, useState } from "react";
import Loader from "../components/common/Loader.jsx";
import TitleForm from "../components/common/TitleForm";
import ConventionToolbar from "../components/partners/ConventionToolbar.jsx";
import ConventionCardGrid from "../components/partners/ConventionCardGrid.jsx";

export default function Convention() {
  const navigate = useNavigate();
  const { id } = useParams();
  const toast = useToast();
  const [conventions, setConventions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchConventions = async () => {
      try {
        const response = await getAllConventionsFromPartner(id);
        console.log("Données des conventions récupérées :", response.data);
        setConventions(response.data);
      } catch (error) {
        toast.error("Impossible de charger la liste des conventions.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchConventions();
  }, [id, toast]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return conventions;
    return conventions.filter((c) =>
      [c.num_conv, c.objet_part, c.preambule]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(term))
    );
  }, [conventions, search]);

  const handleViewDetails = (conv) => {
    navigate(`/partenaires/${id}/conventions/${conv.id_conv}`);
  };

  return (
    <div className="space-y-4">
        <TitleForm
            title={
                conventions.length > 0
                ? `Conventions du partenaire ${conventions[0].partenariat?.nom_part}`
                : "Conventions du partenaire"
            }
            description="Historique des conventions signées avec ce partenaire."
            onBack={() => navigate("/partenaires")}
        />
      <ConventionToolbar
        search={search}
        onSearchChange={setSearch}
        onAddConvention={() => navigate(`/partenaires/${id}/conventions/ajouter`)}
        id_part={conventions.length > 0 ? conventions[0].partenariat?.id_part : ""}
      />

      {isLoading ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
          <Loader fullScreen={false} label="Chargement des conventions..." />
        </div>
      ) : (
        <ConventionCardGrid conventions={filtered} onViewDetails={handleViewDetails} />
      )}
    </div>
  );
}