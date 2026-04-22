import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function HomePage({ user }) {
  const [currentUser, setCurrentUser] = useState(user ?? null);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = sessionStorage.getItem('user');
    if (loggedInUser) {
      setCurrentUser(JSON.parse(loggedInUser));
      return;
    }

    setCurrentUser(user ?? null);
  }, [user]);

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    setCurrentUser(null);
    navigate('/login');
  };

  const canManagePartners = user?.role === 'MANAGER';

  return (
    <div style={styles.container}>
      {currentUser && (
        <div style={styles.userGreeting}>
          <p style={styles.greetingText}>Xin chào, <strong>{currentUser.name}</strong></p>
          <button style={styles.logoutButton} onClick={handleLogout}>
            Đăng xuất
          </button>
        </div>
      )}
      <h2 style={styles.title}>Menu chính</h2>
      <nav>
        <ul style={styles.navList}>
          <li style={styles.navItem}>
            <Link to="/tours" style={styles.navLink}>
              <button id="btnSaleTicket" type="button" style={styles.navButton}>1. Bán vé Tour</button>
            </Link>
          </li>
          {canManagePartners && (
            <li style={styles.navItem}>
              <Link to="/partners" style={styles.navLink}>
                <button id="btnManagerPartner" type="button" style={styles.navButton}>2. Quản lý đối tác</button>
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100%',
  },
  title: {
    color: '#007bff',
    marginBottom: '40px',
    fontSize: '2.2em',
  },
  navList: {
    listStyle: 'none',
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  navItem: {
    width: '100%',
  },
  navLink: {
    textDecoration: 'none',
  },
  navButton: {
    width: '300px',
    padding: '15px 25px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1.2em',
    fontWeight: 'bold',
  },
  userGreeting: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    maxWidth: '600px',
    padding: '12px 20px',
    backgroundColor: '#e7f3ff',
    border: '1px solid #b3d9ff',
    borderRadius: '6px',
    marginBottom: '30px',
  },
  greetingText: {
    margin: 0,
    color: '#0062cc',
    fontSize: '1em',
  },
  logoutButton: {
    padding: '6px 14px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9em',
    fontWeight: '500',
    whiteSpace: 'nowrap',
  },
};

export default HomePage;
