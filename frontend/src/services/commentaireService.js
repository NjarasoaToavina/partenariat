import api from "./api";

// Récupérer tous les commentaires
export const getAllCommentaires = async () => {
  const response = await api.get("/commentaires");
  return response.data;
};

// Récupérer un commentaire par son ID
export const getCommentaireById = async (id) => {
  const response = await api.get(`/commentaires/${id}`);
  return response.data;
};

// Ajouter un commentaire
export const createCommentaire = async (data) => {
  const response = await api.post("/commentaires", data);
  return response.data;
};

// Modifier un commentaire
export const updateCommentaire = async (id, data) => {
  const response = await api.patch(`/commentaires/${id}`, data);
  return response.data;
};

// Supprimer un commentaire
export const deleteCommentaire = async (id) => {
  const response = await api.delete(`/commentaires/${id}`);
  return response.data;
};