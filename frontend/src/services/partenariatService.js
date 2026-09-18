import api from "./api";

export const getAllPartnerships = () => {
  return api.get("/partenariats");
}

export const createPartnership = (partnershipData) => {
  return api.post("/partenariats", partnershipData);
}

