import api from "./api";

// Récupérer toutes les notifications
export const getNotifications = () => {
    return api.get("/notifications");
};

// Marquer une notification comme lue
export const markNotificationAsRead = (id) => {
    return api.patch(`/notifications/${id}/read`);
};

// Marquer toutes les notifications comme lues
export const markAllNotificationsAsRead = () => {
    return api.patch("/notifications/read-all");
};