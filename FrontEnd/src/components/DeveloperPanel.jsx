import React, { useState } from 'react';
import { useApiMode } from '../context/ApiContext';

export default function DeveloperPanel() {
  const { requestHistory, clearHistory } = useApiMode();
  const [isOpen, setIsOpen] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const formatBytes = (bytes) => {
    if (bytes === 0 || !bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!isOpen) {
    return (
      <div className="dev-panel-toggle" onClick={() => setIsOpen(true)}>
        <span className="dev-icon">🧑‍💻</span>
        <div className="dev-toggle-text">Network Panel</div>
        {requestHistory.length > 0 && (
          <span className="dev-badge">{requestHistory.length}</span>
        )}
      </div>
    );
  }

  return (
    <div className="dev-panel">
      <div className="dev-panel-header">
        <h3>Network Activity</h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="dev-btn" onClick={clearHistory}>Clear</button>
          <button className="dev-btn" onClick={() => setIsOpen(false)}>Close</button>
        </div>
      </div>
      
      <div className="dev-panel-body">
        {requestHistory.length === 0 ? (
          <div className="dev-empty">No network requests yet.</div>
        ) : (
          requestHistory.map((req) => (
            <div key={req.id} className={`dev-request ${req.type.toLowerCase()}`}>
              <div className="dev-req-summary" onClick={() => toggleExpand(req.id)}>
                <div className="dev-req-top">
                  <span className={`dev-status ${req.status === 'Success' ? 'success' : 'failed'}`}>
                    {req.status === 'Success' ? `✓ ${req.statusCode} OK` : `✗ ${req.statusCode} Failed`}
                  </span>
                  <span className={`dev-type-badge ${req.type.toLowerCase()}`}>{req.type}</span>
                  <span className="dev-method">{req.method}</span>
                </div>
                <div className="dev-req-mid">
                  <span className="dev-endpoint">{req.endpoint}</span>
                </div>
                <div className="dev-req-bot">
                  <span>⏱ {req.timeMs} ms</span>
                  <span>📦 {formatBytes(req.payloadSize)}</span>
                  <span>📋 {req.fieldCount} fields</span>
                </div>
              </div>
              
              {expandedId === req.id && (
                <div className="dev-req-details">
                  <div className="dev-detail-section">
                    <h4>Live Request Viewer</h4>
                    <pre>{req.rawRequest}</pre>
                  </div>
                  <div className="dev-detail-section">
                    <h4>Response Body</h4>
                    <pre>{JSON.stringify(req.responseBody || {}, null, 2)}</pre>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
