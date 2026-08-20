import { useState } from 'preact/hooks'
import '../styles/Navbar.css'

export function Navbar() {
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  })
  const [loginError, setLoginError] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState('')

  const handleLoginInputChange = (e) => {
    const { name, value } = e.target
    setLoginForm((prev) => ({
      ...prev,
      [name]: value,
    }))
    setLoginError('')
  }

  const handleLoginSubmit = (e) => {
    e.preventDefault()
    setLoginError('')

    // Validation
    if (!loginForm.email.trim()) {
      setLoginError('Email is required')
      return
    }
    if (!loginForm.password.trim()) {
      setLoginError('Password is required')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginForm.email)) {
      setLoginError('Please enter a valid email')
      return
    }
    if (loginForm.password.length < 6) {
      setLoginError('Password must be at least 6 characters')
      return
    }

    // Simulate login (replace with actual API call)
    setIsLoggedIn(true)
    setUserName(loginForm.email.split('@')[0])
    setLoginForm({ email: '', password: '' })
    setIsLoginOpen(false)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUserName('')
    setLoginForm({ email: '', password: '' })
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <span className="logo-text">ContactHub</span>
        </div>

        <div className="navbar-links">
          <a href="#home" className="nav-link">
            Home
          </a>
          <a href="#contacts" className="nav-link">
            Contacts
          </a>
        </div>

        <div className="navbar-auth">
          {!isLoggedIn ? (
            <button
              className="btn-login"
              onClick={() => setIsLoginOpen(!isLoginOpen)}
            >
              Login
            </button>
          ) : (
            <div className="user-menu">
              <span className="user-greeting">Welcome, {userName}!</span>
              <button className="btn-logout" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Login Form Modal */}
      {isLoginOpen && (
        <div className="login-modal">
          <div className="login-form-container">
            <div className="login-header">
              <h2>Login to Your Account</h2>
              <button
                className="close-btn"
                onClick={() => setIsLoginOpen(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleLoginSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  value={loginForm.email}
                  onChange={handleLoginInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  value={loginForm.password}
                  onChange={handleLoginInputChange}
                  required
                />
              </div>

              {loginError && <div className="error-message">{loginError}</div>}

              <button type="submit" className="btn-submit">
                Login
              </button>

              <div className="login-footer">
                <p>
                  Don't have an account?{' '}
                  <span className="signup-link">Sign up here</span>
                </p>
              </div>
            </form>
          </div>
        </div>
      )}
    </nav>
  )
}
