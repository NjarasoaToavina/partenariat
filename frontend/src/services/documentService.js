import api from './api'

export const getAllDocuments = () => {
    return api.get("/documents");
}

export const updateStatutDocument = (id,data) => {
    return api.patch(`/documents/${id}/statut`,data);
}

export const createDocument = (data) => {
    return api.post("/documents");
}

export const updateDocument = (id,data) => {
    return api.put(`/documents/${id}`,data);
}

export const deleteDocument = (id) => {
    return api.delete(`/documents/${id}`);
}

export const downloadDocument = (id) => {
    return api.get(`/documents/${id}/download`, { responseType: 'blob' }); // 👈 Ajout ici
}

export const getDocumentById = (id) =>  {
    return api.get(`/documents/${id}`);
}
