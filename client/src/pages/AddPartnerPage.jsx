import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPartner, getApiErrorMessage } from '../api';
import { Partner } from '../model';

function AddPartnerPage({ user }) {
  const navigate = useNavigate();
  const currentUser = user ?? JSON.parse(sessionStorage.getItem('user') || 'null');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [signDate, setSignDate] = useState('');
  const [expirationDate, setExpirationDate] = useState('');

  const handleCreatePartner = async (event) => {
    event.preventDefault();
    try {
      const partner = new Partner(null, name, company, phone, email, signDate, expirationDate);
      const createdPartner = await createPartner(partner);
      alert(`Thêm đối tác "${createdPartner.name}" thành công.`);
      navigate('/partners');
    } catch (error) {
      const message = getApiErrorMessage(error, 'Có lỗi xảy ra, vui lòng thử lại.');
      alert(`Không thể thêm đối tác: ${message}`);
    }
  };

  return (
    <div style={styles.container}>
      <Link to="/partners" style={styles.backLink}>&larr; Quay lại danh sách đối tác</Link>
      <h2 style={styles.title}>Thêm đối tác mới</h2>

      <form onSubmit={handleCreatePartner} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Tên đối tác:</label>
          <input type="text" value={name} onChange={(event) => setName(event.target.value)} required style={styles.input} />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Tên công ty:</label>
          <input type="text" value={company} onChange={(event) => setCompany(event.target.value)} required style={styles.input} />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Số điện thoại:</label>
          <input type="text" value={phone} onChange={(event) => setPhone(event.target.value)} required style={styles.input} />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Email:</label>
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required style={styles.input} />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Ngày ký hợp đồng:</label>
          <input type="date" value={signDate} onChange={(event) => setSignDate(event.target.value)} required style={styles.input} />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Ngày hết hạn:</label>
          <input type="date" value={expirationDate} onChange={(event) => setExpirationDate(event.target.value)} required style={styles.input} />
        </div>
        <button type="submit" style={styles.button}>Lưu</button>
      </form>
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
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    maxWidth: '500px',
    margin: '0 auto',
    backgroundColor: '#ffffff',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,.05)',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: '5px',
    fontWeight: 'bold',
    color: '#555',
  },
  input: {
    padding: '10px',
    border: '1px solid #ced4da',
    borderRadius: '5px',
    fontSize: '1em',
  },
  button: {
    padding: '12px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1.1em',
    fontWeight: 'bold',
    marginTop: '10px',
  },
};

export default AddPartnerPage;
