import { useState } from 'preact/hooks'
import '../styles/Navbar.css'

export function Navbar({ isLoggedIn, userName, userRole, onLogout, onLogin }) {
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'standard',
  })
  const [loginError, setLoginError] = useState('')
  const [registerError, setRegisterError] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)
  const [registerLoading, setRegisterLoading] = useState(false)

  const handleLoginInputChange = (e) => {
    const { name, value } = e.target
    setLoginForm((prev) => ({ ...prev, [name]: value }))
    setLoginError('')
  }

  const handleRegisterInputChange = (e) => {
    const { name, value } = e.target
    setRegisterForm((prev) => ({ ...prev, [name]: value }))
    setRegisterError('')
  }

  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    setLoginError('')

    if (!loginForm.email.trim()) {
      setLoginError('Email is required')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginForm.email)) {
      setLoginError('Please enter a valid email')
      return
    }
    if (!loginForm.password) {
      setLoginError('Password is required')
      return
    }

    setLoginLoading(true)

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginForm.email.trim(),
          password: loginForm.password,
        }),
      })

      const result = await response.json().catch(() => ({}))

      if (!response.ok) {
        if (Array.isArray(result.errors) && result.errors.length > 0) {
          throw new Error(result.errors.join(', '))
        }
        throw new Error(result.message || 'Login failed. Please try again.')
      }

      onLogin(result.data.name, result.data.role, result.token)
      setLoginForm({ email: '', password: '' })
      setIsLoginOpen(false)
    } catch (error) {
      setLoginError(error.message || 'Login failed. Please try again.')
    } finally {
      setLoginLoading(false)
    }
  }

  const handleRegisterSubmit = async (e) => {
    e.preventDefault()
    setRegisterError('')

    const trimmedName = registerForm.name.trim()
    const trimmedEmail = registerForm.email.trim()

    if (!trimmedName) {
      setRegisterError('Name is required')
      return
    }
    if (trimmedName.length < 2) {
      setRegisterError('Name must be at least 2 characters long')
      return
    }
    if (!trimmedEmail) {
      setRegisterError('Email is required')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setRegisterError('Please enter a valid email')
      return
    }
    if (!registerForm.password) {
      setRegisterError('Password is required')
      return
    }
    if (registerForm.password.length < 6) {
      setRegisterError('Password must be at least 6 characters')
      return
    }
    if (registerForm.password !== registerForm.confirmPassword) {
      setRegisterError('Passwords do not match')
      return
    }

    setRegisterLoading(true)

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: trimmedName,
          email: trimmedEmail,
          password: registerForm.password,
          role: registerForm.role,
        }),
      })

      const result = await response.json().catch(() => ({}))

      if (!response.ok) {
        if (Array.isArray(result.errors) && result.errors.length > 0) {
          throw new Error(result.errors.join(', '))
        }
        throw new Error(result.message || 'Registration failed. Please try again.')
      }

      setRegisterForm({ name: '', email: '', password: '', confirmPassword: '', role: 'standard' })
      setIsRegisterOpen(false)
      setLoginError('')
      setIsLoginOpen(true)
    } catch (error) {
      setRegisterError(error.message || 'Registration failed. Please try again.')
    } finally {
      setRegisterLoading(false)
    }
  }

  const handleLogoutClick = () => {
    onLogout()
    setLoginForm({ email: '', password: '' })
    setRegisterForm({ name: '', email: '', password: '', confirmPassword: '', role: 'standard' })
  }

  const switchToRegister = () => {
    setIsLoginOpen(false)
    setLoginError('')
    setLoginForm({ email: '', password: '' })
    setIsRegisterOpen(true)
  }

  const switchToLogin = () => {
    setIsRegisterOpen(false)
    setRegisterError('')
    setRegisterForm({ name: '', email: '', password: '', confirmPassword: '', role: 'standard' })
    setIsLoginOpen(true)
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <span className="logo-text">ContactHub</span>
        </div>

        <div className="navbar-links">
          <a href="#home" className="nav-link">Home</a>
          <a href="#contacts" className="nav-link">Contacts</a>
          <a href="#products" className="nav-link">Products</a>
        </div>

        <div className="navbar-auth">
          {!isLoggedIn ? (
            <button className="btn-login" onClick={() => setIsLoginOpen(true)}>
              Login
            </button>
          ) : (
            <div className="user-menu">
              <span className="role-badge" data-role={userRole}>
                {userRole === 'admin' ? 'Admin' : 'Standard'}
              </span>
              <span className="logged-in-icon" title={userName}>
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#22c55e" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10" fill="#22c55e" stroke="none" />
                  <polyline points="8 12 11 15 16 9" stroke="#fff" />
                </svg>
              </span>
              <button className="btn-logout" onClick={handleLogoutClick}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {isLoginOpen && (
        <div className="login-modal" onClick={() => setIsLoginOpen(false)}>
          <div className="login-form-container" onClick={(e) => e.stopPropagation()}>
            <div className="login-header">
              <h2>Login to Your Account</h2>
              <button className="close-btn" onClick={() => setIsLoginOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleLoginSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="login-email">Email Address</label>
                <input type="email" id="login-email" name="email" placeholder="Enter your email" value={loginForm.email} onInput={handleLoginInputChange} />
              </div>
              <div className="form-group">
                <label htmlFor="login-password">Password</label>
                <input type="password" id="login-password" name="password" placeholder="Enter your password" value={loginForm.password} onInput={handleLoginInputChange} />
              </div>
              {loginError && <div className="error-message">{loginError}</div>}
              <button type="submit" className="btn-submit" disabled={loginLoading}>
                {loginLoading ? 'Logging in...' : 'Login'}
              </button>
              <div className="login-footer">
                <p>Don't have an account?{' '}<span className="signup-link" onClick={switchToRegister}>Sign up here</span></p>
              </div>
            </form>
          </div>
        </div>
      )}

      {isRegisterOpen && (
        <div className="login-modal" onClick={() => setIsRegisterOpen(false)}>
          <div className="login-form-container" onClick={(e) => e.stopPropagation()}>
            <div className="login-header">
              <h2>Create an Account</h2>
              <button className="close-btn" onClick={() => setIsRegisterOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleRegisterSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="register-name">Full Name</label>
                <input type="text" id="register-name" name="name" placeholder="Enter your full name" value={registerForm.name} onInput={handleRegisterInputChange} />
              </div>
              <div className="form-group">
                <label htmlFor="register-email">Email Address</label>
                <input type="email" id="register-email" name="email" placeholder="Enter your email" value={registerForm.email} onInput={handleRegisterInputChange} />
              </div>
              <div className="form-group">
                <label htmlFor="register-role">Account Type</label>
                <select id="register-role" name="role" value={registerForm.role} onChange={handleRegisterInputChange} className="select-input">
                  <option value="standard">Standard User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="register-password">Password</label>
                <input type="password" id="register-password" name="password" placeholder="Create a password (min 6 characters)" value={registerForm.password} onInput={handleRegisterInputChange} />
              </div>
              <div className="form-group">
                <label htmlFor="register-confirm-password">Confirm Password</label>
                <input type="password" id="register-confirm-password" name="confirmPassword" placeholder="Confirm your password" value={registerForm.confirmPassword} onInput={handleRegisterInputChange} />
              </div>
              {registerError && <div className="error-message">{registerError}</div>}
              <button type="submit" className="btn-submit" disabled={registerLoading}>
                {registerLoading ? 'Creating Account...' : 'Register'}
              </button>
              <div className="login-footer">
                <p>Already have an account?{' '}<span className="signup-link" onClick={switchToLogin}>Login here</span></p>
              </div>
            </form>
          </div>
        </div>
      )}
    </nav>
  )
}
