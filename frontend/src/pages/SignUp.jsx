import { useRef, useState } from "react";
import {
  User,
  Mail,
  Briefcase,
  Lock,
  Eye,
  EyeOff,
  Link as LinkIcon,
  UserCircle2,
} from "lucide-react";

import logoEsmia from "../assets/logo.png";

const SignUp = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFile = (file) => {
    if (file && file.type.startsWith("image/")) {
      setPhoto(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Brancher ici l'appel de création de compte
    console.log("Inscription", {
      fullName,
      email,
      role,
      password,
      confirmPassword,
      photo,
    });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#063C58] p-0 md:p-8">
      <div className="w-full h-auto max-w-5xl flex flex-col md:flex-row bg-white md:rounded-2xl md:overflow-hidden md:shadow-xl">

        {/* Panneau gauche / haut */}
        <div className="relative bg-[#03334E] text-white px-8 pt-10 pb-14 md:w-2/5 md:p-14 md:flex md:flex-col md:justify-between rounded-b-3xl md:rounded-none">
          <div>
            <div className="w-30 h-30 mb-6">
                <img src={logoEsmia} alt="Logo ESMIA" className="w-full h-full object-contain" />
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
          <p className="text-slate-500 text-sm mb-8">Créez votre compte.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-semibold text-slate-900 mb-2"
              >
                Nom complet
              </label>
              <div className="flex items-center gap-3 border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-sky-500 focus-within:border-sky-500">
                <User size={18} className="text-slate-400 shrink-0" />
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Entrez votre nom complet"
                  className="w-full bg-transparent outline-none text-slate-800 placeholder:text-slate-400 text-sm"
                  autoComplete="name"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-slate-900 mb-2"
              >
                Adresse email
              </label>
              <div className="flex items-center gap-3 border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-sky-500 focus-within:border-sky-500">
                <Mail size={18} className="text-slate-400 shrink-0" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nom@gmail.com"
                  className="w-full bg-transparent outline-none text-slate-800 placeholder:text-slate-400 text-sm"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="role"
                className="block text-sm font-semibold text-slate-900 mb-2"
              >
                Fonction
              </label>
              <div className="flex items-center gap-3 border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-sky-500 focus-within:border-sky-500">
                <Briefcase size={18} className="text-slate-400 shrink-0" />
                <input
                  id="role"
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="Entrez votre fonction"
                  className="w-full bg-transparent outline-none text-slate-800 placeholder:text-slate-400 text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-slate-900 mb-2"
              >
                Mot de passe
              </label>
              <div className="flex items-center gap-3 border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-sky-500 focus-within:border-sky-500">
                <Lock size={18} className="text-slate-400 shrink-0" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-transparent outline-none text-slate-800 placeholder:text-slate-400 text-sm"
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="text-slate-400 hover:text-slate-600 shrink-0"
                  aria-label={
                    showPassword
                      ? "Masquer le mot de passe"
                      : "Afficher le mot de passe"
                  }
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-semibold text-slate-900 mb-2"
              >
                Confirmez le mot de passe
              </label>
              <div className="flex items-center gap-3 border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-sky-500 focus-within:border-sky-500">
                <Lock size={18} className="text-slate-400 shrink-0" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-transparent outline-none text-slate-800 placeholder:text-slate-400 text-sm"
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="text-slate-400 hover:text-slate-600 shrink-0"
                  aria-label={
                    showConfirmPassword
                      ? "Masquer le mot de passe"
                      : "Afficher le mot de passe"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Photo de profil
              </label>
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`flex items-center gap-4 border-2 border-dashed rounded-xl px-5 py-5 cursor-pointer transition-colors ${
                  isDragging
                    ? "border-sky-500 bg-sky-50"
                    : "border-slate-300 hover:border-slate-400"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png"
                  className="hidden"
                  onChange={(e) => handleFile(e.target.files?.[0])}
                />
                {photo ? (
                  <img
                    src={URL.createObjectURL(photo)}
                    alt="Aperçu du profil"
                    className="w-14 h-14 rounded-full object-cover shrink-0"
                  />
                ) : (
                  <UserCircle2
                    size={44}
                    className="text-slate-300 shrink-0"
                    strokeWidth={1.2}
                  />
                )}
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900">
                    {photo
                      ? photo.name
                      : "Cliquez pour ajouter une photo"}
                  </p>
                  <p className="text-sm text-slate-400">
                    ou glissez-déposez votre image ici
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Formats acceptés : JPG, PNG (max 2 Mo)
                  </p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white font-semibold rounded-xl py-3.5 transition-colors mt-2"
            >
              Créez le compte
            </button>
          </form>

          <p className="text-sm text-slate-500 text-center md:text-left mt-6">
            Vous avez déjà un compte?{" "}
            <a
              href="#"
              className="text-sky-600 font-semibold hover:text-sky-700"
            >
              Se connecter
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUp;