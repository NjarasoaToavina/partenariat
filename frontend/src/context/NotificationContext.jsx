import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

import { useAuth } from "./AuthContext";
import { createEcho } from "../echo";

import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../services/notificationService";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Charger les notifications depuis Laravel
  const fetchNotifications = useCallback(async () => {
    if (!user?.id) return;

    try {
      const response = await getNotifications();

      setNotifications(response.data.notifications);
      setUnreadCount(response.data.unread_count);
    } catch (error) {
      console.error("Erreur chargement notifications :", error);
    }
  }, [user?.id]);

  // Charger les notifications au changement d'utilisateur
  useEffect(() => {
    if (user?.id) {
      fetchNotifications();
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [user?.id, fetchNotifications]);

  // Écouter les notifications en temps réel
  useEffect(() => {
    if (!user?.id) return;

    const echo = createEcho();

    echo.private(`App.Models.User.${user.id}`)
      .notification((notification) => {
        console.log("Nouvelle notification :", notification);

        // Récupérer la liste actualisée depuis Laravel
        fetchNotifications();
      });

    return () => {
      echo.leave(`App.Models.User.${user.id}`);
      echo.disconnect();
    };
  }, [user?.id, fetchNotifications]);

  // Marquer une notification comme lue
  const markAsRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      await fetchNotifications();
    } catch (error) {
      console.error("Erreur lecture notification :", error);
    }
  };

  // Marquer toutes les notifications comme lues
  const markAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      await fetchNotifications();
    } catch (error) {
      console.error("Erreur lecture notifications :", error);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error(
      "useNotifications must be used within NotificationProvider"
    );
  }

  return context;
};