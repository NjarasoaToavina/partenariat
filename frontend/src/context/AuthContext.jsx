import { createContext, useState, useEffect, useCallback } from "react";
import { getCurrentUser } from "../services/authService";
import {useToast} from "./ToastContext";
import { useContext } from "react";
import { createEcho } from "../echo";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);

    const fetchUser = useCallback(async () => {
        const token = localStorage.getItem("ACCESS_TOKEN");
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const response = await getCurrentUser();
            
            setUser(response.data.user);
            setRoles(response.data.roles || []);
            setPermissions(response.data.permissions || []);
        } catch (error) {
            toast.error("Impossible de récupérer les informations de l'utilisateur.");
            localStorage.removeItem("ACCESS_TOKEN");

            setUser(null);
            setRoles([]);
            setPermissions([]);
        } finally {
            setLoading(false);
        }
    },[toast]);


    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    useEffect(() => {
        if (!user?.id) return;

        const echo = createEcho();
        const pusher = echo.connector.pusher;

        const onConnected = () => {
            console.log("Connecté à Laravel Reverb !");
        };

        const onError = (error) => {
            console.error("Erreur Reverb :", error);
        };

        pusher.connection.bind("connected", onConnected);
        pusher.connection.bind("error", onError);

        // Écouter les notifications de l'utilisateur connecté
        const channel = echo.private(`App.Models.User.${user.id}`);

        channel.notification((notification) => {
            console.log("🔔 Nouvelle notification reçue :", notification);
        });

        // Vérifier l'authentification au canal privé
        channel.subscribed(() => {
            console.log("Abonnement au canal privé réussi !");
        });

        channel.error((error) => {
            console.error("Erreur du canal privé :", error);
        });

        return () => {
            echo.leave(`App.Models.User.${user.id}`);
            pusher.connection.unbind("connected", onConnected);
            pusher.connection.unbind("error", onError);
            echo.disconnect();
        };
    }, [user?.id]);

    const loginUser = (userData) => {
        setUser(userData.user);
        setRoles(userData.roles || []);
        setPermissions(userData.permissions || []);
    };

    const logoutUser = () => {
        localStorage.removeItem("ACCESS_TOKEN");
        setUser(null);
        setRoles([]);
        setPermissions([]);
    }

    const hasPermission = (permission) => { 
        
        return permissions.includes(permission); 
    };

    const hasRoles = (role) => {
        return roles.includes(role);
    }

    return (
        <AuthContext.Provider value={{ user, loading, roles, permissions, fetchUser, loginUser, logoutUser, hasPermission, hasRoles }}>
            {children}
        </AuthContext.Provider>
    );
}   

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
