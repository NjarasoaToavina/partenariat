import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../context/ToastContext.jsx";
import { createConvention } from "../services/conventionService";
import TitleForm from "../components/common/TitleForm.jsx";
import ConventionForm from "../components/partners/ConventionForm.jsx";
import { useState } from "react";

export default function AjouterConvention() {
  const navigate = useNavigate();
  const { id } = useParams();
  const toast = useToast();
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (form) => {
    console.log("Convention data:", form);
    setSaving(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value !== null && value !== undefined) formData.append(key, value);
      });

      await createConvention(id, formData);

      toast.success("Convention ajoutée avec succès.");
      navigate(`/partenaires/${id}/conventions`);
    } catch {
      toast.error("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <TitleForm
        title="Ajouter une convention"
        onBack={() => navigate(`/partenaires/${id}/conventions`)}
      />
      <ConventionForm
        onSubmit={handleSubmit}
        onCancel={() => navigate(`/partenaires/${id}/conventions`)}
        saving={saving}
      />
    </div>
  );
}