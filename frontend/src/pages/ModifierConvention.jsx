import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../context/ToastContext.jsx";
import { getConvention, updateConvention } from "../services/conventionService";
import TitleForm from "../components/common/TitleForm.jsx";
import ConventionForm from "../components/partners/ConventionForm.jsx";
import Loader from "../components/common/Loader.jsx";

export default function ModifierConvention() {
  const navigate = useNavigate();
  const { id, convId } = useParams();
  const toast = useToast();
  const [saving, setSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [convention, setConvention] = useState(null);

  useEffect(() => {
    const fetchConvention = async () => {
      try {
        const response = await getConvention(convId);
        setConvention(response.data);
      } catch {
        toast.error("Impossible de charger cette convention.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchConvention();
  }, [convId, toast]);

  const handleSubmit = async (form) => {
    console.log("Convention data:", form);
    setSaving(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value !== null && value !== undefined) formData.append(key, value);
      });

      formData.append("_method", "PUT");
      await updateConvention(convId, formData);

      toast.success("Convention modifiée avec succès.");
      navigate(`/partenaires/${id}/conventions/${convId}`);
    } catch {
      toast.error("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return <Loader fullScreen={false} label="Chargement de la convention..." />;
  }

  return (
    <div className="space-y-4">
      <TitleForm
        title="Modifier la convention"
        onBack={() => navigate(`/partenaires/${id}/conventions/${convId}`)}
      />
      <ConventionForm
        initialValues={convention}
        onSubmit={handleSubmit}
        onCancel={() => navigate(`/partenaires/${id}/conventions/${convId}`)}
        saving={saving}
        
      />
    </div>
  );
}