import api from "./api";

// Récupérer les activités
export const getPropositionsActivites = () => {
  return api.get("/activites");
};

// Proposer une activité (partenaire)
export const proposerActivite = (data) => {
  return api.post("/activites/proposer", data);
};

// Accepter ou refuser une proposition (responsable)
export const traiterPropositionActivite = (id, data) => {
  return api.patch(`/activites/${id}/traiter`, data);
};

// Modifier une proposition d'activité
export const updatePropositionActivite = (id, data) => {
  return api.put(`/activites/${id}`, data);
};

// Supprimer une proposition d'activité
export const deletePropositionActivite = (id) => {
  return api.delete(`/activites/${id}`);
};