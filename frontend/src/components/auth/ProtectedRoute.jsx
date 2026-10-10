import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = ({ permission }) => {
    const { user, hasPermission} = useAuth();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Pas la permission
    if (permission && !hasPermission(permission)) {
        return <Navigate to="/403" replace />;
    }

    // Autorisé
    return <Outlet />;
};

export default ProtectedRoute;