import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ApiProvider } from './context/ApiContext';
import Header from './components/Header';
import CrudDemo from './pages/CrudDemo';
import CompareDemo from './pages/CompareDemo';
import OverFetchingDemo from './pages/OverFetchingDemo';
import UnderFetchingDemo from './pages/UnderFetchingDemo';
import QueryEditor from './pages/QueryEditor';
import Docs from './pages/Docs';
import DeveloperPanel from './components/DeveloperPanel';

const pages = [
  { path: '/crud', name: 'CRUD Foundation' },
  { path: '/compare', name: 'Side-by-Side Comparison' },
  { path: '/overfetching', name: 'Over-fetching Demo' },
  { path: '/underfetching', name: 'Under-fetching Demo' },
  { path: '/query-editor', name: 'Interactive Query Editor' },
  { path: '/docs', name: 'Architecture & API Docs' }
];

function SeminarFooter() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentIndex = pages.findIndex(p => p.path === location.pathname);

  if (currentIndex === -1) return null;

  const prev = currentIndex > 0 ? pages[currentIndex - 1] : null;
  const next = currentIndex < pages.length - 1 ? pages[currentIndex + 1] : null;

  return (
    <div className="seminar-footer">
      <div className="footer-content">
         <div className="seminar-indicator">
           <span className="pulse-dot"></span>
           <span>Seminar Mode Live</span>
         </div>
         <div className="nav-buttons">
           {prev ? <button className="btn-nav" onClick={() => navigate(prev.path)}>◀ {prev.name}</button> : <div style={{width: '120px'}}/>}
           <span className="page-indicator">{currentIndex + 1} / {pages.length}</span>
           {next ? <button className="btn-nav" onClick={() => navigate(next.path)}>{next.name} ▶</button> : <div style={{width: '120px'}}/>}
         </div>
      </div>
    </div>
  );
}

// Layout component that includes the Header
function Layout({ children }) {
  return (
    <div className="app-container">
      <Header />
      <main style={{ paddingBottom: '80px' }}>
        {children}
      </main>
      <SeminarFooter />
      <DeveloperPanel />
    </div>
  );
}

export default function App() {
  return (
    <ApiProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/crud" replace />} />
            <Route path="/crud" element={<CrudDemo />} />
            <Route path="/compare" element={<CompareDemo />} />
            <Route path="/overfetching" element={<OverFetchingDemo />} />
            <Route path="/underfetching" element={<UnderFetchingDemo />} />
            <Route path="/query-editor" element={<QueryEditor />} />
            <Route path="/docs" element={<Docs />} />
            {/* Future pages will be added here */}
          </Routes>
        </Layout>
      </BrowserRouter>
    </ApiProvider>
  );
}
