import { useState } from "react";
import { useNavigate } from "react-router-dom"
import { Mail, Lock, Eye, EyeOff, Link as LinkIcon } from "lucide-react";
import logoEsmia from "../assets/logo.png";
import {login} from "../services/authService"; 
import Spinner from "../components/common/Spinner";
import { Link } from "react-router-dom";


export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Pour gérer l'état de chargement

  const handleSubmit = async (e) => { // 1. Ajoutez 'async' ici
  e.preventDefault();
  setIsLoading(true); // Active le spinner

  try {
    // 2. Appelez votre service de connexion (assurez-vous de l'importer en haut du fichier)
    // Nous passons un objet avec l'email et le mot de passe
    const response = await login({ email, password }); 
    
    console.log("Connexion réussie :", response.data);

    // 3. Récupérez le jeton (token) renvoyé par Laravel
    const token = response.data.token; 

    if (token) {
      // 4. Stockez le token dans le localStorage pour maintenir la session
      localStorage.setItem("ACCESS_TOKEN", token);
      
      // Optionnel : Vous pouvez aussi stocker les infos de l'utilisateur si besoin
      // localStorage.setItem("USER", JSON.stringify(response.data.user));

      // 5. Redirigez enfin l'utilisateur vers son tableau de bord
      navigate("/dashboard");
    } else {
      alert("Erreur : Aucun jeton d'authentification reçu.");
      setIsLoading(false); // Désactive le spinner
    }

    } catch (error) {
      setIsLoading(false); // Désactive le spinner en cas d'erreur
      console.error("Erreur de connexion :", error);
      
      // Récupération du message d'erreur envoyé par Laravel (ex: "Identifiants incorrects")
      const errorMessage = error.response?.data?.message || "Une erreur est survenue lors de la connexion.";
      alert(errorMessage);
    }
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
                  disabled={isLoading}
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
                  disabled={isLoading} 
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
                  disabled={isLoading}
                  className="text-slate-400 hover:text-slate-600 shrink-0 disabled:opacity-50"
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
              disabled={isLoading}
              className="w-full bg-sky-600 hover:bg-sky-700 active:bg-sky-800 disabled:bg-sky-400 disabled:cursor-not-allowed text-white font-semibold rounded-xl py-3.5 transition-colors mt-2 flex items-center justify-center gap-2"
            >
              {isLoading && <Spinner size={18} className="text-white" />}
              {isLoading ? "Connexion en cours..." : "Se connecter"}
            </button>
          </form>

          <p className="text-sm text-slate-500 text-center md:text-left mt-6">
            Pas encore de compte?{" "}
            <Link
              to="/signup"
              className="text-sky-600 font-semibold hover:text-sky-700"
            >
              Contactez l'équipe ESMIA
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}