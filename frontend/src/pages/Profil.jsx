import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Briefcase,
  Building2,
  BookOpen,
  GraduationCap,
  Save,
  ArrowLeft,
} from "lucide-react";

import FormField from "../components/auth/FormField";
import PhotoUpload from "../components/auth/PhotoUpload";
import Spinner from "../components/common/Spinner";

import { roleHasField } from "../data/signuproles";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

import { updateProfile } from "../services/profileService";
import { URL } from "../services/api";

export default function Profil() {
  const navigate = useNavigate();
  const toast = useToast();

  const { user, roles, fetchUser } = useAuth();

  const userType = roles[0] || "";

  // Informations personnelles
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  // Champs spécifiques
  const [fonction, setFonction] = useState("");
  const [nomService, setNomService] = useState("");
  const [nie, setNie] = useState("");
  const [filiere, setFiliere] = useState("");
  const [niveau, setNiveau] = useState("");

  // Mot de passe
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Photo
  const [photo, setPhoto] = useState(null);

  // Chargement
  const [isLoading, setIsLoading] = useState(false);

  // Préremplir le formulaire
  useEffect(() => {
    if (!user) return;

    setFullName(user.name || "");
    setEmail(user.email || "");

    setFonction(user.fonction || "");
    setNomService(user.nom_service || "");

    setNie(user.nie || "");
    setFiliere(user.filiere || "");
    setNiveau(user.niveau || "");

    setPassword("");
    setConfirmPassword("");
    setPhoto(null);
  }, [user]);

  // URL de la photo actuelle
  const cleanBackendUrl = URL.replace(/\/api\/?$/, "");

  const currentPhotoUrl = user?.image
    ? user.image.startsWith("http")
      ? user.image
      : `${cleanBackendUrl}/storage/${user.image}`
    : null;

  // Enregistrement
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas.");
      return;
    }

    if (password && password.length < 8) {
      toast.error("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }

    if (!currentPassword.trim()) {
    toast.error("Veuillez saisir votre mot de passe actuel.");
    return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();

      formData.append("name", fullName);
      formData.append("email", email);

      // Mot de passe actuel obligatoire
      formData.append("current_password", currentPassword);

      // Photo : uniquement si une nouvelle photo est sélectionnée
      if (photo) {
        formData.append("image", photo);
      }

      
      // Mot de passe facultatif
      if (password) {
        formData.append("password", password);
        formData.append("password_confirmation", confirmPassword);
      }

      // Champs spécifiques selon le rôle
      if (roleHasField(userType, "fonction")) {
        formData.append("fonction", fonction);
      }

      if (roleHasField(userType, "nom_service")) {
        formData.append("nom_service", nomService);
      }

      if (roleHasField(userType, "nie")) {
        formData.append("nie", nie);
      }

      if (roleHasField(userType, "filiere")) {
        formData.append("filiere", filiere);
      }

      if (roleHasField(userType, "niveau")) {
        formData.append("niveau", niveau);
      }

      // Envoyer les modifications à Laravel
      await updateProfile(formData);

      // Actualiser l'utilisateur connecté
      await fetchUser();

      setCurrentPassword("");
      setPassword("");
      setConfirmPassword("");
      setPhoto(null);

      toast.success("Profil modifié avec succès !");
    } catch (error) {
      console.error("Erreur modification profil :", error);

      const errors = error.response?.data?.errors;

      if (errors) {
        const firstError = Object.values(errors).flat()[0];
        toast.error(firstError);
      } else {
        toast.error(
          error.response?.data?.message ||
            "Erreur lors de la modification du profil."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-8">

      {/* En-tête */}
      <div className="mb-8">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-[#0065CD] mb-5 transition-colors"
        >
          <ArrowLeft size={18} />
          Retour
        </button>

        <h1 className="text-2xl font-bold text-[#063C58]">
          Mon profil
        </h1>

        <p className="text-sm text-slate-500 mt-2">
          Consultez et modifiez vos informations personnelles.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Photo de profil */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">

          <h2 className="text-lg font-semibold text-[#063C58] mb-5">
            Photo de profil
          </h2>

          <div className="flex flex-col sm:flex-row items-center gap-6">

            {/* Photo actuelle */}
            <div className="w-24 h-24 rounded-full bg-[#063C58] flex items-center justify-center overflow-hidden border-4 border-slate-100 shrink-0">

              {currentPhotoUrl ? (
                <img
                  src={currentPhotoUrl}
                  alt="Photo de profil"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={42} className="text-white" />
              )}

            </div>

            <div className="w-full flex-1">
              <PhotoUpload
                photo={photo}
                onChange={setPhoto}
              />

              <p className="text-xs text-slate-400 mt-2">
                Sélectionnez une nouvelle photo pour remplacer l'actuelle.
              </p>
            </div>

          </div>
        </div>

        {/* Informations personnelles */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">

          <h2 className="text-lg font-semibold text-[#063C58] mb-6">
            Informations personnelles
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <FormField
              disabled={isLoading}
              id="fullName"
              label="Nom complet"
              icon={User}
              value={fullName}
              onChange={setFullName}
              placeholder="Entrez votre nom complet"
              autoComplete="name"
            />

            <FormField
              disabled={isLoading}
              id="email"
              label="Adresse email"
              icon={Mail}
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="nom@gmail.com"
              autoComplete="email"
            />

            {/* Partenaire */}
            {roleHasField(userType, "fonction") && (
              <FormField
                disabled={isLoading}
                id="fonction"
                label="Fonction"
                icon={Briefcase}
                value={fonction}
                onChange={setFonction}
                placeholder="Entrez votre fonction"
              />
            )}

            {/* Service */}
            {roleHasField(userType, "nom_service") && (
              <FormField
                disabled={isLoading}
                id="nomService"
                label="Nom du service"
                icon={Building2}
                value={nomService}
                onChange={setNomService}
                placeholder="Entrez le nom du service"
              />
            )}

            {/* Étudiant */}
            {roleHasField(userType, "nie") && (
              <FormField
                disabled={isLoading}
                id="nie"
                label="NIE"
                icon={BookOpen}
                value={nie}
                onChange={setNie}
                placeholder="SE, SI, BE ou BI suivi de 8 chiffres"
              />
            )}

            {roleHasField(userType, "filiere") && (
              <FormField
                disabled={isLoading}
                id="filiere"
                label="Filière"
                icon={BookOpen}
                value={filiere}
                onChange={setFiliere}
                placeholder="Entrez votre filière"
              />
            )}

            {roleHasField(userType, "niveau") && (
              <FormField
                disabled={isLoading}
                id="niveau"
                label="Niveau"
                icon={GraduationCap}
                value={niveau}
                onChange={setNiveau}
                placeholder="Ex : L3, M1..."
              />
            )}

          </div>
        </div>

        {/* Sécurité du compte */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">

        <h2 className="text-lg font-semibold text-[#063C58] mb-2">
            Sécurité du compte
        </h2>

        <p className="text-sm text-slate-500 mb-6">
            Saisissez votre mot de passe actuel pour confirmer
            les modifications de votre profil.
        </p>

        <div className="space-y-5">

            {/* Mot de passe actuel obligatoire */}
            <FormField
            disabled={isLoading}
            id="currentPassword"
            label="Mot de passe actuel"
            icon={Lock}
            type="password"
            value={currentPassword}
            onChange={setCurrentPassword}
            placeholder="Entrez votre mot de passe actuel"
            autoComplete="current-password"
            />

            <div className="border-t border-slate-200 pt-5">

            <p className="text-sm text-slate-500 mb-5">
                Pour changer votre mot de passe, renseignez
                les champs suivants. Sinon, laissez-les vides.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <FormField
                disabled={isLoading}
                id="password"
                label="Nouveau mot de passe"
                icon={Lock}
                type="password"
                value={password}
                onChange={setPassword}
                placeholder="Nouveau mot de passe"
                autoComplete="new-password"
                required={false}
                />

                <FormField
                disabled={isLoading}
                id="confirmPassword"
                label="Confirmer le nouveau mot de passe"
                icon={Lock}
                type="password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                placeholder="Confirmez le nouveau mot de passe"
                autoComplete="new-password"
                required={false}
                />

            </div>
            </div>

        </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 pb-8">

          <button
            type="button"
            disabled={isLoading}
            onClick={() => navigate(-1)}
            className="px-6 py-3 rounded-xl border border-slate-300 text-slate-600 font-medium hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            Annuler
          </button>

          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#0065CD] text-white font-semibold hover:bg-[#0055AE] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >

            {isLoading ? (
              <>
                <Spinner size={18} className="text-white" />
                Enregistrement...
              </>
            ) : (
              <>
                <Save size={18} />
                Enregistrer les modifications
              </>
            )}

          </button>

        </div>

      </form>
    </div>
  );
}