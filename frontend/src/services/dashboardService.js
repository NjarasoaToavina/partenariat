import api from "./api";

// Récupérer les statistiques du Dashboard
export const getDashboardStats = async (year) => {
  const response = await api.get("/dashboard/stats", {
    params: { year },
  });

  return response.data;
};