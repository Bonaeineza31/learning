import { useEffect, useState } from 'preact/hooks'
import '../styles/Products.css'

const initialProductForm = { name: '', quantity: '' }

export function Products({ token, userRole }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [productsError, setProductsError] = useState('')
  const [form, setForm] = useState(initialProductForm)
  const [formImage, setFormImage] = useState(null)
  const [formImagePreview, setFormImagePreview] = useState('')
  const [formError, setFormError] = useState('')
  const [formLoading, setFormLoading] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState(initialProductForm)
  const [editImage, setEditImage] = useState(null)
  const [editImagePreview, setEditImagePreview] = useState('')
  const [editError, setEditError] = useState('')
  const [editLoading, setEditLoading] = useState(false)

  const isAdmin = userRole === 'admin'

  const authHeaders = () => ({ Authorization: `Bearer ${token}` })

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

  const handleImageChange = (e, isEdit = false) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      const errSetter = isEdit ? setEditError : setFormError
      errSetter('Please select a valid image file')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      const errSetter = isEdit ? setEditError : setFormError
      errSetter('Image must be less than 5MB')
      return
    }
    if (isEdit) {
      setEditImage(file)
      setEditImagePreview(URL.createObjectURL(file))
    } else {
      setFormImage(file)
      setFormImagePreview(URL.createObjectURL(file))
    }
  }

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
      const formData = new FormData()
      formData.append('name', name)
      formData.append('quantity', quantity)
      if (formImage) formData.append('image', formImage)

      const response = await fetch('/api/products', { method: 'POST', headers: authHeaders(), body: formData })
      const result = await response.json().catch(() => ({}))
      if (!response.ok) {
        if (Array.isArray(result.errors) && result.errors.length > 0) throw new Error(result.errors.join(', '))
        throw new Error(result.message || 'Failed to create product.')
      }
      setForm(initialProductForm)
      setFormImage(null)
      setFormImagePreview('')
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
    setEditImagePreview(product.image || '')
    setEditImage(null)
    setEditError('')
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditForm(initialProductForm)
    setEditImage(null)
    setEditImagePreview('')
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
      const formData = new FormData()
      formData.append('name', name)
      formData.append('quantity', quantity)
      if (editImage) formData.append('image', editImage)

      const response = await fetch(`/api/products/${editingId}`, { method: 'PUT', headers: authHeaders(), body: formData })
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
                <div class="field">
                  <label htmlFor="edit-image">Product Image</label>
                  <label class="file-label">
                    <input id="edit-image" type="file" accept="image/*" onChange={(e) => handleImageChange(e, true)} class="file-input" />
                    <span class="file-btn">Choose Image</span>
                    {editImage && <span class="file-name">{editImage.name}</span>}
                  </label>
                  {editImagePreview && <img src={editImagePreview} alt="Preview" class="image-preview" />}
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
                <div class="field">
                  <label htmlFor="create-image">Product Image</label>
                  <label class="file-label">
                    <input id="create-image" type="file" accept="image/*" onChange={(e) => handleImageChange(e, false)} class="file-input" />
                    <span class="file-btn">Choose Image</span>
                    {formImage && <span class="file-name">{formImage.name}</span>}
                  </label>
                  {formImagePreview && <img src={formImagePreview} alt="Preview" class="image-preview" />}
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
              <div class="product-grid">
                {products.map((product) => (
                  <div class="product-card" key={product._id}>
                    {product.image && (
                      <div class="product-image-wrap">
                        <img src={product.image} alt={product.name} class="product-image" />
                      </div>
                    )}
                    <div class="product-card-body">
                      <div class="product-card-info">
                        <span class="product-card-name">{product.name}</span>
                        <span class="product-card-qty">Qty: {product.quantity}</span>
                      </div>
                      {isAdmin && (
                        <div class="product-card-actions">
                          <button class="btn-edit" onClick={() => startEdit(product)}>Edit</button>
                          <button class="btn-delete" onClick={() => handleDelete(product._id)}>Delete</button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
