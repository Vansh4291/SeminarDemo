import React, { useState } from 'react';

export default function CodeViewer({ restRequest, restResponse, graphqlRequest, graphqlResponse }) {
  console.log("[CodeViewer] Rendering", { 
    hasRestReq: !!restRequest, 
    hasRestRes: !!restResponse, 
    hasGqlReq: !!graphqlRequest, 
    hasGqlRes: !!graphqlResponse 
  });
  const [activeTab, setActiveTab] = useState('request'); // 'request' or 'response'

  return (
    <div className="code-viewer-component">
      <div className="code-viewer-tabs">
        <button 
          className={`cv-tab ${activeTab === 'request' ? 'active' : ''}`}
          onClick={() => setActiveTab('request')}
        >
          Request
        </button>
        <button 
          className={`cv-tab ${activeTab === 'response' ? 'active' : ''}`}
          onClick={() => setActiveTab('response')}
        >
          Response
        </button>
      </div>

      <div className="code-viewer-content split-screen">
        <div className="cv-col rest-col">
          <div className="cv-header">
            <span className="dev-type-badge rest">REST</span>
          </div>
          <pre className="cv-pre">
            {activeTab === 'request' ? restRequest : restResponse}
          </pre>
        </div>
        
        <div className="cv-col graphql-col">
          <div className="cv-header">
            <span className="dev-type-badge graphql">GraphQL</span>
          </div>
          <pre className="cv-pre">
            {activeTab === 'request' ? graphqlRequest : graphqlResponse}
          </pre>
        </div>
      </div>
    </div>
  );
}
