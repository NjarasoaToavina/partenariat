import api from "./api";

export const getAllAteliers = () => {
  return api.get("/ateliers");
}

export const getAtelier = (id) => {
  return api.get(`/ateliers/${id}`);
}

export const createAtelier = (atelier) => {
  return api.post("/ateliers", atelier);
}

export const updateAtelier = (id, atelierData) => {
  return api.put(`/ateliers/${id}`, atelierData);
};
export const deleteAtelier = (id) => {
  return api.delete(`/ateliers/${id}`);
}
