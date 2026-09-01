import { useState } from "react";
import { useNavigate } from "react-router-dom"
import { Mail, Lock, Eye, EyeOff, Link as LinkIcon } from "lucide-react";
import logoEsmia from "../assets/logo.png";


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Brancher ici l'appel d'authentification
    console.log("Connexion avec", { email, password });
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#063C58] p-0 md:p-8">
      <div className="w-full max-w-5xl md:min-h-[600px] flex flex-col md:flex-row md:rounded-2xl md:overflow-hidden md:shadow-xl">
        {/* Panneau gauche / haut */}
        <div className="relative bg-[#03334E] text-white px-8 pt-10 pb-14 md:w-1/2 md:p-14 md:flex md:flex-col md:justify-between rounded-b-3xl md:rounded-none">
          <div>
            <div className="w-30 h-30 mb-6">
              <img src={logoEsmia} alt="Logo ESMIA" className="w-full h-full object-contain" />
            </div>

            <p className="text-xs font-semibold tracking-wide text-slate-300 mb-3">
              ESPACE PARTENAIRE
            </p>

            <h1 className="text-2xl md:text-3xl font-bold leading-snug mb-4 max-w-xs">
              Bienvenue sur la plateforme de partenariat
            </h1>

            <p className="text-slate-300 text-sm leading-relaxed max-w-xs">
              Retrouvez vos échanges, documents, opportunités de
              collaboration avec l'ESMIA Innovation en un seul endroit.
            </p>
          </div>

          <a
            href="https://www.esmia-i.com/home"
            className="hidden md:inline-flex items-center gap-2 text-slate-300 hover:text-white text-sm mt-10 transition-colors"
          >
            <LinkIcon size={16} />
            ESMIA Innovation
          </a>
        </div>

        {/* Panneau droit / bas */}
        <div className="relative -mt-6 md:mt-0 bg-white rounded-t-3xl md:rounded-none px-6 pt-8 pb-10 md:w-1/2 md:p-14 md:flex md:flex-col md:justify-center">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
            Connexion
          </h2>
          <p className="text-slate-500 text-sm mb-8">
            Entrez vos identifiants pour accéder à votre compte.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
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
                  autoComplete="current-password"
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

            <button
              type="submit"
              className="w-full bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white font-semibold rounded-xl py-3.5 transition-colors mt-2"
            >
              Se connecter
            </button>
          </form>

          <p className="text-sm text-slate-500 text-center md:text-left mt-6">
            Pas encore de compte?{" "}
            <a
              href="#"
              className="text-sky-600 font-semibold hover:text-sky-700"
            >
              Contactez l'équipe ESMIA
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}