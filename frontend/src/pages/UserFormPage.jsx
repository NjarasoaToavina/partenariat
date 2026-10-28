import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import UserForm from "../components/utilisateur/UserForm";
import Loader from "../components/common/Loader";
import { getUser } from "../services/userService";
import { useToast } from "../context/ToastContext";

export default function UserFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const toast = useToast();

  const isEditing = Boolean(id);

  const [userToEdit, setUserToEdit] = useState(null);
  const [loading, setLoading] = useState(isEditing);

  useEffect(() => {
    if (!id) {
      setUserToEdit(null);
      setLoading(false);
      return;
    }

    let cancelled = false;

    const loadUser = async () => {
      try {
        setLoading(true);

        const response = await getUser(id);

        if (!cancelled) {
          setUserToEdit(response.data);
        }
      } catch (error) {
        if (!cancelled) {
          toast.error("Impossible de récupérer cet utilisateur.");
          navigate("/utilisateurs", { replace: true });
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadUser();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader fullScreen={false} label="Chargement de la page..." />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">

      {/* En-tête */}
      <div>
        <button
          onClick={() => navigate("/utilisateurs")}
          className="flex items-center gap-2 text-slate-500 hover:text-[#0065CD] mb-4"
        >
          <ArrowLeft size={18} />
          Retour aux utilisateurs
        </button>

        <h1 className="text-2xl font-bold text-[#063C58]">
          {isEditing
            ? "Modifier un utilisateur"
            : "Ajouter un utilisateur"}
        </h1>

        <p className="text-sm text-slate-500 mt-1">
          {isEditing
            ? "Modifiez les informations du compte utilisateur."
            : "Renseignez les informations du nouvel utilisateur."}
        </p>
      </div>

      {/* Formulaire */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <UserForm
          userToEdit={userToEdit}
          onCancel={() => navigate("/utilisateurs")}
          onSuccess={() => navigate("/utilisateurs")}
        />
      </div>

    </div>
  );
}