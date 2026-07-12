import React, { useState, useEffect, useCallback } from 'react';
import Stats from '../components/Stats';
import ProductForm from '../components/ProductForm';
import Toast from '../components/Toast';
import { useApi } from '../hooks/useApi';
import { useApiMode } from '../context/ApiContext';
import { generateDummyProducts } from '../utils/dummyProducts';

export default function CrudDemo() {
  const api = useApi();
  const { apiMode } = useApiMode(); // Triggers re-render when mode changes
  
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  
  // UI states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProductId, setDeletingProductId] = useState(null);
  const [toast, setToast] = useState(null);
  const [isBulkLoading, setIsBulkLoading] = useState(false);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [bulkInsertCount, setBulkInsertCount] = useState(5000);

  // Data states
  const [data, setData] = useState({ products: [], categories: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getProducts(searchTerm, categoryFilter);
      setData(res);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [api, searchTerm, categoryFilter]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts, apiMode]);

  const showToast = (message, type) => {
    setToast({ message, type });
  };

  const handleOpenCreateForm = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingProduct) {
        await api.updateProduct(editingProduct.id, {
          name: formData.name,
          description: formData.description,
          price: formData.price,
          stock: formData.stock,
          category: formData.category,
        });
        showToast('Product updated successfully!', 'success');
      } else {
        await api.createProduct(formData);
        showToast('Product created successfully!', 'success');
      }
      setIsFormOpen(false);
      fetchProducts();
    } catch (err) {
      showToast(err.message || 'Operation failed', 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (deletingProductId) {
      try {
        await api.deleteProduct(deletingProductId);
        showToast('Product deleted successfully!', 'success');
        fetchProducts();
      } catch (err) {
        showToast(err.message || 'Failed to delete product', 'error');
      }
      setDeletingProductId(null);
    }
  };

  const handleBulkInsert = async () => {
    if (isBulkLoading) return;
    setIsBulkLoading(true);
    try {
      const dummyProducts = generateDummyProducts(bulkInsertCount);
      const start = performance.now();
      const res = await api.bulkInsertProducts(dummyProducts);
      const end = performance.now();
      const duration = ((end - start) / 1000).toFixed(2);
      
      showToast(`${res.message} (in ${duration}s)`, 'success');
      fetchProducts();
    } catch (err) {
      showToast(err.message || 'Bulk insert failed', 'error');
    } finally {
      setIsBulkLoading(false);
    }
  };

  const handleBulkDeleteConfirm = async () => {
    if (isBulkLoading) return;
    setIsBulkLoading(true);
    setIsBulkDeleteModalOpen(false);
    try {
      const start = performance.now();
      const res = await api.deleteAllProducts();
      const end = performance.now();
      const duration = ((end - start) / 1000).toFixed(2);
      
      showToast(`${res.message} (in ${duration}s)`, 'success');
      fetchProducts();
    } catch (err) {
      showToast(err.message || 'Bulk delete failed', 'error');
    } finally {
      setIsBulkLoading(false);
    }
  };

  const getStockBadge = (stock) => {
    if (stock === 0) return <span className="status-badge out-of-stock">Out of Stock</span>;
    if (stock <= 5) return <span className="status-badge low-stock">Low Stock ({stock})</span>;
    return <span className="status-badge in-stock">In Stock ({stock})</span>;
  };

  const productsList = data?.products || [];
  const activeCategories = data?.categories || [];

  return (
    <div className="crud-demo-container">
      {/* Top action bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
        <h2>Product Management</h2>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <select 
            className="select-control" 
            style={{ padding: '0.4rem' }}
            value={bulkInsertCount} 
            onChange={(e) => setBulkInsertCount(Number(e.target.value))}
            disabled={isBulkLoading}
          >
            <option value={100}>100</option>
            <option value={500}>500</option>
            <option value={1000}>1000</option>
            <option value={5000}>5000</option>
          </select>
          <button className="btn btn-secondary" onClick={handleBulkInsert} disabled={isBulkLoading}>
            <span>{isBulkLoading ? 'Inserting...' : `Insert ${bulkInsertCount} Records`}</span>
          </button>
          <button className="btn btn-danger" onClick={() => setIsBulkDeleteModalOpen(true)} disabled={isBulkLoading}>
            <span>{isBulkLoading ? 'Deleting...' : 'Delete All Records'}</span>
          </button>
          <button className="btn btn-primary" onClick={handleOpenCreateForm} disabled={isBulkLoading}>
            <span>+ Add Product</span>
          </button>
        </div>
      </div>

      <Stats products={productsList} />

      {/* Toolbar filters */}
      <div className="glass-panel toolbar-section">
        <div className="search-filter-group">
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="form-control"
              placeholder="Search products by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="select-control"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="All">All Categories</option>
            {activeCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Content Section */}
      <div className="glass-panel">
        {loading && productsList.length === 0 ? (
          <div className="page-loader">
            <div className="big-spinner"></div>
            <p style={{ color: 'var(--text-secondary)' }}>Loading inventory via {apiMode}...</p>
          </div>
        ) : error ? (
          <div className="empty-state">
            <span className="empty-state-icon" style={{ color: 'var(--danger)' }}>⚠️</span>
            <h3 className="empty-state-title">Connection Error</h3>
            <p className="empty-state-text">
              Failed to load products. Make sure your {apiMode} backend is running and MongoDB is connected.
            </p>
            <button className="btn btn-secondary" onClick={fetchProducts}>
              Retry Connection
            </button>
          </div>
        ) : productsList.length === 0 ? (
          <div className="empty-state">
            <span className="empty-state-icon">📦</span>
            <h3 className="empty-state-title">No Products Found</h3>
            <p className="empty-state-text">
              {searchTerm || categoryFilter !== 'All'
                ? "No items match your active search filter settings."
                : "Your inventory is currently empty. Get started by adding a product!"}
            </p>
            {!searchTerm && categoryFilter === 'All' && (
              <button className="btn btn-primary" onClick={handleOpenCreateForm}>
                Create First Product
              </button>
            )}
          </div>
        ) : (
          <div className="table-container">
            <table className="product-table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock Level</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {productsList.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <div style={{ fontWeight: 600, color: '#fff' }}>{product.name}</div>
                      {product.description && (
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                          {product.description}
                        </div>
                      )}
                    </td>
                    <td>
                      <span className="category-badge">{product.category}</span>
                    </td>
                    <td>
                      <span className="price-tag">₹{product.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </td>
                    <td>{getStockBadge(product.stock)}</td>
                    <td>
                      <div className="action-buttons" style={{ justifyContent: 'flex-end' }}>
                        <button
                          className="btn btn-secondary btn-icon"
                          title="Edit Product"
                          onClick={() => handleOpenEditForm(product)}
                        >
                          ✏️
                        </button>
                        <button
                          className="btn btn-danger btn-icon"
                          title="Delete Product"
                          onClick={() => setDeletingProductId(product.id)}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Form Modal */}
      {isFormOpen && (
        <ProductForm
          product={editingProduct}
          onSubmit={handleFormSubmit}
          onClose={() => setIsFormOpen(false)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingProductId && (
        <div className="modal-overlay" onClick={() => setDeletingProductId(null)}>
          <div className="modal-content confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Delete Product</h3>
              <button className="modal-close" onClick={() => setDeletingProductId(null)}>🗙</button>
            </div>
            <div className="modal-body">
              <p className="confirm-text">
                Are you sure you want to delete this product? This action is permanent and cannot be undone.
              </p>
            </div>
            <div className="modal-actions modal-header" style={{ borderTop: '1px solid var(--border-color)', borderBottom: 'none' }}>
              <button className="btn btn-secondary" onClick={() => setDeletingProductId(null)}>
                Cancel
              </button>
              <button className="btn btn-primary" style={{ background: 'var(--danger-light)', color: 'var(--danger)', border: '1px solid rgba(244,63,94,0.3)' }} onClick={handleDeleteConfirm}>
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Delete Confirmation Modal */}
      {isBulkDeleteModalOpen && (
        <div className="modal-overlay" onClick={() => setIsBulkDeleteModalOpen(false)}>
          <div className="modal-content confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Delete All Products</h3>
              <button className="modal-close" onClick={() => setIsBulkDeleteModalOpen(false)}>🗙</button>
            </div>
            <div className="modal-body">
              <p className="confirm-text">
                Are you sure you want to delete ALL products? This action is permanent and cannot be undone.
              </p>
            </div>
            <div className="modal-actions modal-header" style={{ borderTop: '1px solid var(--border-color)', borderBottom: 'none' }}>
              <button className="btn btn-secondary" onClick={() => setIsBulkDeleteModalOpen(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" style={{ background: 'var(--danger-light)', color: 'var(--danger)', border: '1px solid rgba(244,63,94,0.3)' }} onClick={handleBulkDeleteConfirm}>
                Confirm Delete All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="toast-container">
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        </div>
      )}
    </div>
  );
}
