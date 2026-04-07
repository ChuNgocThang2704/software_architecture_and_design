import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiClient from '../api';

function TicketDetailsPage() {
    const { ticketId } = useParams();
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        apiClient.get(`/api/bookings/${ticketId}`)
            .then(response => {
                setTicket(response.data);
            })
            .catch(err => {
                console.error("Lỗi khi tải chi tiết vé:", err);
                setError('Không thể tải thông tin vé. Vui lòng thử lại.');
            })
            .finally(() => {
                setLoading(false);
            });
    }, [ticketId]);

    if (loading) return <p style={styles.loadingText}>Đang tải thông tin vé...</p>;
    if (error) return <p style={styles.errorMessage}>{error}</p>;
    if (!ticket) return <p style={styles.infoText}>Không tìm thấy thông tin vé.</p>;

    return (
        <div style={styles.container}>
            <Link to="/" style={styles.backLink}>&larr; Quay lại Menu</Link>
            <h2 style={styles.title}>Chi tiết vé</h2>

            <div style={styles.detailSection}>
                <p style={styles.detailItem}><strong>Tên Tour:</strong> {ticket.tourName}</p>
                <p style={styles.detailItem}><strong>Tên Khách hàng:</strong> {ticket.customerName}</p>
                <p style={styles.detailItem}><strong>Ngày thanh toán:</strong> {ticket.datePayment}</p>
                <p style={styles.detailItem}><strong>Ghi chú:</strong> {ticket.note || 'Không có'}</p>
            </div>

            <h3 style={styles.subtitle}>Chi tiết các mục đã đặt:</h3>
            <table style={styles.table}>
                <thead>
                <tr>
                    <th style={styles.tableHeader}>Loại vé</th>
                    <th style={styles.tableHeader}>Số lượng</th>
                    <th style={styles.tableHeader}>Đơn giá</th>
                    <th style={styles.tableHeader}>Thành tiền</th>
                </tr>
                </thead>
                <tbody>
                {ticket.scheduleTickets.map(item => (
                    <tr key={item.id} style={styles.tableRow}>
                        <td style={styles.tableCell}>Vé {item.type === 'ADULT' ? 'Người lớn' : 'Trẻ em'}</td>
                        <td style={styles.tableCell}>{item.quantity}</td>
                        <td style={styles.tableCell}>{item.unitPrice.toLocaleString()} VNĐ</td>
                        <td style={styles.tableCell}>{item.lineTotal.toLocaleString()} VNĐ</td>
                    </tr>
                ))}
                </tbody>
            </table>

            <h3 style={styles.totalAmount}>
                Tổng cộng: {ticket.total.toLocaleString()} VNĐ
            </h3>
        </div>
    );
}

const styles = {
    container: {
        padding: '20px',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,.05)',
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
        fontSize: '2em',
    },
    loadingText: {
        textAlign: 'center',
        fontSize: '1.1em',
        color: '#6c757d',
    },
    errorMessage: {
        color: '#dc3545',
        textAlign: 'center',
        fontSize: '1.1em',
    },
    infoText: {
        textAlign: 'center',
        fontSize: '1.1em',
        color: '#6c757d',
    },
    detailSection: {
        backgroundColor: '#f8f9fa',
        padding: '20px',
        borderRadius: '8px',
        border: '1px solid #e9ecef',
        marginBottom: '30px',
    },
    detailItem: {
        marginBottom: '8px',
        fontSize: '1.1em',
        color: '#343a40',
    },
    statusPending: {
        fontWeight: 'bold',
        color: '#ffc107', // Màu vàng
    },
    statusSuccess: {
        fontWeight: 'bold',
        color: '#28a745', // Màu xanh lá
    },
    subtitle: {
        color: '#343a40',
        marginBottom: '15px',
        fontSize: '1.5em',
        borderBottom: '1px solid #e9ecef',
        paddingBottom: '10px',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        marginBottom: '20px',
    },
    tableHeader: {
        backgroundColor: '#007bff',
        color: 'white',
        padding: '12px 15px',
        textAlign: 'left',
        border: '1px solid #dee2e6',
    },
    tableRow: {
        backgroundColor: '#ffffff',
        transition: 'background-color 0.2s ease',
    },
    tableRowHover: {
        backgroundColor: '#f1f1f1',
    },
    tableCell: {
        padding: '10px 15px',
        border: '1px solid #dee2e6',
        color: '#343a40',
    },
    totalAmount: {
        textAlign: 'right',
        marginTop: '25px',
        color: '#dc3545',
        fontSize: '2em',
        fontWeight: 'bold',
    },
};

export default TicketDetailsPage;