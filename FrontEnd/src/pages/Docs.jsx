import React from 'react';

export default function Docs() {
  return (
    <div className="compare-demo-container" style={{ overflowY: 'auto' }}>
      <div className="compare-header" style={{ boxShadow: 'none' }}>
        <div>
          <h2>API Documentation & Architecture</h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            Cheat sheet for the Viva and project overview.
          </p>
        </div>
      </div>

      <div className="docs-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        
        <div className="compare-col rest-col" style={{ padding: '2rem' }}>
          <h3>REST Architecture</h3>
          <p>Traditional multi-endpoint architecture. Clients must stitch data together from multiple requests.</p>
          <hr style={{ borderColor: 'var(--border-color)', margin: '1rem 0' }}/>
          
          <h4>Endpoints</h4>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <li>
              <span className="dev-type-badge rest">GET /api/products</span>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Fetch all products (can be filtered by ?search and ?category)</p>
            </li>
            <li>
              <span className="dev-type-badge rest">GET /api/products/:id</span>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Fetch single product</p>
            </li>
            <li>
              <span className="dev-type-badge rest">POST /api/products</span>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Create a new product</p>
            </li>
            <li>
              <span className="dev-type-badge rest">GET /api/categories/:id</span>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Fetch category details (Under-fetching demo)</p>
            </li>
            <li>
              <span className="dev-type-badge rest">GET /api/suppliers/:id</span>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Fetch supplier details (Under-fetching demo)</p>
            </li>
          </ul>
        </div>

        <div className="compare-col graphql-col" style={{ padding: '2rem' }}>
          <h3>GraphQL Architecture</h3>
          <p>Single-endpoint architecture. Clients ask for exactly what they want in one request.</p>
          <hr style={{ borderColor: 'var(--border-color)', margin: '1rem 0' }}/>
          
          <h4>Endpoint</h4>
          <div style={{ marginBottom: '1.5rem' }}>
            <span className="dev-type-badge graphql">POST /graphql</span>
          </div>

          <h4>Core Types</h4>
          <pre style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', fontSize: '0.9rem', color: '#a5b4fc' }}>
{`type Product {
  id: ID!
  name: String!
  price: Float!
  category: String!
  categoryDetails: Category
  supplier: Supplier
  stock: Int!
}

type Category {
  id: ID!
  name: String!
}

type Supplier {
  id: ID!
  name: String!
  contact: String
}`}
          </pre>
        </div>

      </div>

      <div className="architecture-visual" style={{ 
        marginTop: '2rem', 
        padding: '2rem', 
        background: 'rgba(2, 6, 23, 0.6)', 
        borderRadius: 'var(--border-radius-lg)', 
        border: '1px solid var(--border-color)',
        textAlign: 'center'
      }}>
        <h3 style={{ marginBottom: '1.5rem' }}>The Paradigm Shift: Endpoints vs Graph</h3>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '3rem', flexWrap: 'wrap' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
            <h4 style={{ color: 'var(--text-secondary)' }}>REST (Many Endpoints)</h4>
            <div style={{ border: '1px dashed #ef4444', padding: '1rem', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.1)' }}>
              <code>GET /products</code><br/>
              <code>GET /products/:id</code><br/>
              <code>GET /categories/:id</code><br/>
              <code>GET /suppliers/:id</code>
            </div>
            <span style={{ fontSize: '1.5rem' }}>🔄</span>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Multiple round-trips over the network.</p>
          </div>

          <div style={{ fontSize: '3rem', color: 'var(--border-color)' }}>➔</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
            <h4 style={{ color: 'var(--text-secondary)' }}>GraphQL (One Endpoint)</h4>
            <div style={{ border: '1px dashed #10b981', padding: '1rem', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.1)' }}>
              <code>POST /graphql</code>
            </div>
            <span style={{ fontSize: '1.5rem' }}>📦</span>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>One request. Exactly the data you ask for.</p>
          </div>

        </div>
      </div>
    </div>
  );
}
