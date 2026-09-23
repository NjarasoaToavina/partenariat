import { useNavigate} from "react-router-dom";
import { useToast } from "../context/ToastContext.jsx";
import { createAtelier} from "../services/atelierService";
import TitleForm from "../components/common/TitleForm.jsx";
import AtelierForm from "../components/atelier/AtelierForm.jsx";
import { useState} from "react";

export default function AjouterAtelier() {
  const navigate = useNavigate();
  const toast = useToast();
  
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (form) => {
    // console.log("Atelier data:", form);
    setSaving(true);
    try {
      await createAtelier(form);
      toast.success("Atelier modifié ajouté avec succès.");
      navigate("/ateliers");
    } catch {
      toast.error("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <TitleForm title="Ajouter un atelier" />
      <AtelierForm 
          onSubmit={handleSubmit} 
          onCancel={() => navigate("/ateliers")} 
          saving={saving} 
      />
    </div>
  );
}
