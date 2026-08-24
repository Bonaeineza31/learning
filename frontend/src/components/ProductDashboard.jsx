import { useState, useEffect } from 'preact/hooks'
import '../styles/ProductDashboard.css'

export function ProductDashboard({ userName, userRole, onLogout }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchProducts()
  }, [userRole])

  const fetchProducts = async () => {
    setLoading(true)
    setError('')
    try {
      const token = localStorage.getItem('authToken')
      const res = await fetch('/api/products', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
      })
      const data = await res.json()
      if (!res.ok) {
        if (res.status === 401) {
          setError('Session expired. Please login again.')
          onLogout()
          return
        }
        setError(data.message || 'Failed to fetch products')
        return
      }
      setProducts(data.data || [])
    } catch (err) {
      setError('Unable to reach server')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="dashboard-wrapper">
      <nav className="dashboard-navbar">
        <div className="dashboard-navbar-container">
          <div className="navbar-logo">
            <span className="logo-text">ContactHub</span>
          </div>
          <div className="dashboard-user-info">
            <span className="user-name">Welcome, {userName}!</span>
            <span className="user-role">Role: {userRole}</span>
            <button className="btn-logout" onClick={onLogout}>Logout</button>
          </div>
        </div>
      </nav>

      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Product List</h1>
        </div>

        {loading && <div className="loading">Loading products...</div>}
        {error && <div className="error-message">{error}</div>}

        <div className="products-grid">
          {products.length > 0 ? (
            products.map((product) => (
              <div key={product._id} className="product-card">
                <h3>{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <p className="product-price">${product.price}</p>
                <p className="product-stock">Stock: {product.quantity}</p>
                {userRole === 'admin' && (
                  <div className="admin-actions">
                    <button className="btn-edit">Edit</button>
                    <button className="btn-delete">Delete</button>
                  </div>
                )}
                {userRole !== 'admin' && (
                  <button className="btn-add-cart">Add to Cart</button>
                )}
              </div>
            ))
          ) : (
            <p className="no-products">No products available</p>
          )}
        </div>
      </div>
    </div>
  )
}