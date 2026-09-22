import api from "./api";

export const getAllPartnerships = () => {
  return api.get("/partenariats");
}

export const getPartnership = (id) => {
  return api.get(`/partenariats/${id}`);
}

export const createPartnership = (partnershipData) => {
  return api.post("/partenariats", partnershipData);
}

export const updatePartnership = (id, partnershipData) => {
  return api.put(`/partenariats/${id}`, partnershipData);
};
export const deletePartnership = (id) => {
  return api.delete(`/partenariats/${id}`);
}

