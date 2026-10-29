import api from "./api";

// Récupérer toutes les publications
export const getPublications = async () => {
  const response = await api.get("/publications");
  return response.data;
};

// Récupérer une publication par son ID
export const getPublicationById = async (id) => {
  const response = await api.get(`/publications/${id}`);
  return response.data;
};

// Ajouter une publication
export const createPublication = async (data) => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      if (key === "photo_pub") {
        if (value instanceof File) {
          formData.append(key, value);
        }
      } else {
        formData.append(key, value);
      }
    }
  });

  const response = await api.post("/publications", formData);
  return response.data;
};

// Réagir à une publication
export const reactToPublication = async (id) => {
  const response = await api.post(`/publications/${id}/react`);
  return response.data;
};

// Modifier une publication
export const updatePublication = async (id, data) => {
  const formData = new FormData();

  formData.append("_method", "PUT");

  Object.entries(data).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      formData.append(key, value);
    }
  });

  const response = await api.post(`/publications/${id}`, formData);
  return response.data;
};

// Supprimer une publication
export const deletePublication = async (id) => {
  const response = await api.delete(`/publications/${id}`);
  return response.data;
};

// ------------------------------------------------------


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