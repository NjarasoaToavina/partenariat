import { CalendarDays, Users2 } from "lucide-react";
import { mapProposition } from "../data/propositionData";
import ProposalSection from "../components/proposition/ProposalSection";
import { useToast } from "../context/ToastContext";
import { useEffect, useState } from "react";
import { getAllPropositions, createProposition, deleteProposition, updateStatutProposition, updateProposition } from "../services/PropositionService";
import Loader from "../components/common/Loader";
import RejectPropositionModal from "../components/proposition/RejectPropositionModal";
import { useAuth } from "../context/AuthContext";
import AddPartnerProposalModal from "../components/proposition/AddPartnerProposalModal";
import ConfirmModal from "../components/common/ConfirmModal";
import { getPropositionsActivites, proposerActivite, traiterPropositionActivite,} from "../services/activitePropositionService";
import { mapActiviteProposition } from "../data/propositionData";
import AddActivityProposalModal from "../components/proposition/AddActivityProposalModal";


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

  const [activitesProposees, setActivitesProposees] = useState([]);
  const [isLoadingActivites, setIsLoadingActivites] = useState(false);
  const [validatingIdActivite, setValidatingIdActivite] = useState(null);
  const [selectedActivite, setSelectedActivite] = useState(null);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [isCreatingActivity, setIsCreatingActivity] = useState(false);

  useEffect(() => {
    if (!hasPermission("propositions.activites.view")) {
      setActivitesProposees([]);
      setIsLoadingActivites(false);
      return;
    }

    const fetchActivites = async () => {
      setIsLoadingActivites(true);

      try {
        const response = await getPropositionsActivites();

        const formatted = response.data
          .filter((activite) =>
            activite.user?.roles?.some(
              (role) => role.name === "partenaire"
            )
          )
          .map(mapActiviteProposition);

        setActivitesProposees(formatted);

      } catch (error) {
        console.error("Erreur chargement activités :", error);
        toast.error("Impossible de charger les propositions d'activités.");
      } finally {
        setIsLoadingActivites(false);
      }
    };

    fetchActivites();
  }, [toast, hasPermission]);


  const handleCreateActivityProposal = async (data) => {
    if (isCreatingActivity) return;

    setIsCreatingActivity(true);

    try {
      // Envoyer la proposition à Laravel
      await proposerActivite(data);

      // Actualiser les propositions d'activités
      const response = await getPropositionsActivites();

      const formatted = response.data
        .filter((activite) =>
          activite.user?.roles?.some(
            (role) => role.name === "partenaire"
          )
        )
        .map(mapActiviteProposition);

      setActivitesProposees(formatted);

      // Fermer la modale
      setIsActivityModalOpen(false);

      toast.success("Votre proposition d'activité a été envoyée avec succès.");

    } catch (error) {
      console.error("Erreur création proposition d'activité :", error);

      toast.error(
        error?.response?.data?.message ||
        "Impossible d'envoyer la proposition d'activité."
      );

    } finally {
      setIsCreatingActivity(false);
    }
  };

  const handleValidateActivite = async (item) => {
    if (validatingIdActivite !== null) return;

    setValidatingIdActivite(item.id);

    try {
      await traiterPropositionActivite(item.id, {
        etat_activ: "planifie",
      });

      setActivitesProposees((prev) =>
        prev.map((activite) =>
          activite.id === item.id
            ? { ...activite, statut: "planifie" }
            : activite
        )
      );

      toast.success(`L'activité "${item.titre}" a été validée.`);

    } catch (error) {
      console.error("Erreur validation activité :", error);
      toast.error(
        error?.response?.data?.message ||
        "Impossible de valider cette activité."
      );
    } finally {
      setValidatingIdActivite(null);
    }
  };

  const handleRejectActivite = (item) => {
    setSelectedActivite(item);
  };

  const handleConfirmRejectActivite = async () => {
    if (!selectedActivite || isRejecting) return;

    setIsRejecting(true);

    try {
      await traiterPropositionActivite(selectedActivite.id, {
        etat_activ: "refuse",
      });

      setActivitesProposees((prev) =>
        prev.map((activite) =>
          activite.id === selectedActivite.id
            ? { ...activite, statut: "refuse" }
            : activite
        )
      );

      toast.success(
        `L'activité "${selectedActivite.titre}" a été refusée.`
      );

      setSelectedActivite(null);

    } catch (error) {
      console.error("Erreur refus activité :", error);
      toast.error(
        error?.response?.data?.message ||
        "Impossible de refuser cette activité."
      );
    } finally {
      setIsRejecting(false);
    }
  };

  useEffect(() => {
    // Vérifier si l'utilisateur possède la permission
    if (!hasPermission("propositions.partenaires.view")) {
      setPropositions([]);
      setIsLoadingProp(false);
      return;
    }

    const fetchPropositions = async () => {
      setIsLoadingProp(true);

      try {
        const response = await getAllPropositions();

        const formattedPropositions = response.data.map(mapProposition);

        setPropositions(formattedPropositions);
      } catch (error) {
        console.error("Erreur chargement propositions :", error);
        toast.error("Impossible de charger la liste des propositions.");
      } finally {
        setIsLoadingProp(false);
      }
    };

    fetchPropositions();
  }, [toast, hasPermission]);

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
          <p className="text-xs text-slate-400">
            Visualisation des informations
          </p>
          <h1 className="text-lg font-bold text-slate-900">
            Propositions
          </h1>
        </div>

        {/* PROPOSITIONS D'ACTIVITÉS */}
        {hasPermission("propositions.activites.view") && (
          isLoadingActivites ? (
            <Loader
              fullScreen={false}
              label="Chargement des propositions d'activités..."
            />
          ) : (
            <ProposalSection
              icon={CalendarDays}
              title="Propositions d'activités (par les partenaires)"
              type="activite"
              items={activitesProposees}
              itemLabel="propositions"
              onValidate={handleValidateActivite}
              onReject={handleRejectActivite}
              validatingId={validatingIdActivite}
              canAdd={hasPermission("activites.propose")}
              onAdd={() => setIsActivityModalOpen(true)}
            />
          )
        )}

        {hasPermission("propositions.partenaires.view") && (
          isLoadingProp ? (
            <Loader
              fullScreen={false}
              label="Chargement des propositions..."
            />
          ) : (
            <ProposalSection
              icon={Users2}
              title="Propositions de partenaires (par les services de l'ESMIA)"
              type="partenaire"
              items={propositions}
              itemLabel="partenaires proposés"
              onValidate={handleValidate}
              onReject={handleReject}
              validatingId={validatingId}
              canAdd={hasPermission("propositions.create")}
              onAdd={handleAdd}
              onEdit={handleEdit}
              onDelete={(prop) => {
                setSelectedProp(prop);
                setConfirmOpen(true);
              }}
            />
          )
        )}
      </div>

      {/* MODALE DE REFUS : ACTIVITÉS ET PARTENAIRES */}
      <RejectPropositionModal
        open={!!selectedProposition || !!selectedActivite}
        proposition={selectedActivite || selectedProposition}
        isLoading={isRejecting}
        onConfirm={
          selectedActivite
            ? handleConfirmRejectActivite
            : handleConfirmReject
        }
        onCancel={() => {
          setSelectedProposition(null);
          setSelectedActivite(null);
        }}
      />

      {/* MODALE D'AJOUT / MODIFICATION D'UN PARTENAIRE */}
      <AddPartnerProposalModal
        open={isPartnerModalOpen}
        onCancel={() => setIsPartnerModalOpen(false)}
        onConfirm={
          propToEdit
            ? handleUpdatePartnerProposal
            : handleCreatePartnerProposal
        }
        isLoading={isCreating}
        propToEdit={propToEdit}
      />

      {/* MODALE D'AJOUT / MODIFICATION D'UNE ACTIVITE */}
      <AddActivityProposalModal
        open={isActivityModalOpen}
        onCancel={() => setIsActivityModalOpen(false)}
        onConfirm={handleCreateActivityProposal}
        isLoading={isCreatingActivity}
      />

      {/* MODALE DE SUPPRESSION */}
      <ConfirmModal
        open={confirmOpen}
        variant="danger"
        title="Supprimer une proposition ?"
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