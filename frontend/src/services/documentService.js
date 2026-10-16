import api from './api'

export const getAllDocuments = () => {
    return api.get("/documents");
}

export const updateStatutDocument = (data) => {
    return api.patch("/documents",data);
}

export const createDocument = (data) => {
    return api.get("/documents");
}

export const updateDocument = (id,data) => {
    return api.post(`/documents/${id}`,data);
}

export const deleteDocument = (id) => {
    return api.delete(`/documents/${id}`);
}

export const downloadDocument = (id) => {
    return api.get(`/documents/${id}`)
}
