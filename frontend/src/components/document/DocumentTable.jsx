import { FileText as PdfIcon, Eye, Download, MoreVertical, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { StatusPill, TypePill } from "./DocumentBadges";
import { initialsOf } from "../../data/documentData";
import { useAuth } from "../../context/AuthContext";

function Avatar({ name }) {
  return (
    <span className="w-8 h-8 rounded-full bg-[#0F2942] text-white text-[11px] font-bold flex items-center justify-center shrink-0">
      {initialsOf(name)}
    </span>
  );
}

function Pagination({ page, totalPages, totalItems, pageSize, onPageChange }) {
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalItems);
  const pages = [1, 2, 3, "...", totalPages].filter(
    (p, i, arr) => arr.indexOf(p) === i
  );

  return (
    <div className="flex items-center justify-between px-5 py-4 border-t border-slate-100">
      <p className="text-xs text-slate-400">
        Affichage de {start} à {end} sur {totalItems} documents
      </p>
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          className="w-8 h-8 inline-flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={15} />
        </button>
        {pages.map((p, i) =>
          p === "..." ? (
            <span key={`dots-${i}`} className="w-8 h-8 inline-flex items-center justify-center text-slate-400 text-sm">…</span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`w-8 h-8 inline-flex items-center justify-center rounded-lg text-sm font-semibold transition-colors ${
                p === page ? "bg-[#0F2942] text-white" : "border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {p}
            </button>
          )
        )}
        <button
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="w-8 h-8 inline-flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}

function formaterDate(dateISO) {
    if (!dateISO) return "Date inconnue";
    try {
        const date = new Date(dateISO);
        // Vérifie si la date est valide
        if (isNaN(date.getTime())) return "Format invalide";
        
        // Configuration explicite pour éviter les conflits d'options de style
        return new Intl.DateTimeFormat('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date).replace('à', 'à '); // Aligne proprement l'espace
    } catch (error) {
        return "Erreur date";
    }
}

export default function DocumentTable({ documents, page, totalPages, totalItems, pageSize, onPageChange, onImport, onView, onDownload, onMore }) {
  const {hasRoles} = useAuth();
  const isEtudiant = hasRoles('etudiant');
  return (
      <div className="overflow-x-auto">
        <table className={`w-full border-separate border-spacing-0 ${isEtudiant ? 'min-w-[600px]' : 'min-w-[1100px]'}`}>
          <thead>
            <tr className="bg-[#0065CD] text-white text-xs ">
              <th className="text-left font-semibold px-4 py-3 whitespace-nowrap rounded-l-xl">ID</th>
            {!isEtudiant && (
            <>
              <th className="text-left font-semibold px-4 py-3 whitespace-nowrap">Etudiant</th>
              <th className="text-left font-semibold px-4 py-3 whitespace-nowrap">NIE</th>
              <th className="text-left font-semibold px-4 py-3 whitespace-nowrap">Classe/Filière</th>
              <th className="text-left font-semibold px-4 py-3 whitespace-nowrap">Niveau</th>
            </>
          )}
              <th className="text-left font-semibold px-4 py-3 whitespace-nowrap">Type de document</th>
              <th className="text-left font-semibold px-4 py-3 whitespace-nowrap">Date d'envoi</th>
              <th className="text-left font-semibold px-4 py-3 whitespace-nowrap">Statut</th>
              <th className="text-center font-semibold px-4 py-3 whitespace-nowrap rounded-r-xl">Actions</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
              <tr key={doc.id} className="border-b border-slate-100 last:border-b-0 hover:bg-[#F7FAFC] transition-colors">
                <td className="px-4 py-3.5 text-sm font-medium text-slate-500 whitespace-nowrap">{doc.id_doc}</td>
                
                {!isEtudiant && (
                  <>
                    <td className="px-4 py-3.5">
                      <span className="flex items-center gap-2.5 whitespace-nowrap">
                        <Avatar name={doc.user.name} />
                        <span className="text-sm font-semibold text-slate-900">{doc.user.name}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-[#0F2942] font-medium whitespace-nowrap">{doc.user.matricule}</td>
                    <td className="px-4 py-3.5 text-sm text-slate-600 whitespace-nowrap">{doc.user.filiere}</td>
                    <td className="px-4 py-3.5 text-sm text-slate-600 whitespace-nowrap">{doc.user.niveau}</td>
                  </>
                )}
                
                <td className="px-4 py-3.5"><TypePill type={doc.type_doc}/></td>
                <td className="px-4 py-3.5 text-sm text-slate-600 whitespace-nowrap">{formaterDate(doc.created_at)}</td>
                <td className="px-4 py-3.5"><StatusPill status={doc.statut_doc} /></td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center justify-center gap-1.5">
                    <button onClick={() => onView?.(doc)} aria-label={`Voir ${doc.fileName}`}
                      className="w-8 h-8 inline-flex items-center justify-center rounded-lg text-slate-500 hover:text-[#0F2942] hover:bg-slate-100 transition-colors">
                      <Eye size={15} />
                    </button>
                    <button onClick={() => onDownload?.(doc)} aria-label={`Télécharger ${doc.fileName}`}
                      className="w-8 h-8 inline-flex items-center justify-center rounded-lg text-slate-500 hover:text-[#0F2942] hover:bg-slate-100 transition-colors">
                      <Download size={15} />
                    </button>
                    <button onClick={() => onMore?.(doc)} aria-label={`Plus d'actions pour ${doc.fileName}`}
                      className="w-8 h-8 inline-flex items-center justify-center rounded-lg text-slate-500 hover:text-[#0F2942] hover:bg-slate-100 transition-colors">
                      <MoreVertical size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
  );
}

