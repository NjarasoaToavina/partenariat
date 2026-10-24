import api from "./api";

// Récupérer toutes les publications
export const getAllPublications = async () => {
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
  const response = await api.post("/publications", data);
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