import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Briefcase,
  Building2,
  BookOpen,
  GraduationCap,
  Link as LinkIcon,
} from "lucide-react";

import logoEsmia from "../assets/logo.png";
import { ROLES, roleHasField, resolveRole } from "../data/signuproles";
import FormField from "../components/auth/FormField";
import PhotoUpload from "../components/auth/PhotoUpload";

export default function SignUp() {
  const navigate = useNavigate();
  const { role: roleFromUrl } = useParams();

  // Le rôle vient de l'URL (/signup -> etudiant par défaut,
  // /signup/responsable, /signup/service... pour les liens spéciaux).
  // Un rôle inconnu ou absent retombe automatiquement sur "etudiant".
  const userType = resolveRole(roleFromUrl);
  const roleLabel = ROLES.find((r) => r.key === userType)?.label ?? "";

  // Champs communs à tous les rôles
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Champs propres à certains rôles
  const [fonction, setFonction] = useState("");
  const [nomService, setNomService] = useState("");
  const [filiere, setFiliere] = useState("");
  const [niveau, setNiveau] = useState("");
  const [photo, setPhoto] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { 
      userType, 
      fullName, 
      email, 
      password, 
      photo };
    if (roleHasField(userType, "fonction")) payload.fonction = fonction;
    if (roleHasField(userType, "nom_service")) payload.nom_service = nomService;
    if (roleHasField(userType, "filiere")) payload.filiere = filiere;
    if (roleHasField(userType, "niveau")) payload.niveau = niveau;

    // Brancher ici l'appel de création de compte
    console.log("Inscription", payload);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#063C58] p-0 md:p-8">
      <div className="w-full h-auto max-w-5xl flex flex-col md:flex-row bg-white md:rounded-2xl md:overflow-hidden md:shadow-xl">
        {/* Panneau gauche / haut */}
        <div className="relative bg-[#03334E] text-white px-8 pt-10 pb-14 md:w-2/5 md:p-14 md:flex md:flex-col md:justify-between rounded-b-3xl md:rounded-none">
          <div>
            <div className="w-28 h-28 mb-6">
              <img
                src={logoEsmia}
                alt="Logo ESMIA"
                className="w-full h-full object-contain"
              />
            </div>

            <p className="text-xs font-semibold tracking-wide text-slate-300 mb-3">
              ESPACE PARTENAIRE
            </p>

            <h1 className="text-2xl md:text-3xl font-bold leading-snug mb-4 max-w-xs">
              Rejoignez la plateforme de partenariat
            </h1>

            <p className="text-slate-300 text-sm leading-relaxed max-w-xs">
              Créez votre compte pour accéder aux échanges, documents,
              opportunités de collaboration avec l'ESMIA Innovation en un
              seul endroit.
            </p>
          </div>

          <a
            href="#"
            className="hidden md:inline-flex items-center gap-2 text-slate-300 hover:text-white text-sm mt-10 transition-colors"
          >
            <LinkIcon size={16} />
            ESMIA Innovation
          </a>
        </div>

        {/* Panneau droit / bas */}
        <div className="relative -mt-6 md:mt-0 bg-white rounded-t-3xl md:rounded-none px-6 pt-8 pb-10 md:w-3/5 md:p-14">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
            Inscription
          </h2>
          <p className="text-slate-500 text-sm mb-1">Créez votre compte.</p>
          <p className="text-xs font-semibold text-sky-600 mb-8">
            Compte {roleLabel}
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <FormField
              id="fullName"
              label="Nom complet"
              icon={User}
              value={fullName}
              onChange={setFullName}
              placeholder="Entrez votre nom complet"
              autoComplete="name"
            />

            <FormField
              id="email"
              label="Adresse email"
              icon={Mail}
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="nom@gmail.com"
              autoComplete="email"
            />

            <PhotoUpload photo={photo} onChange={setPhoto} />

            {/* Uniquement pour Partenaire */}
            {roleHasField(userType, "fonction") && (
              <FormField
                id="fonction"
                label="Fonction"
                icon={Briefcase}
                value={fonction}
                onChange={setFonction}
                placeholder="Entrez votre fonction"
              />
            )}

            {/* Uniquement pour Service */}
            {roleHasField(userType, "nom_service") && (
              <FormField
                id="nomService"
                label="Nom du service"
                icon={Building2}
                value={nomService}
                onChange={setNomService}
                placeholder="Entrez le nom du service"
              />
            )}

            <FormField
              id="password"
              label="Mot de passe"
              icon={Lock}
              type="password"
              value={password}
              onChange={setPassword}
              placeholder="••••••••"
              autoComplete="new-password"
            />

            <FormField
              id="confirmPassword"
              label="Confirmez le mot de passe"
              icon={Lock}
              type="password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              placeholder="••••••••"
              autoComplete="new-password"
            />

            {/* Uniquement pour Étudiant */}
            {roleHasField(userType, "filiere") && (
              <FormField
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
                id="niveau"
                label="Niveau"
                icon={GraduationCap}
                value={niveau}
                onChange={setNiveau}
                placeholder="Ex: Licence 3, Master 1..."
              />
            )}

            <button
              type="submit"
              className="w-full bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white font-semibold rounded-xl py-3.5 transition-colors mt-2"
            >
              Créez le compte
            </button>
          </form>

          <p className="text-sm text-slate-500 text-center md:text-left mt-6">
            Vous avez déjà un compte?{" "}
            <Link to="/login" className="text-sky-600 font-semibold hover:text-sky-700">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}