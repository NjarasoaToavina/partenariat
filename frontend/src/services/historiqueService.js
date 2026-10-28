import api from "./api";

// Récupérer la liste des historiques
export const getHistoriques = async () => {
    const response = await api.get("/historiques");
    return response.data;
};