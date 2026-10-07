import { createContext, useState, useEffect, useCallback } from "react";
import { getCurrentUser } from "../services/authService";
import {useToast} from "./ToastContext";
import { useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState();

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

    return (
        <AuthContext.Provider value={{ user, loading, fetchUser, loginUser, logoutUser, hasPermission }}>
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
