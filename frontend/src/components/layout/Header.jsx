import { Menu, Bell, UserCircle } from "lucide-react";

export default function Header({
  section = "Visualisation des informations",
  page = "Partenaires",
  userName = "Nom complet",
  userRole = "Responsable",
  onMenuClick = () => {},
}) {
  return (
    <header>
      {/* Version mobile : bandeau sombre avec logo, comme la sidebar */}
      <div className="md:hidden flex items-center justify-between gap-3 bg-[#0a2942] text-white px-4 py-3">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onMenuClick}
            className="text-white shrink-0"
            aria-label="Ouvrir le menu"
          >
            <Menu size={22} />
          </button>

          <div className="w-9 h-9 rounded-full bg-gradient-to-b from-slate-200 to-slate-400 p-[2px] shrink-0">
            <div className="w-full h-full rounded-full bg-[#0a2942] flex items-center justify-center">
              <span className="text-cyan-300 font-extrabold text-[7px]">
                ESMIA
              </span>
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
          <div className="w-9 h-9 rounded-full bg-white/10 text-white flex items-center justify-center">
            <UserCircle size={20} />
          </div>
          <div>
            <p className="text-sm font-bold text-white leading-tight">
              {userName}
            </p>
            <p className="text-xs text-slate-400 leading-tight">
              {userRole}
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
          <div className="w-9 h-9 rounded-full bg-[#0a2942] text-white flex items-center justify-center">
            <UserCircle size={20} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900 leading-tight">
              {userName}
            </p>
            <p className="text-xs text-slate-400 leading-tight">
              {userRole}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}