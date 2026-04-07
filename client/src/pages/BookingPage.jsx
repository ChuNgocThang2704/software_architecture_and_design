import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import apiClient from '../api';
import CustomerManager from '../component/CustomerManager';

function BookingPage({ user }) {
    const { tourId } = useParams();
    const navigate = useNavigate();
    const [schedules, setSchedules] = useState([]);
    const [selectedSchedule, setSelectedSchedule] = useState(null);

    const [selectedCustomerId, setSelectedCustomerId] = useState(null);
    const [selectedCustomerName, setSelectedCustomerName] = useState('');
    const [selectedCustomerAddress, setSelectedCustomerAddress] = useState('');
    const [ticketCart, setTicketCart] = useState([]);

    useEffect(() => {
        apiClient.get(`/api/tours/${tourId}/schedules`)
            .then(response => {
                setSchedules(response.data);
            })
            .catch(error => {
                alert("Lỗi khi tải lịch trình của tour");
            });
    }, [tourId]);

    const handleSelectSchedule = (schedule) => {
        setSelectedSchedule(schedule);
        setTicketCart([
            { type: 'ADULT', quantity: 1, price: schedule.price },
            { type: 'CHILD', quantity: 0, price: schedule.price / 2 },
        ]);
    }

    const handleQuantityChange = (type, quantity) => {
        setTicketCart(currentCart =>
            currentCart.map(item =>
                item.type === type ? { ...item, quantity: parseInt(quantity) || 0 } : item
            )
        );
    };

    const handleBooking = async () => {
        if (!selectedSchedule || !selectedCustomerId) {
            alert('Vui lòng chọn lịch trình và khách hàng!');
            return;
        }

        const scheduleTickets = ticketCart
            .filter(item => item.quantity > 0)
            .map(item => ({
                scheduleId: selectedSchedule.id,
                quantity: item.quantity,
                type: item.type,
                unitPrice: item.price,
            }));

        if (scheduleTickets.length === 0) {
            alert("Vui lòng chọn ít nhất một vé")
            return;
        }

        const bookingPayload = {
            tourId: parseInt(tourId),
            userId: user.id,
            customerId: selectedCustomerId,
            datePayment: new Date().toISOString().split('T')[0],
            status: "PENDING",
            scheduleTickets: scheduleTickets,
        };

        try {
            const response = await apiClient.post('/api/bookings', bookingPayload);
            alert(`Đặt vé thành công!`);
            navigate(`/ticket/${response.data.id}`);
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại.';
            alert(`Đặt vé thất bại! Lỗi: ${errorMessage}`);
        }
    };

    const formatDate = (dateStr) =>{
        const d = new Date(dateStr);
        return (
            String(d.getDate()).padStart(2,'0') + '/' +
            String(d.getMonth() + 1).padStart(2, '0') + '/' +
            d.getFullYear()
        )
    }

    const totalAmount = ticketCart.reduce((total, item) => total + (item.quantity * item.price), 0);

    return (
        <div style={styles.container}>
            <Link to="/tours" style={styles.backLink}>&larr; Quay lại danh sách Tour</Link>
            <h2 style={styles.title}>Đặt vé cho Tour</h2>

            <div style={styles.section}>
                <h3 style={styles.sectionTitle}>1. Chọn lịch trình</h3>
                    <div style={styles.scheduleList}>
                        {schedules.map(schedule => (
                            <div
                                key={schedule.id}
                                style={selectedSchedule?.id === schedule.id ? styles.selectedScheduleItem : styles.scheduleItem}
                                onClick={() => handleSelectSchedule(schedule)}
                            >
                                <p><strong>Ngày đi:</strong> {formatDate(schedule.startDate)} </p>
                                <p><strong>Ngày về:</strong> {formatDate(schedule.endDate)}</p>
                                <p><strong>Giá vé:</strong> {schedule.price.toLocaleString()} VNĐ</p>
                                <p><strong>Loại vé:</strong> {schedule.type === 'STANDARD' ? 'Thường' : 'VIP'}</p>
                                <p><strong>Số chỗ còn lại:</strong> {schedule.quantity}</p>
                            </div>
                        ))}
                    </div>
            </div>
            {selectedSchedule && (
                <div style={styles.section}>
                    <h3 style={styles.sectionTitle}>2. Chọn khách hàng và số lượng vé</h3>

                    <CustomerManager onCustomerSelect={(id, name, address) => {
                        setSelectedCustomerId(id);
                        setSelectedCustomerName(name);
                        setSelectedCustomerAddress(address);
                    }} />

                    {selectedCustomerId && (
                        <div style={styles.selectedCustomerInfo}>
                            <p><strong>Đã chọn khách hàng:</strong></p>
                            <p><strong>Tên:</strong> {selectedCustomerName}</p>
                            <p><strong>Địa chỉ:</strong> {selectedCustomerAddress}</p>
                        </div>
                    )}

                    <div style={styles.ticketSelection}>
                        <h4 style={styles.ticketSelectionTitle}>Thông tin vé</h4>
                        {ticketCart.map(item => (
                            <div key={item.type} style={styles.ticketItemInput}>
                                <label style={styles.ticketLabel}>
                                    Vé {item.type === 'ADULT' ? 'Người lớn' : 'Trẻ em'}:
                                </label>
                                <input
                                    type="number"
                                    value={item.quantity}
                                    min="0"
                                    onChange={e => handleQuantityChange(item.type, e.target.value)}
                                    style={styles.ticketQuantityInput}
                                />
                                <span style={styles.ticketPrice}>x {item.price.toLocaleString()} VNĐ</span>
                            </div>
                        ))}
                    </div>

                    <h3 style={styles.totalAmount}>Tổng tiền: {totalAmount.toLocaleString()} VNĐ</h3>

                    <button
                        onClick={handleBooking}
                        style={styles.bookingButton}
                    >
                        Xác nhận Đặt vé
                    </button>
                </div>
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
    section: {
        backgroundColor: '#ffffff',
        padding: '25px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,.05)',
        marginBottom: '30px',
        border: '1px solid #e9ecef',
    },
    sectionTitle: {
        color: '#007bff',
        marginBottom: '20px',
        fontSize: '1.5em',
        borderBottom: '1px solid #e9ecef',
        paddingBottom: '10px',
    },
    scheduleList: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '15px',
    },
    scheduleItem: {
        border: '1px solid #ced4da',
        borderRadius: '8px',
        padding: '15px',
        backgroundColor: '#f8f9fa',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
    },
    selectedScheduleItem: {
        border: '2px solid #007bff',
        borderRadius: '8px',
        padding: '15px',
        backgroundColor: '#e7f3ff',
        cursor: 'pointer',
        boxShadow: '0 0 0 3px rgba(0,123,255,.25)',
    },
    selectedCustomerInfo: {
        backgroundColor: '#e9f7ef',
        border: '1px solid #28a745',
        borderRadius: '5px',
        padding: '15px',
        marginTop: '20px',
        color: '#155724',
    },
    ticketSelection: {
        marginTop: '30px',
    },
    ticketSelectionTitle: {
        color: '#343a40',
        marginBottom: '15px',
        fontSize: '1.2em',
    },
    ticketItemInput: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '10px',
        gap: '10px',
    },
    ticketLabel: {
        width: '120px',
        fontWeight: 'bold',
        color: '#555',
    },
    ticketQuantityInput: {
        width: '80px',
        padding: '8px 12px',
        border: '1px solid #ced4da',
        borderRadius: '5px',
        fontSize: '0.9em',
    },
    ticketPrice: {
        fontWeight: 'bold',
        color: '#007bff',
    },
    totalAmount: {
        textAlign: 'right',
        marginTop: '25px',
        color: '#dc3545',
        fontSize: '1.8em',
        fontWeight: 'bold',
    },
    bookingButton: {
        width: '100%',
        padding: '15px 25px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '1.5em',
        fontWeight: 'bold',
        transition: 'background-color 0.2s ease',
        marginTop: '30px',
        boxShadow: '0 4px 10px rgba(0,123,255,.2)',
    },
    bookingButtonHover: {
        backgroundColor: '#0056b3',
    },
};

export default BookingPage;