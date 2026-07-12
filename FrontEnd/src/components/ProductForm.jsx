import React, { useState, useEffect } from 'react';

export default function ProductForm({ product, onSubmit, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    description: '',
  });
  
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        category: product.category || '',
        price: product.price !== undefined ? product.price.toString() : '',
        stock: product.stock !== undefined ? product.stock.toString() : '',
        description: product.description || '',
      });
    } else {
      setFormData({
        name: '',
        category: '',
        price: '',
        stock: '',
        description: '',
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear validation error on type
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Product Name is required';
    if (!formData.category.trim()) newErrors.category = 'Category is required';
    
    const priceNum = parseFloat(formData.price);
    if (isNaN(priceNum)) {
      newErrors.price = 'Price is required';
    } else if (priceNum < 0) {
      newErrors.price = 'Price cannot be negative';
    }

    const stockNum = parseInt(formData.stock, 10);
    if (isNaN(stockNum)) {
      newErrors.stock = 'Stock level is required';
    } else if (stockNum < 0) {
      newErrors.stock = 'Stock cannot be negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      name: formData.name.trim(),
      category: formData.category.trim(),
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock, 10),
      description: formData.description.trim(),
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">
            {product ? 'Edit Product' : 'Add New Product'}
          </h3>
          <button className="modal-close" onClick={onClose}>🗙</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-grid">
              
              <div className="form-group full-width">
                <label className="form-label" htmlFor="name">Product Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Mechanical Keyboard"
                  style={errors.name ? { borderColor: 'var(--danger)' } : {}}
                />
                {errors.name && <span style={{ color: 'var(--danger)', fontSize: '0.8rem' }}>{errors.name}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="category">Category *</label>
                <input
                  type="text"
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="e.g. Electronics"
                  style={errors.category ? { borderColor: 'var(--danger)' } : {}}
                />
                {errors.category && <span style={{ color: 'var(--danger)', fontSize: '0.8rem' }}>{errors.category}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="price">Price (₹) *</label>
                <input
                  type="number"
                  step="0.01"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  style={errors.price ? { borderColor: 'var(--danger)' } : {}}
                />
                {errors.price && <span style={{ color: 'var(--danger)', fontSize: '0.8rem' }}>{errors.price}</span>}
              </div>

              <div className="form-group full-width">
                <label className="form-label" htmlFor="stock">Stock Level *</label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="0"
                  style={errors.stock ? { borderColor: 'var(--danger)' } : {}}
                />
                {errors.stock && <span style={{ color: 'var(--danger)', fontSize: '0.8rem' }}>{errors.stock}</span>}
              </div>

              <div className="form-group full-width">
                <label className="form-label" htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Optional details about this item..."
                />
              </div>

            </div>
          </div>
          <div className="form-actions modal-header" style={{ borderTop: '1px solid var(--border-color)', borderBottom: 'none' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {product ? 'Save Changes' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
