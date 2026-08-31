import { useState } from "react";
import { LogOut } from "lucide-react";
import { NAV_ITEMS } from "../../data/navItems";

export default function Sidebar() {
  const [active, setActive] = useState("Tableau de bord");

  return (
    <aside className="hidden md:flex md:w-64 shrink-0 bg-[#0a2942] text-white flex-col">
      <div className="flex items-center gap-3 px-6 py-6">
        <div className="w-11 h-11 rounded-full bg-gradient-to-b from-slate-200 to-slate-400 p-[2px] shrink-0">
          <div className="w-full h-full rounded-full bg-[#0a2942] flex items-center justify-center">
            <span className="text-cyan-300 font-extrabold text-[9px]">
              ESMIA
            </span>
          </div>
        </div>
        <div>
          <p className="font-bold leading-tight">ESMIA</p>
          <p className="text-xs text-slate-400 leading-tight">Partenariat</p>
        </div>
      </div>

      <nav className="flex-1 px-3 mt-2 space-y-1">
        {NAV_ITEMS.map(({ label, icon: Icon }) => {
          const isActive = active === label;
          return (
            <button
              key={label}
              onClick={() => setActive(label)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-sky-600 text-white"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon size={18} />
              {label}
            </button>
          );
        })}
      </nav>

      <div className="px-3 pb-6">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white transition-colors">
          <LogOut size={18} />
          Se déconnecter
        </button>
      </div>
    </aside>
  );
}