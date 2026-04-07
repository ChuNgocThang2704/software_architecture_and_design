import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Menu chính</h2>
            <nav>
                <ul style={styles.navList}>
                    <li style={styles.navItem}>
                        <Link to="/tours" style={styles.navLink}>
                            <button style={styles.navButton}>1. Đặt vé Tour</button>
                        </Link>
                    </li>
                    <li style={styles.navItem}>
                        <Link to="/partners" style={styles.navLink}>
                            <button style={styles.navButton}>2. Quản lý đối tác</button>
                        </Link>
                    </li>
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
        fontSize: '2.5em',
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
        fontSize: '1.3em',
        fontWeight: 'bold',
        boxShadow: '0 4px 10px rgba(40,167,69,.2)',
        transition: 'background-color 0.2s ease, transform 0.2s ease',
    },
    navButtonHover: {
        backgroundColor: '#218838',
        transform: 'translateY(-2px)',
    },
};

export default HomePage;