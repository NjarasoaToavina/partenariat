import api from "./api";

export const getAllAteliers = () => {
  return api.get("/ateliers");
}

export const createAtelier = (atelier) => {
  return api.post("/ateliers", atelier);
}