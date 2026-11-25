import { Link, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import BookDetail from './pages/BookDetail.jsx';

function App() {
  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="container header-inner">
          <Link to="/" className="brand-link">
            <span className="brand-mark" aria-hidden="true">
              A
            </span>
            <span className="brand-text">
              <span className="brand-title">Athenaeum</span>
              <span className="brand-subtitle">Public Lending Catalog</span>
            </span>
          </Link>
          <span className="header-meta">Collection Index</span>
        </div>
      </header>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/books/:id" element={<BookDetail />} />
        </Routes>
      </main>

      <footer className="site-footer">
        <div className="container footer-inner">
          <span>Athenaeum Library Management System</span>
          <span>Catalog &amp; Circulation Desk</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
