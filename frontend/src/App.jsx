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

function App() {

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
        <Route path="/atelier" element={<Atelier />} />
         {NAV_ITEMS.filter((item) => !item.path.includes(["/dashboard", "/partenaires", "/atelier"])).map(
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
