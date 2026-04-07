import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api';

function ToursPage() {
    const [tours, setTours] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchTours = async (name = '') => {
        setLoading(true);
        try {
            const response = await apiClient.get(`/api/tours?name=${name}`);
            setTours(response.data);
        } catch (error) {
            console.error("Lỗi khi tải danh sách tour:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchTours(searchTerm);
    };

    return (
        <div style={styles.container}>
            <Link to="/" style={styles.backLink}>&larr; Quay lại Menu</Link>
            <h2 style={styles.title}>Danh sách Tour</h2>

            <form onSubmit={handleSearch} style={styles.searchForm}>
                <input
                    type="text"
                    placeholder="Tìm kiếm tour theo tên..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    style={styles.searchInput}
                />
                <button type="submit" style={styles.searchButton}>Tìm kiếm</button>
            </form>

            {loading ? (
                <p style={styles.loadingText}>Đang tải danh sách tour...</p>
            ) : (
                <ul style={styles.tourList}>
                    {tours.map(tour => (
                        <li key={tour.id} style={styles.tourItem}>
                            <h3 style={styles.tourName}>{tour.name}</h3>
                            <p style={styles.tourDetail}><strong>Điểm đến:</strong> {tour.destination}</p>
                            <p style={styles.tourDetail}><strong>Thời gian:</strong> {tour.time} ngày</p>
                            <Link to={`/booking/${tour.id}`} style={styles.viewButtonLink}>
                                <button style={styles.viewButton}>Xem lịch trình & Đặt vé</button>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

const styles = {
    container: {
        padding: '20px',
    },
    backLink: {
        textDecoration: 'none',
        color: '#007bff',
        fontWeight: 'bold',
        marginBottom: '20px',
        display: 'inline-block',
    },
    title: {
        color: '#007bff',
        marginBottom: '25px',
        textAlign: 'center',
    },
    searchForm: {
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '30px',
        gap: '10px',
    },
    searchInput: {
        padding: '10px 15px',
        border: '1px solid #ced4da',
        borderRadius: '5px',
        fontSize: '1em',
        width: '300px',
    },
    searchButton: {
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '1em',
        transition: 'background-color 0.2s ease',
    },
    searchButtonHover: {
        backgroundColor: '#0056b3',
    },
    loadingText: {
        textAlign: 'center',
        fontSize: '1.1em',
        color: '#6c757d',
    },
    tourList: {
        listStyle: 'none',
        padding: 0,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '20px',
    },
    tourItem: {
        border: '1px solid #e9ecef',
        borderRadius: '8px',
        padding: '20px',
        backgroundColor: '#ffffff',
        boxShadow: '0 2px 8px rgba(0,0,0,.05)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    tourName: {
        color: '#343a40',
        marginBottom: '10px',
        fontSize: '1.5em',
    },
    tourDetail: {
        margin: '5px 0',
        color: '#6c757d',
    },
    viewButtonLink: {
        textDecoration: 'none',
        marginTop: '15px',
    },
    viewButton: {
        width: '100%',
        padding: '10px 15px',
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '1em',
        transition: 'background-color 0.2s ease',
    },
    viewButtonHover: {
        backgroundColor: '#218838',
    },
};

export default ToursPage;