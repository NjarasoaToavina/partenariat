import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../context/ToastContext.jsx";
import { updateAtelier, getAtelier } from "../services/atelierService";
import TitleForm from "../components/common/TitleForm.jsx";
import AtelierForm from "../components/atelier/AtelierForm.jsx";
import Loader from "../components/common/Loader"; // Ajout de l'import du Loader
import { useState, useEffect } from "react";

export default function ModifierAtelier() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  
  const [saving, setSaving] = useState(false);
  const [atelier, setAtelier] = useState({});
  const [isLoading, setIsLoading] = useState(true); // 1. Initialisé à true au chargement

  useEffect(() => {
    setIsLoading(true); // Re-déclenche le loader si l'ID change
    getAtelier(id)
      .then((res) => {
        setAtelier(res.data);
      })
      .catch(() => {
        toast.error("Atelier introuvable.");
        navigate("/ateliers"); // Redirection de sécurité si le partenaire n'existe pas
      })
      .finally(() => {
        setIsLoading(false); // 2. Arrêt du loader une fois la réponse reçue (succès ou échec)
      });
  }, [id, toast, navigate]);

  const handleSubmit = async (form) => {
    // console.log("Atelier data:", form);
    setSaving(true);
    try {
      await updateAtelier(id, form);
      toast.success("Atelier modifié avec succès.");
      navigate("/ateliers");
    } catch {
      toast.error("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <TitleForm title="Modifier un atelier" />
      
      {/* 3. Condition : Si chargement en cours, on montre le Loader, sinon le formulaire */}
      {isLoading ? (
        <Loader fullScreen={false} label="Chargement des données de l'atelier..." />
      ) : (
        <AtelierForm 
          initialValues={atelier} 
          onSubmit={handleSubmit} 
          onCancel={() => navigate("/ateliers")} 
          saving={saving} 
        />
      )}
    </div>
  );
}
