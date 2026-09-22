import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext.jsx";
import { createPartnership } from "../services/partenariatService";
import TitleForm from "../components/common/TitleForm.jsx";
import PartnersForm from "../components/partners/PartnersForm.jsx";
import { useState } from "react";

export default function AjouterPartenaire() {
  const navigate = useNavigate();
  const toast = useToast();
  const [saving,setSaving] = useState(false);

  const handleSubmit = async (form) => {
    console.log("Partenaire data:", form);
    setSaving(true);
    try {
      await createPartnership(form);
      
      toast.success("Partenaire ajouté avec succès.");
      navigate("/partenaires");
    } catch {
      toast.error("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <TitleForm title="Ajouter un partenaire"/>
      <PartnersForm onSubmit={handleSubmit} onCancel={() => navigate("/partenaires")} saving={saving} />
    </div>
  
  );
}