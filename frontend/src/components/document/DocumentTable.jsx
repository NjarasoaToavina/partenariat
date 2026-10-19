import { FileText as PdfIcon, Eye, Download, MoreVertical, ChevronLeft, ChevronRight, Plus, CheckCircle2, XCircle } from "lucide-react";
import { StatusPill, TypePill } from "./DocumentBadges";
import { initialsOf } from "../../data/documentData";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import RefusModal from "../common/RefusModal";

function Avatar({ name }) {
  return (
    <span className="w-8 h-8 rounded-full bg-[#0F2942] text-white text-[11px] font-bold flex items-center justify-center shrink-0">
      {initialsOf(name)}
    </span>
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

export default function DocumentTable({ documents, onView, onDownload, onStatusChange }) {
  const {hasRoles} = useAuth();
  const isEtudiant = hasRoles('etudiant');
  const [documentRefuse, setDocumentRefuse] = useState(null);
  const [isSubmitting,setIsSubmitting] = useState(false);

  const handleValider = async (doc) => {
    setIsSubmitting(true);
  
    try {
      await onStatusChange(doc.id_doc, {
        statut_doc: "vivier",
        remarque: null,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRefuser = async (remarque) => {
    console.log(documentRefuse.id_doc)
    if (!documentRefuse || !remarque.trim() || isSubmitting) return;
    setIsSubmitting(true);

    try {
      await onStatusChange(documentRefuse.id_doc, {
        statut_doc: "correction",
        remarque: remarque.trim(),
      });

      setDocumentRefuse(null);
      setRemarque("");
    } catch (error) {
      console.error(error);
   
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <>    
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
                <td className="px-4 py-3.5 text-sm text-slate-600 whitespace-nowrap">{formaterDate(doc.date_envoi)}</td>
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
                      {hasRoles("responsable") &&
                      ["collecte", "validation"].includes(doc.statut_doc?.toLowerCase()) && (
                        <>
                          {/* Valider */}
                          <button
                            onClick={() => handleValider(doc)}
                            disabled={isSubmitting}
                            title="Valider le document"
                            className="w-8 h-8 inline-flex items-center justify-center rounded-lg text-green-600 hover:bg-green-50 transition-colors disabled:opacity-50"
                          >
                            <CheckCircle2 size={18} />
                          </button>

                          {/* Refuser */}
                          <button
                            onClick={() => {
                              setDocumentRefuse(doc);
                              setRemarque("");
                 
                            }}
                            disabled={isSubmitting}
                            title="Refuser le document"
                            className="w-8 h-8 inline-flex items-center justify-center rounded-lg text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                          >
                            <XCircle size={18} />
                          </button>
                        </>
                      )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <RefusModal
        open={!!documentRefuse}
        isLoading={isSubmitting}
        onConfirm={handleRefuser}
        onCancel={() => setDocumentRefuse(null)}
      />
    </>
  );
}

