import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getApiErrorMessage, register } from '../api';
import { User } from '../model';

function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const user = new User(null, name, email, password, 'USER');
            await register(user);
            alert('Đăng ký thành công! Vui lòng đăng nhập.');
            navigate('/login');
        } catch (err) {
            alert(getApiErrorMessage(err, 'Đăng ký thất bại. Email có thể đã được sử dụng.'));
            console.error(err);
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Đăng ký tài khoản</h2>
            <form onSubmit={handleRegister} style={styles.form}>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Họ và tên:</label>
                    <input
                        id="inName"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        style={styles.input}
                    />
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Email:</label>
                    <input
                        id="inEmail"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={styles.input}
                    />
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Mật khẩu:</label>
                    <input
                        id="inPassword"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={styles.input}
                    />
                </div>
                <button id="btnRegister" type="submit" style={styles.button}>Đăng ký</button>
                <div style={styles.loginLink}>
                    Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
                </div>
            </form>
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
        marginBottom: '30px',
    },
    form: {
        backgroundColor: '#ffffff',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 4px 15px rgba(0,0,0,.1)',
        width: '100%',
        maxWidth: '400px',
    },
    formGroup: {
        marginBottom: '20px',
    },
    label: {
        display: 'block',
        marginBottom: '8px',
        fontWeight: 'bold',
        color: '#555',
    },
    input: {
        width: 'calc(100% - 20px)',
        padding: '10px',
        border: '1px solid #ced4da',
        borderRadius: '5px',
        fontSize: '1em',
    },
    button: {
        width: '100%',
        padding: '12px 20px',
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '1.1em',
        fontWeight: 'bold',
        transition: 'background-color 0.2s ease',
        marginTop: '10px'
    },
    loginLink: {
        marginTop: '20px',
        textAlign: 'center'
    }
};

export default RegisterPage;
