import React, { useState } from 'react';

const DEFAULT_QUERY = `query {
  products {
    id
    name
    price
    category
  }
}`;

export default function QueryEditor() {
  const [query, setQuery] = useState(DEFAULT_QUERY);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const executeQuery = async () => {
    setLoading(true);
    setResponse(null);
    const start = performance.now();
    try {
      const res = await fetch('http://localhost:4000/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      const data = await res.json();
      const timeMs = Math.round(performance.now() - start);
      setResponse(data);
      
      // Manually dispatch to Developer Panel to bypass Apollo Link caching/parsing
      const event = new CustomEvent('API_REQUEST', {
        detail: {
          id: crypto.randomUUID(),
          type: 'GRAPHQL',
          method: 'POST',
          endpoint: '/graphql (Editor)',
          status: res.ok && !data.errors ? 'Success' : 'Failed',
          statusCode: res.status,
          timeMs,
          payloadSize: new Blob([JSON.stringify(data)]).size,
          fieldCount: 0,
          rawRequest: `POST /graphql\n\n${query.trim()}`,
          responseBody: data
        }
      });
      window.dispatchEvent(event);
    } catch (err) {
      setResponse({ error: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="query-editor-container glass-panel">
      <div className="compare-header" style={{ marginBottom: '1.5rem', boxShadow: 'none' }}>
        <div>
          <h2>Custom GraphQL Editor</h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            Write any valid GraphQL query against the backend.
          </p>
        </div>
        <button 
          className="btn btn-primary" 
          onClick={executeQuery} 
          disabled={loading}
          style={{ padding: '0.75rem 2rem', fontSize: '1.1rem', background: 'linear-gradient(135deg, #b00092, #ff00d4)' }}
        >
          {loading ? 'Running...' : 'Run Query ▶'}
        </button>
      </div>

      <div className="split-screen" style={{ height: '500px' }}>
        <div className="editor-col">
          <div className="cv-header">
            <span className="dev-type-badge graphql">Query</span>
          </div>
          <textarea 
            className="query-textarea"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            spellCheck="false"
          />
        </div>
        
        <div className="editor-col">
          <div className="cv-header">
            <span className="dev-type-badge graphql" style={{ background: 'var(--bg-dark)' }}>Response</span>
          </div>
          <pre className="cv-pre" style={{ height: '100%', margin: 0, border: 'none', background: 'transparent' }}>
            {response ? JSON.stringify(response, null, 2) : 'Awaiting execution...'}
          </pre>
        </div>
      </div>
    </div>
  );
}
