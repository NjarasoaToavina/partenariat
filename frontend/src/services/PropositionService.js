import api from './api'

export const getAllPropositions = () => {
    return api.get("/propositions");
}

export const updateStatutProposition = (id,data) => {
    return api.patch(`/propositions/${id}/statut`,data);
}

export const createProposition = (data) => {
    return api.post("/propositions",data);
}

export const updateProposition = (id,data) => {
    return api.put(`/propositions/${id}`,data);
}

export const deleteProposition = (id) => {
    return api.delete(`/propositions/${id}`);
}

export const getPropositionById = (id) =>  {
    return api.get(`/documents/${id}`);
}
