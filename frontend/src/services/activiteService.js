import api from "./api";

export const getActivites = () => {
  return api.get("/activites");
}

export const getActiviteById = (id) => {
  return api.get(`/activites/${id}`);
}

export const createActivite = (data) => {
  return api.post("/activites", data);
}

export const updateActivite = (id, data) => {
  return api.put(`/activites/${id}`, data);
};

export const deleteActivite = (id) => {
  return api.delete(`/activites/${id}`);
}

