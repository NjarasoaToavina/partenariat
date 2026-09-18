import api from "./api";

export const getAllAteliers = () => {
  return api.get("/ateliers");
}