import React from 'react';
import { NavLink } from 'react-router-dom';
import { useApiMode } from '../context/ApiContext';

export default function Header() {
  const { apiMode, toggleApiMode } = useApiMode();

  return (
    <header className="app-header">
      <div className="brand-section">
        <h1 className="brand-title">Product Dashboard</h1>
        <span className="brand-subtitle">
          Active Backend:{' '}
          <span style={{
            color: apiMode === 'REST' ? '#00f0ff' : '#ff00d4',
            fontWeight: 'bold',
            transition: 'color 0.4s ease'
          }}>
            {apiMode}
          </span>
        </span>
      </div>

      <nav className="header-nav">
        <NavLink to="/crud" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>CRUD Demo</NavLink>
        <NavLink to="/compare" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <span className="nav-icon">⚖️</span>
          Compare Both
        </NavLink>
        <NavLink to="/overfetching" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <span className="nav-icon">📦</span>
          Over-fetching
        </NavLink>
        <NavLink to="/underfetching" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <span className="nav-icon">🔗</span>
          Under-fetching
        </NavLink>
        <NavLink to="/query-editor" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <span className="nav-icon">✍️</span>
          Query Editor
        </NavLink>
        <NavLink to="/docs" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <span className="nav-icon">📄</span>
          Docs
        </NavLink>
      </nav>

      <div className="api-toggle-container">
        <span className={`toggle-label ${apiMode === 'REST' ? 'active' : ''}`}>REST</span>
        <div
          className={`toggle-switch ${apiMode === 'GRAPHQL' ? 'graphql-active' : ''}`}
          onClick={toggleApiMode}
          title="Switch API Mode"
        >
          <div className="toggle-knob"></div>
        </div>
        <span className={`toggle-label ${apiMode === 'GRAPHQL' ? 'active' : ''}`}>GraphQL</span>
      </div>
    </header>
  );
}
