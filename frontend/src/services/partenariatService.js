import api from "./api";

export const getAllPartnerships = () => {
  return api.get("/partenariats");
}