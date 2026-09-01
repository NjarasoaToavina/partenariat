import './App.css'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Dashboard from './pages/Dashboard'
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

      <Route element={<AppLayout />} >
        <Route path="/dashboard" element={<Dashboard />} />
         {NAV_ITEMS.filter((item) => item.path !== "/dashboard").map(
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
