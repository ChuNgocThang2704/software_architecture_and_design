import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getApiErrorMessage, login } from '../api';
import { User } from '../model';

function LoginPage({ onLoginSuccess }) {
    const [email, setEmail] = useState('a@gmail.com');
    const [password, setPassword] = useState('123456');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const user = new User(null, '', email, password, '');
            const loggedInUser = await login(user);
            onLoginSuccess(loggedInUser);
            navigate('/');
        } catch (err) {
            alert(getApiErrorMessage(err, 'Đăng nhập thất bại. Vui lòng kiểm tra lại email và mật khẩu.'));
            console.error(err);
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Đăng nhập</h2>
            <form onSubmit={handleLogin} style={styles.form}>
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
                    <label style={styles.label}>Password:</label>
                    <input
                        id="inPassword"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={styles.input}
                    />
                </div>
                <button id="btnLogin" type="submit" style={styles.button}>Đăng nhập</button>
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
    errorText: {
        color: '#dc3545',
        marginBottom: '15px',
        textAlign: 'center',
    },
    button: {
        width: '100%',
        padding: '12px 20px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '1.1em',
        fontWeight: 'bold',
        transition: 'background-color 0.2s ease',
    },
    buttonHover: {
        backgroundColor: '#0056b3',
    },
};

export default LoginPage;