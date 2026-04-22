import React, { useEffect, useState } from 'react';
import { BrowserRouter, Link, Navigate, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ToursPage from './pages/ToursPage';
import SchedulePage from './pages/SchedulePage.jsx';
import CustomerPage from './pages/CustomerPage.jsx';
import ConfirmPage from './pages/ConfirmPage.jsx';
import AddPartnerPage from './pages/AddPartnerPage';
import PartnerPage from './pages/PartnerPage';
import TicketDetailPage from './pages/TicketDetailPage';

function App() {
  const [user, setUser] = useState(null);

  const handleLoginSuccess = (loggedInUser) => {
    sessionStorage.setItem('user', JSON.stringify(loggedInUser));
    setUser(loggedInUser);
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
            <Route path="/" element={user ? <HomePage user={user} /> : <Navigate to="/login" />} />
            <Route path="/tours" element={user ? <ToursPage /> : <Navigate to="/login" />} />
            <Route path="/booking/:tourId" element={user ? <SchedulePage /> : <Navigate to="/login" />} />
            <Route
              path="/booking/:tourId/customers/:scheduleId"
              element={user ? <CustomerPage /> : <Navigate to="/login" />}
            />
            <Route
              path="/booking/:tourId/confirm/:scheduleId"
              element={user ? <ConfirmPage user={user} /> : <Navigate to="/login" />}
            />
            <Route path="/partners" element={user ? <PartnerPage user={user} /> : <Navigate to="/login" />} />
            <Route
              path="/partners/add"
              element={user && user.role === 'MANAGER' ? <AddPartnerPage user={user} /> : <Navigate to="/" />}
            />
            <Route path="/ticket/:ticketId" element={user ? <TicketDetailPage /> : <Navigate to="/login" />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

const styles = {
  appContainer: {
    fontFamily: "'Segoe UI', sans-serif",
    backgroundColor: '#f3f6fb',
    minHeight: '100svh',
    display: 'flex',
    flexDirection: 'column',
    padding: '0 24px 24px',
    boxSizing: 'border-box',
    gap: '20px',
  },
  header: {
    backgroundColor: '#ffffff',
    padding: '0 40px',
    height: '70px',
    display: 'flex',
    alignItems: 'center',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  headerTitleLink: {
    textDecoration: 'none',
  },
  headerTitle: {
    fontSize: '22px',
    color: '#0062cc',
    fontWeight: '700',
    margin: 0,
  },
  mainContent: {
    flex: '1 1 auto',
    width: '100%',
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '32px',
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
    boxSizing: 'border-box',
  },
};

export default App;
