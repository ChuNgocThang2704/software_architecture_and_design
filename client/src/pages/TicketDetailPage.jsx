import React, { useEffect, useState } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { getBookingById, getApiErrorMessage } from '../api';
function TicketDetailPage() {
  const { ticketId } = useParams();
  const location = useLocation();
  const stateContext = location.state;
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!ticketId) {
      setError('Thiếu mã vé để tải chi tiết.');
      setLoading(false);
      return;
    }

    let isMounted = true;

    const handleGetTicket = async () => {
      try {
        const data = await getBookingById(ticketId);
        if (isMounted) {
          setTicket(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(getApiErrorMessage(err, 'Không thể tải thông tin vé. Vui lòng thử lại.'));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    handleGetTicket();

    return () => {
      isMounted = false;
    };
  }, [ticketId]);

  const formatMoney = (value) => {
    const amount = Number(value || 0);
    return `${amount.toLocaleString()} VNĐ`;
  };

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return '';
    }

    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) {
      return String(dateValue);
    }

    return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
  };

  const scheduleTickets = ticket?.scheduleTickets ?? [];

  if (loading) {
    return <p style={styles.loadingText}>Đang tải thông tin vé...</p>;
  }

  if (error) {
    return <p style={styles.errorMessage}>{error}</p>;
  }

  if (!ticket) {
    return <p style={styles.infoText}>Không tìm thấy thông tin vé.</p>;
  }

  return (
    <div style={styles.container}>
      <Link to="/" style={styles.backLink}>&larr; Quay lại Menu</Link>
      <h2 style={styles.title}>Chi tiết vé đặt thành công</h2>

      <div style={styles.infoTableWrap}>
        <table style={styles.infoTable}>
          <tbody>
            <tr>
              <td style={styles.infoLabel}>Tên tour</td>
              <td style={styles.infoValue}>{stateContext?.tour?.name || 'Đang cập nhật...'}</td>
            </tr>
            <tr>
              <td style={styles.infoLabel}>Tên khách hàng</td>
              <td style={styles.infoValue}>{ticket.customerName}</td>
            </tr>
            <tr>
              <td style={styles.infoLabel}>Ngày thanh toán</td>
              <td style={styles.infoValue}>{formatDate(ticket.datePayment)}</td>
            </tr>
            <tr>
              <td style={styles.infoLabel}>Trạng thái</td>
              <td style={styles.infoValue}>{ticket.status}</td>
            </tr>
            <tr>
              <td style={styles.infoLabel}>Ghi chú</td>
              <td style={styles.infoValue}>{ticket.note || 'Không có'}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 style={styles.subtitle}>Danh sách vé đã đặt</h3>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Loại vé</th>
            <th style={styles.th}>Số lượng</th>
            {stateContext?.ticketCart && <th style={styles.th}>Đơn giá</th>}
            {stateContext?.ticketCart && <th style={styles.th}>Thành tiền</th>}
          </tr>
        </thead>
        <tbody>
          {stateContext?.ticketCart 
            ? stateContext.ticketCart.filter((item) => item.quantity > 0).map((item) => (
              <tr key={item.type}>
                <td style={styles.td}>{item.label}</td>
                <td style={styles.td}>{item.quantity}</td>
                <td style={styles.td}>{formatMoney(item.price)}</td>
                <td style={styles.td}>{formatMoney(item.quantity * item.price)}</td>
              </tr>
            ))
            : scheduleTickets.map((item) => (
            <tr key={item.id}>
              <td style={styles.td}>{item.type === 'ADULT' ? 'Người lớn' : 'Trẻ em'}</td>
              <td style={styles.td}>{item.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 style={styles.totalAmount}>Tổng cộng: {formatMoney(ticket.total)}</h3>
    </div>
  );
}

const styles = {
  container: { padding: '10px 0', display: 'flex', flexDirection: 'column', gap: '18px' },
  backLink: { textDecoration: 'none', color: '#007bff', fontWeight: 'bold', display: 'inline-block' },
  title: { color: '#007bff', margin: 0, textAlign: 'center' },
  infoTableWrap: { display: 'flex', justifyContent: 'center' },
  infoTable: { borderCollapse: 'collapse', minWidth: '460px' },
  infoLabel: { border: '1px solid #dee2e6', padding: '10px', fontWeight: 'bold', backgroundColor: '#f8f9fa' },
  infoValue: { border: '1px solid #dee2e6', padding: '10px' },
  subtitle: { color: '#343a40', marginBottom: '8px' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { border: '1px solid #dee2e6', padding: '10px', backgroundColor: '#f8f9fa', textAlign: 'left' },
  td: { border: '1px solid #dee2e6', padding: '10px' },
  totalAmount: { textAlign: 'right', marginTop: '10px', color: '#dc3545', fontSize: '1.5em', fontWeight: 'bold' },
  loadingText: { textAlign: 'center', fontSize: '1.1em', color: '#6c757d' },
  errorMessage: { color: '#dc3545', textAlign: 'center', fontSize: '1.1em' },
  infoText: { textAlign: 'center', fontSize: '1.1em', color: '#6c757d' },
};

export default TicketDetailPage;
