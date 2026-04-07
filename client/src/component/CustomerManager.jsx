import React, { useState, useEffect } from 'react';
import apiClient from '../api';

function CustomerManager({ onCustomerSelect }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showNewCustomerForm, setShowNewCustomerForm] = useState(false);

    const [newName, setNewName] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newPhone, setNewPhone] = useState('');
    const [newAddress, setNewAddress] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    const fetchCustomers = async (name = '') => {
        try {
            const response = await apiClient.get(`/api/customers?name=${name}`);
            setSearchResults(response.data);
        } catch (error) {
            alert('Không thể tải danh sách khách hàng.');
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchCustomers(searchTerm);
    };

    const handleCreateNewCustomer = async (e) => {
        e.preventDefault();
        setMessage('');
        setMessageType('');
        const customerPayload = { name: newName, email: newEmail, phone: newPhone, address: newAddress };
        try {
            const response = await apiClient.post('/api/customers', customerPayload);
            alert(`Tạo khách hàng "${response.data.name}" thành công!`);

            onCustomerSelect(response.data.id, response.data.name, response.data.address);

            setShowNewCustomerForm(false);
            setNewName('');
            setNewEmail('');
            setNewPhone('');
            setNewAddress('');
            fetchCustomers();
        } catch (error) {
            setMessage(`Lỗi: ${error.response?.data?.message || error.message}`);
            setMessageType('error');
        }
    };

    const handleSelectCustomer = (customer) => {
        onCustomerSelect(customer.id, customer.name, customer.address);
        setSearchResults([]);
        setSearchTerm('');
    }

    return (
        <div style={styles.container}>
            <h4 style={styles.title}>Thông tin khách hàng</h4>

            {message && (
                <p style={messageType === 'success' ? styles.successMessage : styles.errorMessage}>
                    {message}
                </p>
            )}

            <form onSubmit={handleSearch} style={styles.searchForm}>
                <input
                    type="text"
                    placeholder="Tìm khách hàng theo tên..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    style={styles.searchInput}
                />
                <button type="submit" style={styles.searchButton}>Tìm</button>
                <button type="button" onClick={() => setShowNewCustomerForm(!showNewCustomerForm)} style={styles.newCustomerButton}>
                    {showNewCustomerForm ? 'Hủy' : '+ Thêm khách hàng mới'}
                </button>
            </form>

            {searchResults.length > 0 && (
                <ul style={styles.searchResultsList}>
                    {searchResults.map(customer => (
                        <li key={customer.id} style={styles.searchResultItem}>
                            <span>{customer.name} ({customer.email})</span>
                            <button onClick={() => handleSelectCustomer(customer)} style={styles.selectButton}>Chọn</button>
                        </li>
                    ))}
                </ul>
            )}

            {showNewCustomerForm && (
                <form onSubmit={handleCreateNewCustomer} style={styles.newCustomerForm}>
                    <h5 style={styles.formSubtitle}>Thêm khách hàng mới</h5>
                    <input type="text" placeholder="Tên" value={newName} onChange={e => setNewName(e.target.value)} required style={styles.input} />
                    <input type="email" placeholder="Email" value={newEmail} onChange={e => setNewEmail(e.target.value)} required style={styles.input} />
                    <input type="text" placeholder="SĐT" value={newPhone} onChange={e => setNewPhone(e.target.value)} style={styles.input} />
                    <input type="text" placeholder="Địa chỉ" value={newAddress} onChange={e => setNewAddress(e.target.value)} style={styles.input} />
                    <button type="submit" style={styles.button}>Lưu khách hàng mới</button>
                </form>
            )}
        </div>
    );
}

const styles = {
    container: {
        backgroundColor: '#f8f9fa',
        padding: '20px',
        borderRadius: '8px',
        border: '1px solid #e9ecef',
        marginBottom: '20px',
    },
    title: {
        color: '#007bff',
        marginBottom: '15px',
        fontSize: '1.3em',
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
    searchForm: {
        display: 'flex',
        gap: '10px',
        marginBottom: '15px',
        flexWrap: 'wrap',
    },
    searchInput: {
        flexGrow: 1,
        padding: '8px 12px',
        border: '1px solid #ced4da',
        borderRadius: '5px',
        fontSize: '0.9em',
        minWidth: '150px',
    },
    searchButton: {
        padding: '8px 15px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '0.9em',
    },
    newCustomerButton: {
        padding: '8px 15px',
        backgroundColor: '#6c757d',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '0.9em',
    },
    searchResultsList: {
        listStyle: 'none',
        padding: 0,
        maxHeight: '200px',
        overflowY: 'auto',
        border: '1px solid #e9ecef',
        borderRadius: '5px',
        backgroundColor: '#fff',
        marginBottom: '15px',
    },
    searchResultItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px 12px',
        borderBottom: '1px solid #f0f0f0',
    },
    selectButton: {
        padding: '5px 10px',
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '0.8em',
    },
    newCustomerForm: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        border: '1px dashed #007bff',
    },
    formSubtitle: {
        color: '#007bff',
        marginBottom: '10px',
        fontSize: '1.1em',
    },
    input: {
        padding: '8px 12px',
        border: '1px solid #ced4da',
        borderRadius: '5px',
        fontSize: '0.9em',
    },
    button: {
        padding: '10px 15px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '1em',
        marginTop: '10px',
    },
};

export default CustomerManager;