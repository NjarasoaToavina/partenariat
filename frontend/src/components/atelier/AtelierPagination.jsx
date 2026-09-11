import { ChevronLeft, ChevronRight } from "lucide-react";

export default function AtelierPagination({
  total,
  rangeStart,
  rangeEnd,
  currentPage,
  totalPages,
  onPageChange,
}) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-between px-4 py-4 border-t border-slate-100">
      <p className="text-sm text-slate-500">
        Affichage de {rangeStart} à {rangeEnd} sur {total} ateliers
      </p>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage <= 1}
          className="w-8 h-8 flex items-center justify-center border border-slate-200 rounded-lg text-slate-500 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
          aria-label="Page précédente"
        >
          <ChevronLeft size={16} />
        </button>

        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-semibold transition-colors ${
              p === currentPage
                ? "bg-sky-600 text-white"
                : "border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {p}
          </button>
        ))}

        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage >= totalPages}
          className="w-8 h-8 flex items-center justify-center border border-slate-200 rounded-lg text-slate-500 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
          aria-label="Page suivante"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}