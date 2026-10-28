import { useEffect, useState } from "react";
import { X, Save, UserPlus, Lock, Mail, User, Building2, Briefcase, GraduationCap, BookOpen } from "lucide-react";

import FormField from "../auth/FormField";
import PhotoUpload from "../auth/PhotoUpload";
import Loader from "../common/Loader";

import { createUser, updateUser } from "../../services/userService";
import { useToast } from "../../context/ToastContext";
import { URL } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

export default function UserForm({
  userToEdit = null,
  onCancel,
  onSuccess,
}) {
  const toast = useToast();

  const isEditing = Boolean(userToEdit);

  const [form, setForm] = useState({
    userType: "etudiant",
    name: "",
    email: "",
    fonction: "",
    nom_service: "",
    nie: "",
    filiere: "",
    niveau: "",
    password: "",
    password_confirmation: "",
  });

  const [photoPreview, setPhotoPreview] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user: currentUser, fetchUser } = useAuth();


  useEffect(() => {
    if (!photo) {
        setPhotoPreview(null);
        return;
    }

    const previewUrl = window.URL.createObjectURL(photo);

    setPhotoPreview(previewUrl);

    return () => {
        window.URL.revokeObjectURL(previewUrl);
    };
    }, [photo]);

  useEffect(() => {
    setForm({
      userType: userToEdit?.roles?.[0]?.name || "etudiant",
      name: userToEdit?.name || "",
      email: userToEdit?.email || "",
      fonction: userToEdit?.fonction || "",
      nom_service: userToEdit?.nom_service || "",
      nie: userToEdit?.nie || "",
      filiere: userToEdit?.filiere || "",
      niveau: userToEdit?.niveau || "",
      password: "",
      password_confirmation: "",
    });

    setPhoto(null);
  }, [userToEdit]);



  const setField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const backendUrl = URL.replace(/\/api\/?$/, "");

  const currentPhotoUrl = userToEdit?.image
    ? `${backendUrl}/storage/${userToEdit.image}`
    : null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.password_confirmation) {
      toast.error("Les mots de passe ne correspondent pas.");
      return;
    }

    if (!isEditing && !form.password) {
      toast.error("Le mot de passe est obligatoire.");
      return;
    }

    if (form.password && form.password.length < 8) {
      toast.error("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }

    const formData = new FormData();

    formData.append("name", form.name);
    formData.append("email", form.email);

    if (!isEditing) {
      formData.append("userType", form.userType);
    }

    if (form.password) {
      formData.append("password", form.password);
      formData.append(
        "password_confirmation",
        form.password_confirmation
      );
    }

    if (photo) {
      formData.append("image", photo);
    }

    const role = form.userType;

    if (role === "partenaire") {
      formData.append("fonction", form.fonction);
    }

    if (role === "service") {
      formData.append("nom_service", form.nom_service);
    }

    if (role === "etudiant") {
      formData.append("nie", form.nie);
      formData.append("filiere", form.filiere);
      formData.append("niveau", form.niveau);
    }

    try {
      setIsLoading(true);

    if (isEditing) {
        await updateUser(userToEdit.id, formData);

    // Actualiser AuthContext si le responsable modifie son propre compte
    if (Number(userToEdit.id) === Number(currentUser?.id)) {
        await fetchUser();
    }
    } else {
    await createUser(formData);
    }

      toast.success(
        isEditing
          ? "Utilisateur modifié avec succès."
          : "Utilisateur ajouté avec succès."
      );

      await onSuccess?.();

    } catch (error) {
      const errors = error.response?.data?.errors;

      const message = errors
        ? Object.values(errors).flat()[0]
        : error.response?.data?.message ||
          "Une erreur est survenue.";

      toast.error(message);

    } finally {
      setIsLoading(false);
    }
  };

  return (
        <form onSubmit={handleSubmit} className="space-y-6">

         <div className="flex flex-col items-center gap-4">

        {/* Aperçu de la photo */}
        {(photoPreview || currentPhotoUrl) && (
            <div className="relative">
            <img
                src={photoPreview || currentPhotoUrl}
                alt="Photo de profil"
                className="w-24 h-24 rounded-full object-cover border-4 border-blue-100 shadow-sm"
            />

            {photoPreview && (
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-green-100 text-green-700 text-xs font-medium px-3 py-1 rounded-full">
                Nouvelle photo
                </span>
            )}
            </div>
        )}

        {/* Sélection de la photo */}
        <PhotoUpload
            value={photo}
            onChange={setPhoto}
            currentPhotoUrl={currentPhotoUrl}
        />


        </div>

          {/* Rôle */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Type d'utilisateur
            </label>

            <select
              value={form.userType}
              onChange={(e) => setField("userType", e.target.value)}
              disabled={isEditing || isLoading}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white outline-none focus:border-[#0065CD] disabled:bg-slate-100"
            >
              <option value="etudiant">Étudiant</option>
              <option value="service">Service</option>
              <option value="partenaire">Partenaire</option>
              <option value="responsable">Responsable</option>
            </select>

            {isEditing && (
              <p className="text-xs text-slate-400 mt-1">
                Le rôle ne peut pas être modifié.
              </p>
            )}
          </div>

          {/* Informations générales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <FormField
              id="userName"
              label="Nom complet"
              icon={User}
              value={form.name}
              onChange={(value) => setField("name", value)}
              disabled={isLoading}
            />

            <FormField
              id="userEmail"
              label="Adresse email"
              icon={Mail}
              type="email"
              value={form.email}
              onChange={(value) => setField("email", value)}
              disabled={isLoading}
            />

            {form.userType === "partenaire" && (
              <FormField
                id="fonction"
                label="Fonction"
                icon={Briefcase}
                value={form.fonction}
                onChange={(value) => setField("fonction", value)}
                disabled={isLoading}
                required={false}
              />
            )}

            {form.userType === "service" && (
              <FormField
                id="nomService"
                label="Nom du service"
                icon={Building2}
                value={form.nom_service}
                onChange={(value) => setField("nom_service", value)}
                disabled={isLoading}
                required={false}
              />
            )}

            {form.userType === "etudiant" && (
              <>
                <FormField
                  id="nie"
                  label="NIE"
                  icon={GraduationCap}
                  value={form.nie}
                  onChange={(value) => setField("nie", value)}
                  disabled={isLoading}
                  required={false}
                  placeholder="SE, SI, BE ou BI suivi de 8 chiffres"
                />

                <FormField
                  id="filiere"
                  label="Filière"
                  icon={BookOpen}
                  value={form.filiere}
                  onChange={(value) => setField("filiere", value)}
                  disabled={isLoading}
                  required={false}
                  placeholder="Ex: SIO, BF, CMD, MEGP, MIAGE, IMP, QADD"
                />

                <FormField
                  id="niveau"
                  label="Niveau"
                  icon={GraduationCap}
                  value={form.niveau}
                  onChange={(value) => setField("niveau", value)}
                  disabled={isLoading}
                  required={false}
                  placeholder="Ex: L3, M1..."
                />
              </>
            )}

          </div>

          {/* Mot de passe */}
          <div className="border-t border-slate-100 pt-5">

            <h3 className="font-semibold text-[#063C58] mb-4">
              {isEditing
                ? "Modifier le mot de passe (facultatif)"
                : "Mot de passe"}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <FormField
                id="userPassword"
                label="Mot de passe"
                icon={Lock}
                type="password"
                value={form.password}
                onChange={(value) => setField("password", value)}
                disabled={isLoading}
                required={!isEditing}
                autoComplete="new-password"
              />

              <FormField
                id="userPasswordConfirmation"
                label="Confirmer le mot de passe"
                icon={Lock}
                type="password"
                value={form.password_confirmation}
                onChange={(value) =>
                  setField("password_confirmation", value)
                }
                disabled={isLoading}
                required={!isEditing || Boolean(form.password)}
                autoComplete="new-password"
              />

            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">

            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="px-5 py-3 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50"
            >
              Annuler
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#0065CD] text-white font-semibold hover:bg-[#0055AE] disabled:opacity-60"
            >
              {isLoading ? (
                <Loader fullScreen={false} label="Chargement de la pageform..." />
              ) : isEditing ? (
                <Save size={18} />
              ) : (
                <UserPlus size={18} />
              )}

              {isEditing ? "Enregistrer" : "Ajouter"}
            </button>

          </div>

        </form>
  );
}