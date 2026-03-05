import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../utils/supabase.jsx'
import './LoginSignup.css'

export default function LoginSignup() {
  const navigate = useNavigate()

  const [isLogin, setIsLogin] = useState(true)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [infoMsg, setInfoMsg] = useState('')

  const title = useMemo(() => (isLogin ? 'Login' : 'Signup'), [isLogin])

  const validate = () => {
    if (!email.trim()) return 'Email is required.'
    if (!password) return 'Password is required.'
    if (password.length < 6) return 'Password must be at least 6 characters.'
    return ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    setInfoMsg('')

    const v = validate()
    if (v) {
      setErrorMsg(v)
      return
    }

    setLoading(true)
    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error

        // data.session should exist if login succeeded
        if (data?.session) {
          navigate('/', { replace: true })
        } else {
          // rare, but keep a friendly message
          setInfoMsg('Signed in. Redirecting...')
          navigate('/', { replace: true })
        }
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        })
        if (error) throw error

        // If email confirmations are enabled in Supabase, session may be null
        if (data?.session) {
          navigate('/', { replace: true })
        } else {
          setInfoMsg('Signup successful. Please check your email to confirm your account, then log in.')
          setIsLogin(true)
        }
      }
    } catch (err) {
      setErrorMsg(err?.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="toggle-buttons">
        <button
          type="button"
          className={`toggle-btn ${isLogin ? 'active' : ''}`}
          onClick={() => {
            setIsLogin(true)
            setErrorMsg('')
            setInfoMsg('')
          }}
          disabled={loading}
        >
          Login
        </button>
        <button
          type="button"
          className={`toggle-btn ${!isLogin ? 'active' : ''}`}
          onClick={() => {
            setIsLogin(false)
            setErrorMsg('')
            setInfoMsg('')
          }}
          disabled={loading}
        >
          Signup
        </button>
      </div>

      <div className={`auth-form ${isLogin ? 'login-mode' : 'signup-mode'}`}>
        <h2>{title}</h2>

        {errorMsg ? <p style={{ color: '#dc3545', marginTop: 0 }}>{errorMsg}</p> : null}
        {infoMsg ? <p style={{ color: '#198754', marginTop: 0 }}>{infoMsg}</p> : null}

        <form onSubmit={handleSubmit}>
          {/* Email Input */}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              id="email"
              placeholder="Enter your email"
              required
              disabled={loading}
              autoComplete="email"
            />
          </div>

          {/* Password Input */}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              id="password"
              placeholder="Enter your password"
              required
              disabled={loading}
              autoComplete={isLogin ? 'current-password' : 'new-password'}
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? (isLogin ? 'Logging in...' : 'Signing up...') : title}
          </button>
        </form>
      </div>
    </div>
  )
}