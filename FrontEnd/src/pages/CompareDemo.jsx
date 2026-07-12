import React, { useState } from 'react';
import { restApi } from '../services/restApi';
import { graphqlApi } from '../services/graphqlApi';

export default function CompareDemo() {
  const [loading, setLoading] = useState(false);
  const [restMetrics, setRestMetrics] = useState(null);
  const [graphqlMetrics, setGraphqlMetrics] = useState(null);
  const [error, setError] = useState(null);

  const formatBytes = (bytes) => {
    if (bytes === 0 || !bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const runComparison = async () => {
    setLoading(true);
    setError(null);
    setRestMetrics(null);
    setGraphqlMetrics(null);

    const compareReqId = crypto.randomUUID();
    let capturedRest = null;
    let capturedGql = null;

    const captureMetrics = (e) => {
      const { type, timeMs, payloadSize, fieldCount, responseBody, endpoint, originalReqId } = e.detail;
      
      if (originalReqId !== compareReqId) return;

      if (type === 'REST' && !capturedRest && endpoint === '/api/products') {
        capturedRest = { timeMs, payloadSize, fieldCount, data: responseBody };
        setRestMetrics(capturedRest);
      }
      if (type === 'GRAPHQL' && !capturedGql && endpoint.includes('GetProducts')) {
        capturedGql = { timeMs, payloadSize, fieldCount, data: responseBody };
        setGraphqlMetrics(capturedGql);
      }
    };

    window.addEventListener('API_REQUEST', captureMetrics);
    const cleanup = () => window.removeEventListener('API_REQUEST', captureMetrics);

    try {
      // Run both simultaneously
      await Promise.all([
        restApi.getProducts('', '', compareReqId),
        graphqlApi.getProducts('', '', compareReqId)
      ]);
    } catch (err) {
      setError(err.message || 'Comparison failed');
    } finally {
      cleanup();
      setLoading(false);
    }
  };

  const payloadReducedPercent = (restMetrics && graphqlMetrics) 
    ? Math.round(((restMetrics.payloadSize - graphqlMetrics.payloadSize) / restMetrics.payloadSize) * 100) 
    : 0;

  return (
    <div className="compare-demo-container">
      <div className="compare-header">
        <div>
          <h2>Side-by-Side Comparison</h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            Execute both APIs simultaneously to compare response times and payload sizes.
          </p>
        </div>
        <button 
          className="btn btn-primary" 
          onClick={runComparison} 
          disabled={loading}
          style={{ padding: '0.75rem 2rem', fontSize: '1.1rem' }}
        >
          {loading ? 'Running...' : 'Run Comparison ▶'}
        </button>
      </div>

      {error && (
        <div className="empty-state" style={{ padding: '2rem' }}>
          <span className="empty-state-icon" style={{ color: 'var(--danger)', fontSize: '2rem' }}>⚠️</span>
          <p style={{ color: 'var(--danger)' }}>{error}</p>
        </div>
      )}

      {restMetrics && graphqlMetrics && (
        <div className="metrics-banner" style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h3 style={{ color: 'var(--success)', fontSize: '1.5rem' }}>
            Payload Reduced by {payloadReducedPercent}% 🚀
          </h3>
          <p style={{ color: 'var(--text-secondary)' }}>Using GraphQL over REST for the exact same data requirement.</p>
        </div>
      )}

      <div className="split-screen">
        {/* REST Column */}
        <div className="compare-col rest-col">
          <div className="col-header">
            <h3>REST API</h3>
            <span className="dev-type-badge rest">GET /api/products</span>
          </div>
          
          <div className="metrics-cards">
            <div className="metric-card">
              <span className="metric-label">Time</span>
              <span className="metric-value">{restMetrics ? `${restMetrics.timeMs} ms` : '-'}</span>
            </div>
            <div className="metric-card">
              <span className="metric-label">Full Payload</span>
              <span className="metric-value">{restMetrics ? formatBytes(restMetrics.payloadSize) : '-'}</span>
            </div>
            <div className="metric-card">
              <span className="metric-label">Fields / Object</span>
              <span className="metric-value">{restMetrics ? restMetrics.fieldCount : '-'}</span>
            </div>
          </div>
          
          <div className="code-viewer">
            <h4>Raw JSON Response (Envelope)</h4>
            <pre>
              {restMetrics ? JSON.stringify(restMetrics.data, null, 2) : 'Awaiting execution...'}
            </pre>
          </div>
        </div>

        {/* GraphQL Column */}
        <div className="compare-col graphql-col">
          <div className="col-header">
            <h3>GraphQL API</h3>
            <span className="dev-type-badge graphql">POST /graphql</span>
          </div>
          
          <div className="metrics-cards">
            <div className="metric-card">
              <span className="metric-label">Time</span>
              <span className="metric-value">{graphqlMetrics ? `${graphqlMetrics.timeMs} ms` : '-'}</span>
            </div>
            <div className="metric-card">
              <span className="metric-label">Full Payload</span>
              <span className="metric-value" style={{ color: 'var(--success)' }}>
                {graphqlMetrics ? formatBytes(graphqlMetrics.payloadSize) : '-'}
              </span>
            </div>
            <div className="metric-card">
              <span className="metric-label">Fields / Object</span>
              <span className="metric-value">{graphqlMetrics ? graphqlMetrics.fieldCount : '-'}</span>
            </div>
          </div>

          <div className="code-viewer">
            <h4>Raw JSON Response (Envelope)</h4>
            <pre>
              {graphqlMetrics ? JSON.stringify(graphqlMetrics.data, null, 2) : 'Awaiting execution...'}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
