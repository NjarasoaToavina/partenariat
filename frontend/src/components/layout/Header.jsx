import { Bell, UserCircle } from "lucide-react";

export default function Header({
  section = "Visualisation des informations",
  page = "Partenaires",
  userName = "Nom complet",
  userRole = "Responsable",
}) {
  return (
    <header className="flex items-center justify-between gap-4 bg-white border-b border-slate-100 px-6 md:px-8 py-4">
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
        <div className="hidden sm:block">
          <p className="text-sm font-bold text-slate-900 leading-tight">
            {userName}
          </p>
          <p className="text-xs text-slate-400 leading-tight">{userRole}</p>
        </div>
      </div>
    </header>
  );
}