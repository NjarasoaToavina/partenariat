import api from "./api";

export const getAllPartnerships = () => {
  return api.get("/partenariats");
}

export const createPartnership = (partnershipData) => {
  return api.post("/partenariats", partnershipData);
}

export const deletePartnership = (id) => {
  return api.delete(`/partenariats/${id}`);
}

