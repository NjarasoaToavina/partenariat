export default function CampusLogo({ label }) {
  return (
    <div className="w-8 h-8 rounded-full bg-[#0a2942] text-white text-[9px] font-bold flex items-center justify-center shrink-0 overflow-hidden ring-1 ring-slate-200">
      {label}
    </div>
  );
}