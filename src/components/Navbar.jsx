import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../utils/supabase.jsx'
import './Navbar.css'

export default function Navbar() {
  const [user, setUser] = useState(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const dropdownRef = useRef(null)

  useEffect(() => {
    let mounted = true

    // 1) initial user
    const init = async () => {
      const { data, error } = await supabase.auth.getUser()
      if (error) {
        console.error(error)
        if (mounted) setUser(null)
        return
      }
      if (mounted) setUser(data?.user ?? null)
    }
    init()

    // 2) live updates on auth state changes
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return
      setUser(session?.user ?? null)
    })

    return () => {
      mounted = false
      sub?.subscription?.unsubscribe?.()
    }
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setDropdownOpen(false)
    setMenuOpen(false)
    navigate('/login-signup')
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand-group">
          <Link to="/" className="navbar-brand">
            <div className="logo-box"><img src='../public/favicon.ico'></img></div>
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
            <Link to="/about" className="nav-link" onClick={() => setMenuOpen(false)}>
              About
            </Link>
          </div>

          <div className="navbar-right">
            {user ? (
              <div className="user-menu" ref={dropdownRef}>
                <button className="user-button" onClick={() => setDropdownOpen(!dropdownOpen)}>
                  {(user.email || 'user').split('@')[0]} ▼
                </button>

                {dropdownOpen && (
                  <div className="dropdown-menu">
                    <Link
                      to="/dashboard"
                      className="dropdown-item"
                      onClick={() => {
                        setDropdownOpen(false)
                        setMenuOpen(false)
                      }}
                    >
                      Dashboard
                    </Link>
                    <button className="dropdown-item logout-btn" onClick={handleLogout}>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                className="login-button"
                onClick={() => {
                  navigate('/login-signup')
                  setMenuOpen(false)
                }}
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}