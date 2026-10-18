import { useEffect, useMemo, useState } from "react";
import { DOCUMENTS, computeDocKpis } from "../data/documentData";
import DocumentFilters from "../components/document/DocumentFilters";
import DocumentTable from "../components/document/DocumentTable";
import StatCard from "../components/atelier/StatCard";
import { CheckCircle2, Clock, ClipboardList, Plus, ClipboardCheck   } from "lucide-react";
import DocumentToolbar from "../components/document/DocumentToolbar";
import { useToast } from "../context/ToastContext";
import Pagination from "../components/common/Pagination";
import { getAllDocuments, downloadDocument, getDocumentById } from "../services/documentService";
import Loader from "../components/common/Loader";
import { useAuth } from "../context/AuthContext";
import {URL} from "../services/api";

const PAGE_SIZE = 6;

const EMPTY_FILTERS = { search: "", type:"", niveau: "Tous", statut: "Tous", filiere: "", period: "" };

const collecte = 7;
const correction = 10;
const vivier = 5;

const stats = {
  collecte,
  correction,
  vivier,
  total: collecte + correction + vivier
};

export default function Document() {
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [page, setPage] = useState(1);
  const [documents,setDocuments] = useState([]);
  const [isLoading,setIsLoading] = useState(false);
  const [selectedDoc,setSelectedDoc]  = useState({})
  const toast = useToast();
  const { hasPermission } = useAuth();

  useEffect(()=>{
    setIsLoading(true);
    const fetchDocuments = async () => {
        try {
          const response = await getAllDocuments();
          console.log("Données des documents récupérées :", response.data);
          setIsLoading(false);
          setDocuments(response.data);
        } catch (error) {
          setIsLoading(false);
          toast.error("Impossible de charger la liste des documents.");
        } finally {
          setIsLoading(false);
        }
    };

    fetchDocuments();
  },[toast]);

  const setFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };
  const resetFilters = () => { setFilters(EMPTY_FILTERS); setPage(1); };

  console.log("mes documents",documents);
  const filtered = useMemo(() => {
    return documents.filter((d) => {
      if (filters.search && !d.user.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
      if (filters.type && d.type_doc !== filters.type) return false;
      if (filters.niveau && filters.niveau!=="Tous" && d.user.niveau !== filters.niveau) return false;
      if (filters.statut && filters.statut!=="Tous" && d.statut_doc !== filters.statut) return false;
      if (filters.filiere && d.user.filiere !== filters.filiere) return false;
      return true;
    });
  }, [documents,filters]);

  const { total, counts, percent } = computeDocKpis(documents); // KPIs sur l'ensemble, pas juste la page filtrée

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  console.log("total pages "+ totalPages)
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleAddDocument = () => {
    toast.success("Document ajouté avec succès");
  }

  // Fonction de calcul des statistiques par statut
  const dynamicStats = useMemo(() => {
    // Initialisation de l'objet avec des valeurs par défaut à 0
    const counts = {
      collecte: 0,
      correction: 0,
      validation: 0,
      vivier: 0,
      total: 0
    };

    // On parcourt tous les documents récupérés de l'API
    documents.forEach((doc) => {
      if (doc.statut_doc === "collecte") counts.collecte++;
      if (doc.statut_doc === "correction") counts.correction++;
      if (doc.statut_doc === "validation") counts.validation++;
      if (doc.statut_doc === "vivier") counts.vivier++;
    });

    // Calcul du total global
    counts.total = counts.collecte + counts.correction + counts.validation + counts.vivier;

    return counts;
  }, [documents]); // Se re-calcule uniquement quand la liste des documents change

  const handleOnDownload = async (doc) => {
      try {
          // 1. Appele le service (qui renvoie maintenant le Blob dans response.data)
          const response = await downloadDocument(doc.id_doc);
          
          // 2. Crée un URL temporaire pour le fichier reçu
          const blob = new Blob([response.data], { type: response.headers['content-type'] });
          const url = window.URL.createObjectURL(blob);
          
          // 3. Crée et simule le clic sur un lien de téléchargement
          const link = document.createElement('a');
          link.href = url;
          
          // Donne un nom par défaut au fichier téléchargé (ex: document_42.jpg)
          link.setAttribute('download', `document_${doc.id_doc}.jpg`); 
          
          document.body.appendChild(link);
          link.click();
          
          // 4. Nettoie la mémoire et le DOM
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);

          // 5. Message de succès
          toast.success(`Document n°${doc.id_doc} a été téléchargé`);
      } catch (error) {
          console.error("Erreur lors du téléchargement :", error);
          toast.error("Impossible de télécharger le document.");
      } 
  }

  const handleOnView = async (doc) => {
      try {
        // 2. Nettoyer l'URL du backend en enlevant le "/api" à la fin
        const cleanBackendUrl = URL.replace(/\/api$/, "");
        
        // 3. Reconstruire le chemin d'accès au stockage public
        const photo_dossier = doc.fichier_doc 
            ? (doc.fichier_doc.startsWith('http') ? doc.fichier_doc : `${cleanBackendUrl}/storage/${doc.fichier_doc}`)
            : null;

        if (photo_dossier) {
            // 4. Ouvrir l'image directement dans un nouvel onglet
            window.open(photo_dossier, '_blank');
        } else {
            toast.error("Aucun fichier associé à ce document.");
        }
          
    } catch (error) {
        console.error("Erreur lors de la visualisation :", error);
        toast.error("Impossible d'afficher le document.");
    } 
  };



  return (
    <div className="space-y-4">

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
      <StatCard
        icon={CheckCircle2}
        iconBg="bg-emerald-50"
        iconColor="text-emerald-600"
        value={dynamicStats.collecte}
        label="Collectés"
      />

      <StatCard
        icon={Clock}
        iconBg="bg-sky-50"
        iconColor="text-sky-600"
        value={dynamicStats.vivier}
        label="En vivier"
      />

      <StatCard
        icon={Clock}
        iconBg="bg-orange-50"
        iconColor="text-orange-600"
        value={dynamicStats.correction}
        label="En correction"
      />

      {/* Nouvelle carte : En validation */}
      <StatCard
        icon={ClipboardCheck}
        iconBg="bg-amber-50"
        iconColor="text-amber-600"
        value={dynamicStats.validation}
        label="En validation"
      />

      <StatCard
        icon={ClipboardList}
        iconBg="bg-violet-50"
        iconColor="text-violet-600"
        value={dynamicStats.total}
        label="Total"
      />
    </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-sm font-bold text-slate-900">Liste des documents</h2>
            {hasPermission('documents.create') && (
              <button
                onClick={handleAddDocument}
                className="flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap"
              >
                <Plus size={18} />
                Importer un document
              </button>
            )}

          </div>

        {/* <DocumentFilters filters={filters} onChange={setFilter} onReset={resetFilters} /> */}
        <DocumentToolbar
          period= {filters.period}
          onPeriodChange={setFilter}
          filiereFilter={filters.filiere}
          onFiliereFilterChange={setFilter}
          niveauFilter={filters.niveau}
          onNiveauFilterChange={setFilter}
          statutFilter={filters.statut}
          onStatutFilterChange={setFilter}
          search={filters.search}
          onSearchChange={setFilter}
          />

      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
        {isLoading ? (
            <Loader fullScreen={false} label="Chargement des documents..." />
        ) : (
          <>
            <DocumentTable
              documents={pageItems}
              page={page}
              totalPages={totalPages}
              totalItems={filtered.length}
              pageSize={PAGE_SIZE}
              onPageChange={setPage}
              onImport={() => {/* à brancher sur ton flux d'import */}}
              onView={(doc) => {handleOnView(doc)}}
              onDownload={(doc) => {handleOnDownload(doc)}}
              onMore={(doc) => {/* à brancher, ex. menu contextuel */}}
            />
            <Pagination
              total={filtered.length}
              rangeStart={filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}
              rangeEnd={Math.min(page * PAGE_SIZE, filtered.length)}
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
              label = "documents"
            />
          </>
        )}
      </div>

    </div>
  );
}