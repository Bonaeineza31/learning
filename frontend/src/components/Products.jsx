import { useEffect, useState } from 'preact/hooks'
import '../styles/Products.css'

const initialProductForm = { name: '', quantity: '' }

export function Products({ token, userRole }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [productsError, setProductsError] = useState('')
  const [form, setForm] = useState(initialProductForm)
  const [formError, setFormError] = useState('')
  const [formLoading, setFormLoading] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState(initialProductForm)
  const [editError, setEditError] = useState('')
  const [editLoading, setEditLoading] = useState(false)

  const isAdmin = userRole === 'admin'

  const authHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  })

  const loadProducts = async () => {
    try {
      setLoading(true)
      setProductsError('')
      const response = await fetch('/api/products', { headers: { Accept: 'application/json', Authorization: `Bearer ${token}` } })
      const result = await response.json().catch(() => ({ success: false, data: [] }))
      if (!response.ok) throw new Error(result.message || 'Failed to load products.')
      setProducts(Array.isArray(result.data) ? result.data : [])
    } catch (error) {
      setProductsError(error.message || 'Unable to load products.')
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) loadProducts()
  }, [token])

  const handleCreate = async (e) => {
    e.preventDefault()
    setFormError('')

    const name = form.name.trim()
    const quantity = form.quantity === '' ? '' : Number(form.quantity)

    if (!name) { setFormError('Product name is required'); return }
    if (form.quantity === '' || isNaN(quantity) || quantity < 0) {
      setFormError('Quantity must be a non-negative number'); return
    }

    setFormLoading(true)
    try {
      const response = await fetch('/api/products', { method: 'POST', headers: authHeaders(), body: JSON.stringify({ name, quantity }) })
      const result = await response.json().catch(() => ({}))
      if (!response.ok) {
        if (Array.isArray(result.errors) && result.errors.length > 0) throw new Error(result.errors.join(', '))
        throw new Error(result.message || 'Failed to create product.')
      }
      setForm(initialProductForm)
      await loadProducts()
    } catch (error) {
      setFormError(error.message)
    } finally {
      setFormLoading(false)
    }
  }

  const startEdit = (product) => {
    setEditingId(product._id)
    setEditForm({ name: product.name, quantity: String(product.quantity) })
    setEditError('')
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditForm(initialProductForm)
    setEditError('')
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    setEditError('')

    const name = editForm.name.trim()
    const quantity = editForm.quantity === '' ? '' : Number(editForm.quantity)

    if (!name) { setEditError('Product name is required'); return }
    if (editForm.quantity === '' || isNaN(quantity) || quantity < 0) {
      setEditError('Quantity must be a non-negative number'); return
    }

    setEditLoading(true)
    try {
      const response = await fetch(`/api/products/${editingId}`, { method: 'PUT', headers: authHeaders(), body: JSON.stringify({ name, quantity }) })
      const result = await response.json().catch(() => ({}))
      if (!response.ok) {
        if (Array.isArray(result.errors) && result.errors.length > 0) throw new Error(result.errors.join(', '))
        throw new Error(result.message || 'Failed to update product.')
      }
      cancelEdit()
      await loadProducts()
    } catch (error) {
      setEditError(error.message)
    } finally {
      setEditLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    try {
      const response = await fetch(`/api/products/${id}`, { method: 'DELETE', headers: authHeaders() })
      const result = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(result.message || 'Failed to delete product.')
      await loadProducts()
    } catch (error) {
      alert(error.message)
    }
  }

  return (
    <section class="products-section" id="products">
      <div class="products-shell">
        <div class="products-header">
          <p class="eyebrow">Products</p>
          <h2>Product Inventory</h2>
          <p class="intro">Manage your product stock. All users can view and create products. Only admins can edit or delete.</p>
        </div>

        <div class="products-layout">
          <div class="product-form-card">
            <h3>{editingId ? 'Edit Product' : 'Add New Product'}</h3>

            {editingId ? (
              <form class="product-form" onSubmit={handleUpdate}>
                <div class="field">
                  <label htmlFor="edit-name">Product Name</label>
                  <input id="edit-name" type="text" value={editForm.name} onInput={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))} placeholder="Product name" class="input" />
                </div>
                <div class="field">
                  <label htmlFor="edit-quantity">Quantity</label>
                  <input id="edit-quantity" type="number" min="0" value={editForm.quantity} onInput={(e) => setEditForm((p) => ({ ...p, quantity: e.target.value }))} placeholder="0" class="input" />
                </div>
                {editError && <div class="form-error">{editError}</div>}
                <div class="form-actions">
                  <button type="submit" class="btn-primary" disabled={editLoading}>
                    {editLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button type="button" class="btn-secondary" onClick={cancelEdit}>Cancel</button>
                </div>
              </form>
            ) : (
              <form class="product-form" onSubmit={handleCreate}>
                <div class="field">
                  <label htmlFor="create-name">Product Name</label>
                  <input id="create-name" type="text" value={form.name} onInput={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="Product name" class="input" />
                </div>
                <div class="field">
                  <label htmlFor="create-quantity">Quantity</label>
                  <input id="create-quantity" type="number" min="0" value={form.quantity} onInput={(e) => setForm((p) => ({ ...p, quantity: e.target.value }))} placeholder="0" class="input" />
                </div>
                {formError && <div class="form-error">{formError}</div>}
                <button type="submit" class="btn-primary" disabled={formLoading}>
                  {formLoading ? 'Adding...' : 'Add Product'}
                </button>
              </form>
            )}
          </div>

          <div class="product-list-card">
            <div class="list-header">
              <h3>All Products</h3>
              <span class="count-badge">{products.length}</span>
            </div>

            {loading && <p class="list-status">Loading products...</p>}
            {!loading && productsError && <div class="form-error">{productsError}</div>}
            {!loading && !productsError && products.length === 0 && (
              <p class="list-status">No products yet. Add one above.</p>
            )}

            {!loading && !productsError && products.length > 0 && (
              <div class="product-table-wrap">
                <table class="product-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Quantity</th>
                      {isAdmin && <th>Actions</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product._id}>
                        <td class="product-name">{product.name}</td>
                        <td class="product-qty">{product.quantity}</td>
                        {isAdmin && (
                          <td class="product-actions">
                            <button class="btn-edit" onClick={() => startEdit(product)}>Edit</button>
                            <button class="btn-delete" onClick={() => handleDelete(product._id)}>Delete</button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
