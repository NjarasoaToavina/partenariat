export default function Pagination({
  total,
  shown,
  currentPage,
  totalPages,
  onPrevious,
  onNext,
}) {
  return (
    <div className="flex items-center justify-between px-4 py-4 border-t border-slate-100">
      <p className="text-sm text-slate-500">
        Affichage de {shown} sur {total} partenariats
      </p>

      <div className="flex items-center gap-2">
        <button
          onClick={onPrevious}
          disabled={currentPage <= 1}
          className="px-3 py-1.5 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
        >
          Précédent
        </button>
        <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-sky-600 text-white text-sm font-semibold">
          {currentPage}
        </span>
        <button
          onClick={onNext}
          disabled={currentPage >= totalPages}
          className="px-3 py-1.5 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
        >
          Suivant
        </button>
      </div>
    </div>
  );
}