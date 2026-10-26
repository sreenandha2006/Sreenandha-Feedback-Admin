import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Dashboard from './pages/Dashboard.jsx';
import AddFeedback from './pages/AddFeedback.jsx';

function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        {/* Navigation Bar */}
        <Navbar />

        {/* Main Routed Content Area */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/add" element={<AddFeedback />} />
            <Route path="/edit/:id" element={<AddFeedback />} />
            <Route
              path="*"
              element={
                <div className="container py-5 text-center">
                  <div className="display-1 text-danger fw-bold">404</div>
                  <h3 className="fw-bold text-dark mt-2">Page Not Found</h3>
                  <p className="text-muted">The page you are looking for does not exist.</p>
                  <Link to="/" className="btn btn-primary mt-2">
                    <i className="bi bi-arrow-left me-1"></i> Back to Dashboard
                  </Link>
                </div>
              }
            />
          </Routes>
        </main>

        {/* Modern Footer */}
        <footer className="admin-footer">
          <div className="container">
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2">
              <div>
                <strong>Sreenandha Feedback Admin Panel</strong> &copy; {new Date().getFullYear()}
              </div>
              <div className="text-muted small">
                ICT Academy of Kerala &bull; Full Stack Development Assessment
              </div>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
