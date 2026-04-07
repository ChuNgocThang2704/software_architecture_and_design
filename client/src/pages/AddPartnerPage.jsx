import React, { useState } from 'react';
import apiClient from '../api';
import { Link } from 'react-router-dom';

function AddPartnerPage() {
    const [name, setName] = useState('');
    const [company, setCompany] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [signDate, setSignDate] = useState('');
    const [expirationDate, setExpirationDate] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const partnerPayload = { name, company, phone, email, signDate, expirationDate };
        try {
            const response = await apiClient.post('/api/partners', partnerPayload);
            alert(`Thêm đối tác "${response.data.name}" thành công!`);
            setName('');
            setCompany('');
            setPhone('');
            setEmail('');
            setSignDate('');
            setExpirationDate('');
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại.';
            alert(`Lỗi: ${errorMessage}`);
        }
    };

    return (
        <div style={styles.container}>
            <Link to="/" style={styles.backLink}>&larr; Quay lại Menu</Link>
            <h2 style={styles.title}>Thêm đối tác mới</h2>

            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Tên đối tác:</label>
                    <input type="text" placeholder="Tên đối tác" value={name} onChange={e => setName(e.target.value)} required style={styles.input} />
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Tên công ty:</label>
                    <input type="text" placeholder="Tên công ty" value={company} onChange={e => setCompany(e.target.value)} required style={styles.input} />
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Số điện thoại:</label>
                    <input type="text" placeholder="Số điện thoại" value={phone} onChange={e => setPhone(e.target.value)} required style={styles.input} />
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Email:</label>
                    <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required style={styles.input} />
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Ngày ký hợp đồng:</label>
                    <input type="date" value={signDate} onChange={e => setSignDate(e.target.value)} required style={styles.input} />
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Ngày hết hạn:</label>
                    <input type="date" value={expirationDate} onChange={e => setExpirationDate(e.target.value)} required style={styles.input} />
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
    message: {
        padding: '10px',
        borderRadius: '5px',
        marginBottom: '15px',
        textAlign: 'center',
    },
    successMessage: {
        backgroundColor: '#d4edda',
        color: '#155724',
        border: '1px solid #c3e6cb',
    },
    errorMessage: {
        backgroundColor: '#f8d7da',
        color: '#721c24',
        border: '1px solid #f5c6cb',
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
        transition: 'background-color 0.2s ease',
        marginTop: '10px',
    },
    buttonHover: {
        backgroundColor: '#0056b3',
    },
};

export default AddPartnerPage;