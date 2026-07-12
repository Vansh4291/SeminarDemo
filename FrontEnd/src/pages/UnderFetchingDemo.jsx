import React, { useState, useEffect } from 'react';
import { restApi } from '../services/restApi';
import { graphqlApi } from '../services/graphqlApi';

export default function UnderFetchingDemo() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [restData, setRestData] = useState(null);
  const [graphqlData, setGraphqlData] = useState(null);
  
  const [restTime, setRestTime] = useState(0);
  const [gqlTime, setGqlTime] = useState(0);
  
  const [testProductId, setTestProductId] = useState(null);

  useEffect(() => {
    // Fetch a product ID to test with on mount
    restApi.getProducts().then(res => {
      if (res.products && res.products.length > 0) {
        setTestProductId(res.products[0].id);
      }
    }).catch(err => console.error(err));
  }, []);

  const runDemo = async () => {
    if (!testProductId) {
      setError("No product found to test.");
      return;
    }
    
    setLoading(true);
    setError(null);
    setRestData(null);
    setGraphqlData(null);
    setRestTime(0);
    setGqlTime(0);

    const compareReqId = crypto.randomUUID();
    let restAccumulatedTime = 0;
    let gqlAccumulatedTime = 0;

    const captureMetrics = (e) => {
      const { type, timeMs, originalReqId } = e.detail;
      if (originalReqId !== compareReqId) return;

      if (type === 'REST') {
        restAccumulatedTime += timeMs;
        setRestTime(restAccumulatedTime);
      }
      if (type === 'GRAPHQL') {
        gqlAccumulatedTime += timeMs;
        setGqlTime(gqlAccumulatedTime);
      }
    };
    
    window.addEventListener('API_REQUEST', captureMetrics);
    const cleanup = () => window.removeEventListener('API_REQUEST', captureMetrics);

    try {
      // REST Execution
      // 1. Fetch Product
      const p = await restApi.getProductById(testProductId, compareReqId);
      
      // 2. We now have IDs, we must fetch relations (N+1 problem)
      const [c, s] = await Promise.all([
        p.categoryId ? restApi.getCategoryById(p.categoryId, compareReqId) : Promise.resolve(null),
        p.supplierId ? restApi.getSupplierById(p.supplierId, compareReqId) : Promise.resolve(null)
      ]);
      
      setRestData({
        product: p,
        category: c,
        supplier: s
      });

      // GraphQL Execution
      // 1. Fetch everything in exactly 1 request
      const gRes = await graphqlApi.getNestedProduct(testProductId, compareReqId);
      
      setGraphqlData(gRes);

    } catch (err) {
      setError(err.message || 'Demo failed');
    } finally {
      cleanup();
      setLoading(false);
    }
  };

  return (
    <div className="compare-demo-container">
      <div className="compare-header">
        <div>
          <h2>Under-fetching (N+1 Problem)</h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            Watch how REST requires 3 sequential round-trips to assemble a product page, while GraphQL gets exactly what it needs in 1 request.
          </p>
        </div>
        <button 
          className="btn btn-primary" 
          onClick={runDemo} 
          disabled={loading || !testProductId}
          style={{ padding: '0.75rem 2rem', fontSize: '1.1rem' }}
        >
          {loading ? 'Running...' : 'Run Demo ▶'}
        </button>
      </div>

      {error && (
        <div className="empty-state" style={{ padding: '2rem' }}>
          <span className="empty-state-icon" style={{ color: 'var(--danger)', fontSize: '2rem' }}>⚠️</span>
          <p style={{ color: 'var(--danger)' }}>{error}</p>
        </div>
      )}

      {restData && graphqlData && (
        <div className="metrics-banner" style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h3 style={{ color: 'var(--danger)', fontSize: '1.5rem' }}>
            REST Required 3 Requests 🛑
          </h3>
          <p style={{ color: 'var(--text-secondary)' }}>
            GraphQL assembled the exact same nested data in 1 request.
          </p>
        </div>
      )}

      <div className="split-screen">
        {/* REST Column */}
        <div className="compare-col rest-col">
          <div className="col-header">
            <h3>REST API</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '0.5rem' }}>
              <span className="dev-type-badge rest">GET /api/products/:id</span>
              <span className="dev-type-badge rest">GET /api/categories/:id</span>
              <span className="dev-type-badge rest">GET /api/suppliers/:id</span>
            </div>
          </div>
          
          <div className="metrics-cards">
            <div className="metric-card" style={{ flex: 1 }}>
              <span className="metric-label">Total Waterfall Time</span>
              <span className="metric-value" style={{ color: 'var(--danger)' }}>
                {restTime > 0 ? `${restTime} ms` : '-'}
              </span>
            </div>
          </div>
          
          <div className="code-viewer">
            <h4>Assembled Data (Client-Side)</h4>
            <pre>
              {restData ? JSON.stringify(restData, null, 2) : 'Awaiting execution...'}
            </pre>
          </div>
        </div>

        {/* GraphQL Column */}
        <div className="compare-col graphql-col">
          <div className="col-header">
            <h3>GraphQL API</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '0.5rem' }}>
              <span className="dev-type-badge graphql">POST /graphql (1 Request)</span>
              <span style={{ opacity: 0 }}>Spacer</span>
              <span style={{ opacity: 0 }}>Spacer</span>
            </div>
          </div>
          
          <div className="metrics-cards">
            <div className="metric-card" style={{ flex: 1 }}>
              <span className="metric-label">Total Time</span>
              <span className="metric-value" style={{ color: 'var(--success)' }}>
                {gqlTime > 0 ? `${gqlTime} ms` : '-'}
              </span>
            </div>
          </div>

          <div className="code-viewer">
            <h4>Nested Response</h4>
            <pre>
              {graphqlData ? JSON.stringify(graphqlData, null, 2) : 'Awaiting execution...'}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
