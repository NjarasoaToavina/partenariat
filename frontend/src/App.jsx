import './App.css'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Partenaire from './pages/Partenaire'
import Dashboard from './pages/Dashboard'
import Atelier from './pages/Atelier'
import AppLayout from './components/layout/AppLayout'
import PlaceholderPage from './pages/Placeholderpage'
import { NAV_ITEMS } from './data/navItems'
import { Routes, Route, Navigate } from 'react-router-dom'
import {useAuth} from './context/AuthContext.jsx'
import Loader from './components/common/Loader.jsx'
import AjouterPartenaire from './pages/AjouterPartenaire.jsx'
import AjouterAtelier from './pages/AjouterAtelier.jsx'
import ModifierPartenaire from './pages/ModifierPartenaire.jsx'
import ModifierAtelier from './pages/ModifierAtelier.jsx'

function App() {
  const { loading } = useAuth();

  if (loading) {
    return <Loader label="Vérification de la session..." />; // Affiche un loader pendant le chargement de l'utilisateur
  } 
  return (
    <Routes>

      {/* Routes publiques */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/signup/:role" element={<SignUp />} />

      {/* Routes privées */}
      <Route element={<AppLayout />} >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/partenaires" element={<Partenaire />} />
        <Route path="/partenaires/ajouter" element={<AjouterPartenaire />} />
        <Route path="/partenaires/modifier/:id" element={<ModifierPartenaire />} />
        <Route path="/ateliers" element={<Atelier />} />
        <Route path="/ateliers/ajouter" element={<AjouterAtelier />} />
        <Route path="/ateliers/modifier/:id" element={<ModifierAtelier />} />
        
         {NAV_ITEMS.filter((item) => !item.path.includes(["/dashboard", "/partenaires", "/ateliers"])).map(
          (item) => (
            <Route
              key={item.path}
              path={item.path}
              element={<PlaceholderPage title={item.label} />}
            />
          )
        )}
      </Route>
    </Routes>
  )
}

export default App
