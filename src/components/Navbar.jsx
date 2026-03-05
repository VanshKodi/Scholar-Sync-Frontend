import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { checkUserSession, supabase } from '../utils/supabase.jsx'
import './Navbar.css'

export default function Navbar() {
  const [user, setUser] = useState(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const dropdownRef = useRef(null)

  useEffect(() => {
    const fetchUser = async () => {
      const session = await checkUserSession()
      if (session) {
        setUser(session.user)
      }
    }
    fetchUser()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setDropdownOpen(false)
    setMenuOpen(false)
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand-group">
          <Link to="/" className="navbar-brand">
            <div className="logo-box">S</div>
            <span className="brand-name">Scholar Sync</span>
          </Link>
          
          {/* Hamburger Toggle */}
          <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </button>
        </div>

        <div className={`navbar-links ${menuOpen ? 'active' : ''}`}>
          <div className="navbar-left">
            <Link to="/about" className="nav-link" onClick={() => setMenuOpen(false)}>About</Link>
          </div>

          <div className="navbar-right">
            {user ? (
              <div className="user-menu" ref={dropdownRef}>
                <button 
                  className="user-button" 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  {user.email.split('@')[0]} ▼
                </button>
                
                {dropdownOpen && (
                  <div className="dropdown-menu">
                    <Link to="/dashboard" className="dropdown-item" onClick={() => {setDropdownOpen(false); setMenuOpen(false);}}>
                      Dashboard
                    </Link>
                    <button className="dropdown-item logout-btn" onClick={handleLogout}>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button className="login-button" onClick={() => {navigate('/login'); setMenuOpen(false);}}>
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}