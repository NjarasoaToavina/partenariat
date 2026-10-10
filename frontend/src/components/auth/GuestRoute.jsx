// import { Navigate, Outlet } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";
// import { getDefaultRoute } from "../data/navItems";
// import Loader from "../components/common/Loader";

// const extractPermissionsFromRoles = (userObj) => {
//     if (!userObj || !userObj.roles || !Array.isArray(userObj.roles)) {
//         return [];
//     }

//     // 1. Récupérer toutes les permissions de tous les rôles
//     const allPermissions = userObj.roles.flatMap(role => {
//         if (role.permissions && Array.isArray(role.permissions)) {
//             return role.permissions.map(p => p.name);
//         }
//         return [];
//     });

//     // 2. Utiliser un Set pour supprimer les doublons et retourner un tableau propre
//     return [...new Set(allPermissions)];
// };

// const GuestRoute = () => {
//     const { user, permissions, loading, isAuthenticating } = useAuth();
//     console.log("Permissions de l'utilisateur :", permissions);

//     // 1. Si l'application est en train de vérifier la session ou de connecter l'utilisateur, on attend
//     if (loading || isAuthenticating) {
//         return <Loader label="Vérification des accès..." />;
//     }

//     // 2. Si l'utilisateur est connecté
//     if (user) {

//         const targetRoute = getDefaultRoute(extractPermissionsFromRoles(user));
//         return <Navigate to={targetRoute} replace />;
//     }

//     // 3. Si l'utilisateur n'est pas connecté, il peut voir le Login / SignUp
//     return <Outlet />;
// };

// export default GuestRoute;


import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getDefaultRoute } from "../../data/navItems";

const GuestRoute = () => {
  const { user, permissions} = useAuth();


  if (user) {
    const targetRoute = getDefaultRoute(permissions);
    console.log("DESTINATION :", targetRoute);
    return <Navigate to={targetRoute} replace />;
  }

  return <Outlet />;
};

export default GuestRoute;

