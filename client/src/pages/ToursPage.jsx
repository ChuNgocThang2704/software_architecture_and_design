import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { searchTours } from '../api';

function ToursPage() {
  const navigate = useNavigate();
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchTours = async (name = '') => {
    setLoading(true);
    try {
      const toursData = await searchTours(name);
      setTours(toursData);
    } catch (error) {
      alert('Không thể tải danh sách tour.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (event) => {
    event.preventDefault();
    handleSearchTours(searchTerm);
  };

  const formatTime = (time) => {
    if (time === null || time === undefined) {
      return '';
    }
    return `${time} ngày`;
  };

  return (
    <div style={styles.container}>
      <Link to="/" style={styles.backLink}>&larr; Quay lại Menu</Link>
      <h2 style={styles.title}>Danh sách tour</h2>

      <form onSubmit={handleSearch} style={styles.searchForm}>
        <input
          id="inName"
          type="text"
          placeholder="Nhập tên tour cần tìm"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          style={styles.searchInput}
        />
        <button id="btnSearch" type="submit" style={styles.button}>Tìm</button>
      </form>

      {loading ? (
        <p>Đang tải danh sách tour...</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Tên tour</th>
              <th style={styles.th}>Điểm đến</th>
              <th style={styles.th}>Loại tour</th>
              <th style={styles.th}>Thời gian</th>
              <th style={styles.th}>Ghi chú</th>
              <th style={styles.th}>Trạng thái</th>
              <th style={styles.th}></th>
            </tr>
          </thead>
          <tbody>
            {tours.length === 0 && (
              <tr>
                <td colSpan="7" style={styles.emptyCell}>Không có tour phù hợp.</td>
              </tr>
            )}
            {tours.map((tour) => (
              <tr key={tour.id}>
                <td style={styles.td}>{tour.name}</td>
                <td style={styles.td}>{tour.destination}</td>
                <td style={styles.td}>{tour.type || ''}</td>
                <td style={styles.td}>{formatTime(tour.time)}</td>
                <td style={styles.td}>{tour.note || ''}</td>
                <td style={styles.td}>{tour.status || ''}</td>
                <td style={styles.td}>
                  <button
                    type="button"
                    style={styles.button}
                    onClick={() => navigate(`/booking/${tour.id}`, { state: { tour } })}
                  >
                    Chọn
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const styles = {
  container: { padding: '10px 0' },
  backLink: {
    textDecoration: 'none',
    color: '#007bff',
    fontWeight: 'bold',
    marginBottom: '20px',
    display: 'inline-block',
  },
  title: {
    color: '#007bff',
    marginBottom: '20px',
    textAlign: 'center',
  },
  searchForm: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  searchInput: {
    width: '320px',
    padding: '10px',
    border: '1px solid #ced4da',
    borderRadius: '5px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    border: '1px solid #dee2e6',
    padding: '10px',
    backgroundColor: '#f8f9fa',
    textAlign: 'left',
  },
  td: {
    border: '1px solid #dee2e6',
    padding: '10px',
  },
  emptyCell: {
    border: '1px solid #dee2e6',
    padding: '16px',
    textAlign: 'center',
  },
  button: {
    padding: '8px 14px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default ToursPage;
