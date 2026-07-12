import React from 'react';

export function formatIndianCurrency(value) {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)}Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(2)}L`;
  if (value >= 1000) return `₹${(value / 1000).toFixed(2)}K`;
  return `₹${value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function Stats({ products = [] }) {
  const totalProducts = products.length;
  
  const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
  
  const outOfStock = products.filter(p => p.stock === 0).length;
  
  const categories = new Set(products.map(p => p.category)).size;

  return (
    <div className="stats-grid">
      <div className="glass-panel stat-card">
        <div className="stat-icon-container primary">
          📦
        </div>
        <div className="stat-content">
          <span className="stat-value" title={totalProducts.toLocaleString()}>{totalProducts > 1000 ? `${(totalProducts/1000).toFixed(1)}K` : totalProducts}</span>
          <span className="stat-label">Total Products</span>
        </div>
      </div>

      <div className="glass-panel stat-card">
        <div className="stat-icon-container success">
          💰
        </div>
        <div className="stat-content">
          <span 
            className="stat-value" 
            title={`₹${totalValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          >
            {formatIndianCurrency(totalValue)}
          </span>
          <span className="stat-label">Inventory Value</span>
        </div>
      </div>

      <div className="glass-panel stat-card">
        <div className="stat-icon-container warning">
          🏷️
        </div>
        <div className="stat-content">
          <span className="stat-value">{categories}</span>
          <span className="stat-label">Active Categories</span>
        </div>
      </div>

      <div className="glass-panel stat-card">
        <div className="stat-icon-container danger">
          ⚠️
        </div>
        <div className="stat-content">
          <span className="stat-value">{outOfStock}</span>
          <span className="stat-label">Out of Stock</span>
        </div>
      </div>
    </div>
  );
}
