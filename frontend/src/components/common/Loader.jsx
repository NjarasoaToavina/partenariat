export default function Loader({ fullScreen = true, label = "Chargement..." }) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative w-16 h-16">
        {/* Anneau de fond */}
        <div className="absolute inset-0 rounded-full border-4 border-slate-100" />
        {/* Anneau animé */}
        <div className="absolute inset-0 rounded-full border-4 border-sky-600 border-t-transparent animate-spin" />
        {/* Logo ESMIA au centre */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-9 h-9 rounded-full bg-gradient-to-b from-slate-200 to-slate-400 p-[2px]">
            <div className="w-full h-full rounded-full bg-[#0a2942] flex items-center justify-center">
              <span className="text-cyan-300 font-extrabold text-[6px]">
                ESMIA
              </span>
            </div>
          </div>
        </div>
      </div>

      {label && (
        <p className="text-sm font-medium text-slate-500">{label}</p>
      )}
    </div>
  );

  if (!fullScreen) {
    return <div className="flex items-center justify-center py-16">{content}</div>;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-50">
      {content}
    </div>
  );
}