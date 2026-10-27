import api from "./api";

// Récupérer tous les utilisateurs
export const getAllUsers = () => {
  return api.get("/users");
};

// Récupérer un utilisateur
export const getUser = (id) => {
  return api.get(`/users/${id}`);
};

// Ajouter un utilisateur
export const createUser = (formData) => {
  return api.post("/users", formData);
};

// Modifier un utilisateur
export const updateUser = (id, formData) => {
  return api.post(`/users/${id}/update`, formData);
};

// Supprimer un utilisateur
export const deleteUser = (id) => {
  return api.delete(`/users/${id}`);
};