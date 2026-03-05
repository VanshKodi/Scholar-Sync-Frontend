import { useState } from 'react';
import './LoginSignup.css';

export default function LoginSignup() {
  const [isLogin, setIsLogin] = useState(true); // Determines whether the user is in "Login" or "Signup" mode

  const toggleMode = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="auth-container">
      <div className="toggle-buttons">
        <button
          className={`toggle-btn ${isLogin ? 'active' : ''}`}
          onClick={() => setIsLogin(true)}
        >
          Login
        </button>
        <button
          className={`toggle-btn ${!isLogin ? 'active' : ''}`}
          onClick={() => setIsLogin(false)}
        >
          Signup
        </button>
      </div>

      <div className={`auth-form ${isLogin ? 'login-mode' : 'signup-mode'}`}>
        <h2>{isLogin ? 'Login' : 'Signup'}</h2>

        <form>
          {/* Email Input */}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password Input */}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              required
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className="submit-btn">
            {isLogin ? 'Login' : 'Signup'}
          </button>
        </form>
      </div>
    </div>
  );
}