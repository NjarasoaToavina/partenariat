import api from "./api";

export const getAllConventionsFromPartner = (id_part) => {
  return api.get(`/partenariats/${id_part}/conventions`);
}

export const getConvention = (id) => {
  return api.get(`/conventions/${id}`);
}

export const createConvention = (convention) => {
  return api.post("/conventions", convention);
}

export const updateConvention = (id, conventionData) => {
  return api.put(`/conventions/${id}`, conventionData);
};
export const deleteConvention = (id) => {
  return api.delete(`/conventions/${id}`);
}
