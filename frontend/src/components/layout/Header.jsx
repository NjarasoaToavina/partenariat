import { Menu, Bell, UserCircle } from "lucide-react";
import LogoEsmia from "../../assets/logo.png";
import {getCurrentUser} from "../../services/authService";
import {useState,useEffect} from "react";
import { URL } from "../../services/api";

export default function Header({
  section = "Visualisation des informations",
  page = "Partenaires",
  userName = "Nom complet",
  userRole = "Responsable",
  onMenuClick = () => {},
}) {
  const [user,setUser] = useState(null);
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // L'intercepteur Axios ajoute automatiquement le token Bearer en tâche de fond
        const response = await getCurrentUser();
        setUser(response.data); // Stocke l'objet user de Laravel dans l'état React
      } catch (error) {
        console.error("Impossible de récupérer l'utilisateur", error);
      }
    };

    fetchUserData();
  }, []);
  
  const displayRole = user?.roles?.[0]?.name || userRole;

  // 1. GESTION DE L'URL DE LA PHOTO
  // Si le champ 'image' existe, on s'assure qu'il pointe vers le serveur de stockage Laravel
  const cleanBackendUrl = URL.replace(/\/api$/, "");  // À adapter selon votre config
  const photoUrl = user?.image 
    ? (user.image.startsWith('http') ? user.image : `${cleanBackendUrl}/storage/${user.image}`)
    : null;
  return (
    <header>
      {/* Version mobile : bandeau sombre avec logo, comme la sidebar */}
      <div className="md:hidden flex items-center justify-between gap-3 bg-[#03334E] text-white px-4 py-3">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onMenuClick}
            className="text-white shrink-0"
            aria-label="Ouvrir le menu"
          >
            <Menu size={22} />
          </button>

          <div className="w-12 h-12 rounded-full bg-gradient-to-b p-[2px] shrink-0">
            <div className="w-full h-full rounded-full bg-[#03334E] flex items-center justify-center">
              {/* <span className="text-cyan-300 font-extrabold text-[7px]">
                ESMIA
              </span> */}
              <img
                  src={LogoEsmia}
                  alt="Logo ESMIA"/>
            </div>
          </div>

          <div className="min-w-0">
            <p className="font-bold text-sm leading-tight truncate">ESMIA</p>
            <p className="text-xs text-slate-400 leading-tight truncate">
              Partenariat
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <button className="text-white/90 hover:text-white">
            <Bell size={20} />
          </button>
             {/* 2. AFFICHAGE DE LA PHOTO (MOBILE) */}
          <div className="w-9 h-9 rounded-full bg-white/10 text-white flex items-center justify-center overflow-hidden border border-white/20">
            {photoUrl ? (
              <img src={photoUrl} alt="Profil" className="w-full h-full object-cover" />
            ) : (
              <UserCircle size={20} />
            )}
          </div>
          <div>
            <p className="text-sm font-bold text-white leading-tight">
              {user?.name || userName}
            </p>
            <p className="text-xs text-slate-400 leading-tight">
              {displayRole || userRole}
            </p>
          </div>
        </div>
      </div>

      {/* Version desktop : bandeau blanc avec fil d'Ariane et utilisateur */}
      <div className="hidden md:flex items-center justify-between gap-4 bg-white border-b border-slate-100 px-8 py-4">
        <div>
          <p className="text-xs text-slate-400">{section}</p>
          <p className="text-sm font-bold text-slate-900">{page}</p>
        </div>

        <div className="flex items-center gap-4">
          <button className="text-slate-500 hover:text-slate-700">
            <Bell size={20} />
          </button>
          
          {/* 3. AFFICHAGE DE LA PHOTO (DESKTOP) */}
          <div className="w-9 h-9 rounded-full bg-[#03334E] text-white flex items-center justify-center overflow-hidden border border-slate-200">
            {photoUrl ? (
              <img src={photoUrl} alt="Profil" className="w-full h-full object-cover" />
            ) : (
              <UserCircle size={20} />
            )}
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900 leading-tight">
              {user?.name || userName}
            </p>
            <p className="text-xs text-slate-400 leading-tight">
              {displayRole || userRole}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}