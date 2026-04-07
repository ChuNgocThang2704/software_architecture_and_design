import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ToursPage from './pages/ToursPage';
import BookingPage from './pages/BookingPage';
import AddPartnerPage from './pages/AddPartnerPage.jsx';
import TicketDetailsPage from './pages/TicketDetailsPage';
import PartnerPage from "./pages/PartnerPage.jsx";

function App() {
  const [user, setUser] = useState(null);

  const handleLoginSuccess = (loggedInUser) => {
    sessionStorage.setItem('user', JSON.stringify(loggedInUser));
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    setUser(null);
  };

  useEffect(() => {
    const loggedInUser = sessionStorage.getItem('user');
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
  }, []);

  return (
      <BrowserRouter>
        <div style={styles.appContainer}>
          <header style={styles.header}>
            <Link to="/" style={styles.headerTitleLink}>
              <h1 style={styles.headerTitle}>Hệ thống Quản lý Du lịch</h1>
            </Link>
          </header>
          <main style={styles.mainContent}>
            <Routes>
              <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />

              <Route path="/" element={user ? <HomePage /> : <Navigate to="/login" />} />
              <Route path="/tours" element={user ? <ToursPage /> : <Navigate to="/login" />} />
              <Route path="/booking/:tourId" element={user ? <BookingPage user={user} /> : <Navigate to="/login" />} />
              <Route path="/partners" element={user ? <PartnerPage /> : <Navigate to="/login" />} />
              <Route path="/partners/add" element={user ? <AddPartnerPage /> : <Navigate to="/login" />} />
              <Route path="/ticket/:ticketId" element={user ? <TicketDetailsPage /> : <Navigate to="/login" />} />

              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
  );
}

const styles = {
  appContainer: {
    fontFamily: "'Inter', sans-serif",
    backgroundColor: '#f3f6fb',
    minHeight: '100svh',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    padding: '0 24px 24px',
    boxSizing: 'border-box',
    gap: '20px',
  },
  header: {
    backgroundColor: '#ffffff',
    padding: '0 40px',
    height: '70px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    flexShrink: 0,
  },
  headerTitle: {
    fontSize: '22px',
    color: '#0062cc',
    fontWeight: '700',
    margin: 0,
  },
  headerTitleLink: { textDecoration: 'none' },
  userInfo: { display: 'flex', alignItems: 'center', gap: '20px' },
  logoutButton: {
    padding: '6px 16px',
    backgroundColor: '#fff',
    color: '#dc3545',
    border: '1px solid #dc3545',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '500',
  },
  mainContent: {
    flex: '1 1 auto',
    minHeight: 0,
    width: '100%',
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '40px',
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
    boxSizing: 'border-box',
  },
};

export default App;