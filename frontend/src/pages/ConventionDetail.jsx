import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Pencil, Trash2, FileSignature, Image as ImageIcon } from "lucide-react";
import { useToast } from "../context/ToastContext";
import { getConvention, deleteConvention } from "../services/conventionService";
import Loader from "../components/common/Loader.jsx";
import TitleForm from "../components/common/TitleForm";
import ConfirmModal from "../components/common/Confirmmodal.jsx";
import {URL} from "../services/api";

function formatDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
}

function Section({ title, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
      <h3 className="text-sm font-bold text-slate-900 mb-4">{title}</h3>
      {children}
    </div>
  );
}

function Field({ label, value, multiline = false }) {
  return (
    <div>
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">
        {label}
      </p>
      <p
        className={`text-sm text-slate-700 ${
          multiline ? "leading-relaxed whitespace-pre-line" : "font-medium"
        }`}
      >
        {value || "Non renseigné"}
      </p>
    </div>
  );
}

export default function ConventionDetail() {
  const { id, convId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [conv, setConv] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchConvention = async () => {
      try {
        const response = await getConvention(convId);
        setConv(response.data);
      } catch (error) {
        toast.error("Impossible de charger cette convention.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchConvention();
  }, [convId, toast]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteConvention(convId);
      toast.success("Convention supprimée.");
      navigate(`/partenaires/${id}/conventions`);
    } catch (error) {
      toast.error("Impossible de supprimer cette convention.");
    } finally {
      setIsDeleting(false);
      setConfirmOpen(false);
    }
  };

  if (isLoading) {
    return <Loader fullScreen={false} label="Chargement de la convention..." />;
  }

  if (!conv) {
    return (
      <div className="space-y-4">
        <TitleForm title="Convention introuvable" onBack={() => navigate(`/partenaires/${id}/conventions`)} />
      </div>
    );
  }

//   Pour les photos

    const cleanBackendUrl = URL.replace(/\/api$/, "");  // À adapter selon votre config
    const photo_conv = conv?.photo_conv 
    ? (conv.photo_conv.startsWith('http') ? conv.photo_conv : `${cleanBackendUrl}/storage/${conv.photo_conv}`)
    : null;

    const scan = conv?.scan 
    ? (conv.scan.startsWith('http') ? conv.scan : `${cleanBackendUrl}/storage/${conv.scan}`)
    : null;

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <TitleForm
          title={conv.num_conv || "Convention"}
          description="Détails complets de la convention."
          onBack={() => navigate(`/partenaires/${id}/conventions`)}
        />

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/partenaires/${id}/conventions/${convId}/modifier`)}
            className="flex items-center gap-2 border border-slate-200 bg-white text-slate-700 font-semibold text-sm px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <Pencil size={16} />
            Modifier
          </button>
          <button
            onClick={() => setConfirmOpen(true)}
            className="flex items-center gap-2 border border-rose-200 bg-rose-50 text-rose-600 font-semibold text-sm px-4 py-2.5 rounded-xl hover:bg-rose-100 transition-colors"
          >
            <Trash2 size={16} />
            Supprimer
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <Section title="Préambule">
            <Field label="Préambule" value={conv.preambule} multiline />
          </Section>

          <Section title="Représentants">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Représentant interne" value={conv.repres_int} />
              <Field label="Fonction (interne)" value={conv.fct_int} />
              <Field label="Représentant externe" value={conv.repres_ext} />
              <Field label="Fonction (externe)" value={conv.fct_ext} />
            </div>
          </Section>

          <Section title="Objet du partenariat">
            <div className="space-y-4">
              <Field label="Objet" value={conv.objet_part} multiline />
              <Field label="Axe de collaboration" value={conv.axe_collab} multiline />
            </div>
          </Section>

          <Section title="Conditions">
            <div className="space-y-4">
              <Field label="Conditions du partenariat" value={conv.cond_part} multiline />
              <Field label="Conditions financières" value={conv.cond_finan} multiline />
            </div>
          </Section>

          <Section title="Clauses juridiques">
            <div className="space-y-4">
              <Field label="Résiliation" value={conv.resiliation} multiline />
              <Field label="Confidentialité" value={conv.confidentialite} multiline />
              <Field label="Règlement des différends" value={conv.regle_diff} multiline />
              <Field label="Droit applicable" value={conv.droit_appli} />
            </div>
          </Section>
        </div>

        <div className="space-y-4">
          <Section title="Durée">
            <div className="space-y-4">
              <Field label="Date de début" value={formatDate(conv.date_debut_conv)} />
              <Field label="Date de fin" value={formatDate(conv.date_fin_conv)} />
            </div>
          </Section>

          <Section title="Documents">
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
                  Photo de la signature
                </p>
                {conv.photo_conv ? (
                  <img
                    src={photo_conv}
                    alt="Photo de la signature"
                    className="w-full h-40 object-cover rounded-xl border border-slate-100"
                  />
                ) : (
                  <div className="w-full h-24 flex items-center justify-center gap-2 rounded-xl border border-dashed border-slate-200 text-slate-400 text-sm">
                    <ImageIcon size={18} />
                    Aucune photo
                  </div>
                )}
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
                  Scan de la convention
                </p>
                {conv.scan ? (
                  <a
                    href={scan}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-sky-600 font-semibold text-sm hover:text-sky-700"
                  >
                    <FileSignature size={16} />
                    Voir le document scanné
                  </a>
                ) : (
                  <div className="w-full h-16 flex items-center justify-center gap-2 rounded-xl border border-dashed border-slate-200 text-slate-400 text-sm">
                    <FileSignature size={18} />
                    Aucun scan
                  </div>
                )}
              </div>
            </div>
          </Section>
        </div>
      </div>

      <ConfirmModal
        open={confirmOpen}
        title="Supprimer cette convention ?"
        message="Cette action est irréversible. La convention sera définitivement supprimée."
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
        variant="danger"
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}