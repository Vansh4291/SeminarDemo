import React, { useState, useEffect } from 'react';
import { restApi } from '../services/restApi';
import { graphqlApi } from '../services/graphqlApi';
import CodeViewer from '../components/CodeViewer';

export default function OverFetchingDemo() {
  const [loading, setLoading] = useState(false);
  const [sampleId, setSampleId] = useState(null);
  const [restData, setRestData] = useState(null);
  const [gqlData, setGqlData] = useState(null);
  const [restSize, setRestSize] = useState(0);
  const [gqlSize, setGqlSize] = useState(0);

  // Fetch a sample product ID on mount
  useEffect(() => {
    restApi.getProducts().then(res => {
      if (res.products && res.products.length > 0) {
        setSampleId(res.products[0].id);
      }
    });
  }, []);

  const calculateSize = (obj) => new Blob([JSON.stringify(obj || {})]).size;

  const runDemo = async () => {
    if (!sampleId) return;
    
    setLoading(true);
    setRestData(null);
    setGqlData(null);
    
    try {
      // For REST, we have no choice but to get the whole object
      const restProduct = await restApi.getProductById(sampleId);
      setRestData(restProduct);
      setRestSize(calculateSize(restProduct));

      // For GraphQL, we specify exactly what we want
      const gqlProduct = await graphqlApi.getOptimizedProduct(sampleId);
      setGqlData(gqlProduct);
      setGqlSize(calculateSize(gqlProduct));
    } catch (err) {
      console.error("Error fetching demo data:", err);
    } finally {
      setLoading(false);
    }
  };

  const restReqString = `GET /api/products/${sampleId || ':id'}`;
  const gqlReqString = `query GetOptimizedProduct($id: ID!) {\n  product(id: $id) {\n    name\n    price\n  }\n}\n\nVariables:\n{\n  "id": "${sampleId || ':id'}"\n}`;

  return (
    <div className="crud-demo-container">
      <div className="compare-header">
        <div>
          <h2>Over-fetching Demo</h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            Requirement: We only need the product's <strong>name</strong> and <strong>price</strong>.
          </p>
        </div>
        <button 
          className="btn btn-primary" 
          onClick={runDemo} 
          disabled={loading || !sampleId}
          style={{ padding: '0.75rem 2rem', fontSize: '1.1rem' }}
        >
          {loading ? 'Running...' : 'Run Demo ▶'}
        </button>
      </div>

      {restData && gqlData && (
        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Visual Payload Bars */}
          <div className="payload-bars">
            <div className="payload-row">
              <div className="payload-label">REST Payload ({restSize} Bytes)</div>
              <div className="payload-bar rest-bar" style={{ width: '100%' }}></div>
            </div>
            
            <div className="payload-row">
              <div className="payload-label">GraphQL Payload ({gqlSize} Bytes)</div>
              <div className="payload-bar graphql-bar" style={{ width: `${Math.max((gqlSize / restSize) * 100, 5)}%` }}></div>
            </div>
          </div>

          {/* Code Viewer */}
          <CodeViewer 
            restRequest={restReqString}
            graphqlRequest={gqlReqString}
            restResponse={JSON.stringify(restData, null, 2)}
            graphqlResponse={JSON.stringify(gqlData, null, 2)}
          />

        </div>
      )}
    </div>
  );
}
