import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2, Plus } from "lucide-react";
import { useToast } from "../context/ToastContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import ConfirmModal from "../components/common/ConfirmModal.jsx";
import PublicationCard from "../components/relation/PublicationCard.jsx";
import PublicationFormModal from "../components/relation/PublicationFormModal.jsx";
import {
  createCommentaire,
  createPublication,
  deleteCommentaire,
  deletePublication,
  getPublications,
  reactToPublication,
  updatePublication,
} from "../services/relationService";

import { sortByDateDesc } from "../components/relation/relationUtils";

const apiError = (err, fallback) => err?.response?.data?.message || fallback;

export default function Relation() {
  const toast = useToast();
  const { user } = useAuth(); // { id, name, image, ... }

  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState(null); // { publication } | null
  const [saving, setSaving] = useState(false);
  // { type: "publication" | "commentaire", publication, commentaire? } | null
  const [toDelete, setToDelete] = useState(null);

  const load = useCallback(async (showSpinner = true) => {
    if (showSpinner) setLoading(true);
    setError(null);
    try {
      setPublications(await getPublications());
    } catch (err) {
      console.error("Erreur chargement publications :", err);
      setError("Impossible de charger les publications.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const sorted = useMemo(() => sortByDateDesc(publications), [publications]);

  // Mise à jour locale d'une publication
  const patchPublication = (id_pub, patch) =>
    setPublications((list) =>
      list.map((p) => (p.id_pub === id_pub ? { ...p, ...patch(p) } : p))
    );

  /* ---- Publications ------------------------------------------------------ */

  const closeModal = useCallback(() => setModal(null), []);

  const handleSave = async (values) => {
      const editing = modal?.publication;
      setSaving(true);
      try {
        if (editing) {
          await updatePublication(editing.id_pub, values);
          toast.success("Publication modifiée.");
        } else {
          await createPublication(values);
          toast.success("Publication ajoutée.");
        }
        setModal(null);
        await load(false);
      } catch (err) {
        console.error("Erreur enregistrement publication :", err);
        toast.error(
          apiError(err, "Erreur lors de l'enregistrement. Veuillez réessayer.")
        );
      } finally {
        setSaving(false);
      }
    };

    const handleReact = async (publication) => {
    const previous = publication.reaction ?? 0;
    const wasReacted = Boolean(publication.has_reacted);

    // Mise à jour immédiate selon l'état actuel
    patchPublication(publication.id_pub, () => ({
      reaction: previous + (wasReacted ? -1 : 1),
      has_reacted: !wasReacted,
    }));

    try {
      const res = await reactToPublication(publication.id_pub);

      // Synchroniser avec la réponse Laravel
      patchPublication(publication.id_pub, () => ({
        reaction: res.reaction,
        has_reacted: res.has_reacted,
      }));

    } catch (err) {
      console.error("Erreur réaction :", err);

      // Restaurer les anciennes valeurs
      patchPublication(publication.id_pub, () => ({
        reaction: previous,
        has_reacted: wasReacted,
      }));

      toast.error("Impossible d'enregistrer votre réaction.");
    }
  };

  /* ---- Commentaires ------------------------------------------------------ */

  // Doit renvoyer une promesse : CommentSection vide le champ seulement si ça réussit
    const handleAddComment = async (publication, contenu) => {
    try {
        await createCommentaire({
        id_pub: publication.id_pub,
        contenu_com: contenu,
        });

        await load(false);

        toast.success("Commentaire ajouté.");
    } catch (err) {
        console.error("Erreur ajout commentaire :", err);
        toast.error(apiError(err, "Impossible d'ajouter le commentaire."));
        throw err;
    }
    };

  /* ---- Suppression (publication ou commentaire) -------------------------- */

  const handleDeleteConfirmed = async () => {
    const target = toDelete;
    if (!target) return;
    try {
      if (target.type === "publication") {
        await deletePublication(target.publication.id_pub);
        setPublications((list) =>
          list.filter((p) => p.id_pub !== target.publication.id_pub)
        );
        toast.success("Publication supprimée.");
      } else {
        await deleteCommentaire(target.commentaire.id_com);
        patchPublication(target.publication.id_pub, (p) => ({
          commentaires: (p.commentaires ?? []).filter(
            (c) => c.id_com !== target.commentaire.id_com
          ),
        }));
        toast.success("Commentaire supprimé.");
      }
    } catch (err) {
      console.error("Erreur suppression :", err);
      toast.error("Erreur lors de la suppression. Veuillez réessayer.");
    } finally {
      setToDelete(null);
    }
  };

  const isComment = toDelete?.type === "commentaire";

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Relations</h1>
          <p className="text-sm text-slate-500">
            Offres et opportunités publiées par les partenaires.
          </p>
        </div>
        <button
          onClick={() => setModal({ publication: null })}
          className="inline-flex items-center gap-2 rounded-lg bg-[#0065CD] px-4 py-2 text-sm font-medium text-white hover:bg-[#0054A8]"
        >
          <Plus size={18} />
          Nouvelle publication
        </button>
      </div>

      {error && (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <span>{error}</span>
          <button
            onClick={() => load()}
            className="font-medium underline hover:no-underline"
          >
            Réessayer
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 size={28} className="animate-spin text-[#0065CD]" />
        </div>
      ) : sorted.length === 0 && !error ? (
        <p className="rounded-xl border border-dashed border-slate-300 bg-white px-4 py-12 text-center text-sm text-slate-500">
          Aucune publication pour le moment. Soyez le premier à en publier une.
        </p>
      ) : (
        <div className="space-y-4">
          {sorted.map((p) => (
            <PublicationCard
              key={p.id_pub}
              publication={p}
              currentUser={user}
              onEdit={(pub) => setModal({ publication: pub })}
              onDelete={(pub) =>
                setToDelete({ type: "publication", publication: pub })
              }
              onReact={handleReact}
              onAddComment={handleAddComment}
              onDeleteComment={(pub, commentaire) =>
                setToDelete({ type: "commentaire", publication: pub, commentaire })
              }
            />
          ))}
        </div>
      )}

      {modal && (
        <PublicationFormModal
          key={modal.publication?.id_pub ?? "new"}
          publication={modal.publication}
          saving={saving}
          onSave={handleSave}
          onClose={closeModal}
        />
      )}

      <ConfirmModal
        open={Boolean(toDelete)}
        variant="danger"
        title={isComment ? "Supprimer ce commentaire ?" : "Supprimer cette publication ?"}
        message={
          isComment
            ? "Ce commentaire sera définitivement supprimé."
            : toDelete
            ? `« ${toDelete.publication.titre_pub} » et ses commentaires seront définitivement supprimés.`
            : ""
        }
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}