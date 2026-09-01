import { NavLink, useNavigate } from "react-router-dom";
import { LogOut, X } from "lucide-react";
import { NAV_ITEMS } from "../../data/navItems";
import LogoEsmia from "../../assets/logo.png";

export default function Sidebar({ open = false, onClose = () => {} }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Brancher ici la logique de déconnexion (clear token, etc.)
    onClose();
    navigate("/login");
  };

  return (
    <>
      {/* Fond sombre derrière le tiroir, mobile uniquement */}
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
        />
      )}

      <aside
        className={`fixed z-50 inset-y-0 left-0 w-64 bg-[#03334E] text-white flex flex-col transition-transform duration-300 md:static md:z-auto md:translate-x-0 md:flex md:shrink-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center gap-3 px-6 py-6">
          <div className="w-18 h-18 bg-gradient-to-b p-[2px] shrink-0">
            {/* <div className="w-full h-full rounded-full bg-[#03334E] flex items-center justify-center">
              <span className="text-cyan-300 font-extrabold text-[9px]">
                ESMIA
              </span>
            </div> */}
            <img
              src={LogoEsmia}
              alt="Logo ESMIA"/>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold leading-tight">ESMIA</p>
            <p className="text-xs text-slate-400 leading-tight">
              Partenariat
            </p>
          </div>
          <button
            onClick={onClose}
            className="md:hidden text-slate-300 hover:text-white"
            aria-label="Fermer le menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-3 mt-2 space-y-1">
          {NAV_ITEMS.map(({ label, icon: Icon, path }) => (
            <NavLink
              key={path}
              to={path}
              onClick={onClose}
              className={({ isActive }) =>
                `w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[#0065CD] text-white"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 pb-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
          >
            <LogOut size={18} />
            Se déconnecter
          </button>
        </div>
      </aside>
    </>
  );
}