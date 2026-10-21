import { CalendarDays, Import, Users2 } from "lucide-react";
import { ACTIVITY_PROPOSALS, PARTNER_PROPOSALS, mapProposition } from "../data/propositionData";
import ProposalSection from "../components/proposition/ProposalSection";
import { useToast } from "../context/ToastContext";
import { useEffect, useState } from "react";
import { getAllPropositions, createProposition, deleteProposition, updateStatutProposition, updateProposition } from "../services/PropositionService";
import Loader from "../components/common/Loader";
import RejectPropositionModal from "../components/proposition/RejectPropositionModal";
import { useAuth } from "../context/AuthContext";
import AddPartnerProposalModal from "../components/proposition/AddPartnerProposalModal";
import ConfirmModal from "../components/common/Confirmmodal";

export default function Proposition() {
  const toast = useToast();
  const [isLoadingProp,setIsLoadingProp] = useState(false);
  const [propositions,setPropositions] = useState([]);
  const [selectedProposition, setSelectedProposition] = useState(null);
  const [isRejecting, setIsRejecting] = useState(false);
  const {hasPermission} = useAuth();
  const [validatingId, setValidatingId] = useState(null);
  const [isPartnerModalOpen,setIsPartnerModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedProp,setSelectedProp] = useState({});
  const [isDeleting,setIsDeleting] = useState(false);
  const [propToEdit,setPropToEdit] = useState({});

  useEffect(()=>{
      setIsLoadingProp(true);
      const fetchPropositions = async () => {
          try {
            const response = await getAllPropositions();
            const formattedPropositions = response.data.map(mapProposition);
            setPropositions(formattedPropositions);
          } catch (error) {
            toast.error("Impossible de charger la liste des propositions.");
          } finally {
            setIsLoadingProp(false);
          }
      };
  
      fetchPropositions();
    },[toast]);

  const handleValidate = async (item) => {
    if (validatingId !== null) return;

    setValidatingId(item.id);
    try {
      await updateStatutProposition(item.id, {
        etat_propos: "valide",
      });

      // Mettre à jour immédiatement le tableau
      setPropositions((prev) =>
        prev.map((proposition) =>
          proposition.id === item.id
            ? {
                ...proposition,
                statut: "valide",
              }
            : proposition
        )
      );

      toast.success(`La proposition "${item.titre}" a été validée.`);

    } catch (error) {
      console.error("Erreur validation proposition :", error);
      toast.error("Impossible de valider cette proposition.");
    } finally {
      setValidatingId(null);
    }
  };

  const handleReject = (item) => {
    setSelectedProposition(item);
  };

  const handleConfirmReject = async (commentaire) => {
    if (!selectedProposition || isRejecting) return;

    setIsRejecting(true);

    try {
      await updateStatutProposition(selectedProposition.id, {
        etat_propos: "refuse",
        commentaire: commentaire,
      });

      // Mettre à jour immédiatement le tableau
      setPropositions((prev) =>
        prev.map((proposition) =>
          proposition.id === selectedProposition.id
            ? {
                ...proposition,
                statut: "refuse",
                description: commentaire,
              }
            : proposition
        )
      );

      toast.success(
        `La proposition "${selectedProposition.titre}" a été refusée.`
      );

      // Fermer la modale
      setSelectedProposition(null);

    } catch (error) {
      console.error("Erreur refus proposition :", error);

      toast.error("Impossible de refuser cette proposition.");

    } finally {
      setIsRejecting(false);
    }
  };

  const handleCreatePartnerProposal = async (data) => {
    if (isCreating) return;

    setIsCreating(true);

    try {
      // Envoyer les données à Laravel
      await createProposition(data);

      // Récupérer la liste actualisée
      const response = await getAllPropositions();

      const formattedPropositions = response.data.map(mapProposition);

      // Mettre à jour les cartes
      setPropositions(formattedPropositions);

      // Fermer la modale
      setIsPartnerModalOpen(false);

      toast.success("La proposition a été ajoutée avec succès.");

    } catch (error) {
      console.error("Erreur ajout proposition :", error);

      toast.error("Impossible d'ajouter la proposition.");

    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async() => {
  if (!selectedProp || isDeleting) return;

    setIsDeleting(true);
    console.log("la proposition supprimée est ",selectedProp);

    try {
      await deleteProposition(selectedProp.id);

      // Retirer instantanément la ligne du tableau
      setPropositions((prev) =>
        prev.filter((P) => P.id !== selectedProp.id)
      );

      toast.success(`Proposition n°${selectedProp.id} a été supprimée`);

      setConfirmOpen(false);
      setSelectedProp({});

    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
      toast.error("Impossible de supprimer la proposition.");

    } finally {
      setIsDeleting(false);
    }
  };

  const handleAdd = () => {
    setPropToEdit(null);
    setIsPartnerModalOpen(true);
  };
  const handleEdit = (prop) => {
    setPropToEdit(prop);
    setIsPartnerModalOpen(true);
  };

  const handleUpdatePartnerProposal = async (data) => {
    if (!propToEdit || isCreating) return;

    setIsCreating(true);

    try {
      await updateProposition(propToEdit.id, data);

      const response = await getAllPropositions();

      setPropositions(response.data.map(mapProposition));

      toast.success("La proposition a été modifiée avec succès.");

      setIsPartnerModalOpen(false);
      setPropToEdit(null);

    } catch (error) {
      console.error("Erreur modification proposition :", error);
      toast.error("Impossible de modifier la proposition.");
    } finally {
      setIsCreating(false);
    }
  };
  
  return (
    <>
    <div className="space-y-4">
      <div>
        <p className="text-xs text-slate-400">Visualisation des informations</p>
        <h1 className="text-lg font-bold text-slate-900">Propositions</h1>
      </div>

      <ProposalSection
        icon={CalendarDays}
        title="Propositions d'activités (par les partenaires)"
        items={ACTIVITY_PROPOSALS}
        itemLabel="propositions"
        onValidate={handleValidate}
        onReject={handleReject}
        onOpenFilters={() => {/* à brancher */}}
        validatingId={validatingId}
      />

      {isLoadingProp ? (
        <Loader fullScreen={false} label="Chargement des propositions..." />
              ) : (
        <ProposalSection
          icon={Users2}
          title="Propositions de partenaires (par les services de l'ESMIA)"
          items={propositions}
          itemLabel="partenaires proposés" 
          onValidate={handleValidate}
          onReject={handleReject}
          onOpenFilters={() => {/* à brancher */}}
          validatingId={validatingId}
          canAdd={hasPermission("propositions.create")}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={(prop)=>{
            setSelectedProp(prop);
            setConfirmOpen(true);
          }}

        />
      )}
    </div>
    <RejectPropositionModal
      open={!!selectedProposition}
      proposition={selectedProposition}
      isLoading={isRejecting}
      onConfirm={handleConfirmReject}
      onCancel={() => setSelectedProposition(null)}
    />
    <AddPartnerProposalModal
      open={isPartnerModalOpen}
      onCancel={()=>setIsPartnerModalOpen(false)}
      onConfirm={
        propToEdit
          ? handleUpdatePartnerProposal
          : handleCreatePartnerProposal
      }
      isLoading={isCreating}
      propToEdit={propToEdit}
    />
    <ConfirmModal
      open={confirmOpen}
      variant="danger"
      title="Supprimer une proposition?"
      message={`Voulez-vous vraiment supprimer la proposition n°${selectedProp?.id} ?`}
      confirmLabel="Confirmer"
      cancelLabel="Annuler"
      onConfirm={handleDelete}
      onCancel={() => setConfirmOpen(false)}
      isLoading={isDeleting}
       />

    </>
  );
}