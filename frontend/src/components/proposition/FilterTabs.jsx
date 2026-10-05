export default function FilterTabs({ tabs, active, onChange }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {tabs.map((tab) => {
        const isActive = tab.key === active;
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onChange(tab.key)}
            className={`inline-flex items-center gap-2 pl-4 pr-2 py-2 rounded-xl text-sm font-semibold transition-colors ${
              isActive
                ? "bg-[#0F2942] text-white"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {tab.label}
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                isActive ? "bg-white text-[#0F2942]" : `${tab.dotClass} text-white`
              }`}
            >
              {tab.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}