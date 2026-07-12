import React, { createContext, useContext, useState, useEffect } from 'react';

const ApiContext = createContext();

export function ApiProvider({ children }) {
  const [apiMode, setApiMode] = useState(() => {
    try {
      return localStorage.getItem('apiMode') || 'GRAPHQL';
    } catch {
      return 'GRAPHQL';
    }
  }); 
  const [requestHistory, setRequestHistory] = useState([]);

  useEffect(() => {
    const handleApiRequest = (event) => {
      setRequestHistory((prev) => [event.detail, ...prev].slice(0, 50)); 
    };

    window.addEventListener('API_REQUEST', handleApiRequest);
    return () => window.removeEventListener('API_REQUEST', handleApiRequest);
  }, []);

  const toggleApiMode = () => {
    setApiMode((prev) => {
      const nextMode = prev === 'GRAPHQL' ? 'REST' : 'GRAPHQL';
      try {
        localStorage.setItem('apiMode', nextMode);
      } catch {
        // ignore quota errors
      }
      return nextMode;
    });
  };

  const clearHistory = () => {
    setRequestHistory([]);
  };

  return (
    <ApiContext.Provider value={{ apiMode, toggleApiMode, requestHistory, clearHistory }}>
      {children}
    </ApiContext.Provider>
  );
}

export function useApiMode() {
  return useContext(ApiContext);
}
