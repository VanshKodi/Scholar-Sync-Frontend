import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './components/Home.jsx'
import LoginSignup from './components/LoginSignup.jsx'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      {/* renamed from /login to /login-signup */}
      <Route path="/login-signup" element={<LoginSignup />} />
    </Routes>
  )
}

export default App