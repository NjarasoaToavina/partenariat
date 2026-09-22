import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../context/ToastContext.jsx";
import { updatePartnership, getPartnership } from "../services/partenariatService";
import TitleForm from "../components/common/TitleForm.jsx";
import PartnersForm from "../components/partners/PartnersForm.jsx";
import Loader from "../components/common/Loader"; // Ajout de l'import du Loader
import { useState, useEffect } from "react";

export default function ModifierPartenaire() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  
  const [saving, setSaving] = useState(false);
  const [partner, setPartner] = useState({});
  const [isLoading, setIsLoading] = useState(true); // 1. Initialisé à true au chargement

  useEffect(() => {
    setIsLoading(true); // Re-déclenche le loader si l'ID change
    getPartnership(id)
      .then((res) => {
        setPartner(res.data);
      })
      .catch(() => {
        toast.error("Partenaire introuvable.");
        navigate("/partenaires"); // Redirection de sécurité si le partenaire n'existe pas
      })
      .finally(() => {
        setIsLoading(false); // 2. Arrêt du loader une fois la réponse reçue (succès ou échec)
      });
  }, [id, toast, navigate]);

  const handleSubmit = async (form) => {
    console.log("Partenaire data:", form);
    setSaving(true);
    try {
      await updatePartnership(id, form);
      toast.success("Partenaire modifié avec succès.");
      navigate("/partenaires");
    } catch {
      toast.error("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <TitleForm title="Modifier un partenaire" />
      
      {/* 3. Condition : Si chargement en cours, on montre le Loader, sinon le formulaire */}
      {isLoading ? (
        <Loader fullScreen={false} label="Chargement des données du partenaire..." />
      ) : (
        <PartnersForm 
          initialValues={partner} 
          onSubmit={handleSubmit} 
          onCancel={() => navigate("/partenaires")} 
          saving={saving} 
        />
      )}
    </div>
  );
}
