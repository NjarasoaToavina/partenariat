import { useState } from 'react'
import './App.css'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Dashboard from './pages/Dashboard'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      {/* <Login /> */}
      {/* <SignUp /> */}
      <Dashboard/>
    </>
  )
}

export default App
