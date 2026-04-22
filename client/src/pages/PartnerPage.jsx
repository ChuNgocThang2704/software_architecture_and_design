import React from 'react';
import { Link, Navigate } from 'react-router-dom';

function PartnerPage({ user }) {
  if (user?.role !== 'MANAGER') {
    return <Navigate to="/" replace />;
  }

  return (
    <div style={styles.container}>
      <Link to="/" style={styles.backLink}>&larr; Quay lại Menu</Link>
      <div style={styles.header}>
        <h2 style={styles.title}>Danh sách đối tác</h2>
        <Link to="/partners/add">
          <button style={styles.addButton}>+ Thêm đối tác mới</button>
        </Link>
      </div>

      <form style={styles.searchForm}>
        <input type="text" placeholder="Tìm kiếm đối tác theo tên..." style={styles.searchInput} />
        <button type="submit" style={styles.searchButton}>Tìm kiếm</button>
      </form>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.tableHeader}>Tên đối tác</th>
            <th style={styles.tableHeader}>Công ty</th>
            <th style={styles.tableHeader}>Số điện thoại</th>
            <th style={styles.tableHeader}>Email</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan="4" style={styles.tableCell}>Chưa có API danh sách đối tác để hiển thị dữ liệu.</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  container: { padding: '20px' },
  backLink: {
    textDecoration: 'none',
    color: '#007bff',
    fontWeight: 'bold',
    marginBottom: '20px',
    display: 'inline-block',
  },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', gap: '12px', flexWrap: 'wrap' },
  title: { color: '#007bff', margin: 0 },
  addButton: {
    padding: '10px 15px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1em',
  },
  searchForm: { display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' },
  searchInput: { flexGrow: 1, padding: '10px', border: '1px solid #ced4da', borderRadius: '5px' },
  searchButton: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  table: { width: '100%', borderCollapse: 'collapse' },
  tableHeader: { backgroundColor: '#f8f9fa', padding: '12px', border: '1px solid #dee2e6', textAlign: 'left' },
  tableCell: { padding: '12px', border: '1px solid #dee2e6', textAlign: 'center' },
};

export default PartnerPage;
