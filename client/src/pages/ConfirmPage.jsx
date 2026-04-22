import React, { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import { createBooking, getApiErrorMessage } from '../api';
import { Ticket, ScheduleTicket } from '../model';

function ConfirmPage({ user }) {
  const { tourId, scheduleId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const tour = location.state?.tour;
  const schedule = location.state?.schedule;
  const services = location.state?.services ?? [];
  const customer = location.state?.customer;
  const ticketCart = location.state?.ticketCart ?? [];
  const currentUser = user ?? JSON.parse(sessionStorage.getItem('user') || 'null');

  if (!tour || !schedule || !customer || ticketCart.length === 0) {
    return <Navigate to={`/booking/${tourId}/customers/${scheduleId}`} replace />;
  }

  const totalAmount = ticketCart.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  const totalServiceAmount = services.reduce((sum, service) => {
    const quantity = Number(service.quantity || 0);
    const price = Number(service.price || 0);
    return sum + (quantity * price);
  }, 0);
  const grandTotalAmount = totalAmount + totalServiceAmount;

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
  };

  const formatMoney = (value) => {
    const amount = Number(value || 0);
    return `${amount.toLocaleString()} VNĐ`;
  };

  const handleBooking = async () => {
    setSubmitting(true);
    try {
      const scheduleTickets = ticketCart
        .filter((item) => item.quantity > 0)
        .map((item) => new ScheduleTicket(null, schedule.id, item.quantity, item.type, item.note));

      const ticket = new Ticket(null, currentUser.id, customer.id, new Date().toISOString().split('T')[0], 'PENDING', '', grandTotalAmount, scheduleTickets);

      const payload = { tourId: tourId, ...ticket };
      const createdBooking = await createBooking(payload);

      alert('Đặt vé thành công.');
      navigate(`/ticket/${createdBooking.id}`, { state: { tour, schedule, ticketCart, services, grandTotalAmount } });
    } catch (error) {
      const message = getApiErrorMessage(error, 'Không thể đặt vé lúc này.');
      alert(message);
    } finally {
      setSubmitting(false);
    }
  };

  const displayType = schedule.type || '';

  return (
    <div style={styles.container}>
      <Link
        to={`/booking/${tourId}/customers/${scheduleId}`}
        state={{ tour, schedule }}
        style={styles.backLink}
      >
        &larr; Quay lại bước chọn khách hàng
      </Link>
      <h2 style={styles.title}>Xác nhận đặt vé</h2>

      <div style={styles.infoTableWrap}>
        <table style={styles.infoTable}>
          <tbody>
            <tr>
              <td style={styles.infoLabel}>Tên tour</td>
              <td style={styles.infoValue}>{tour.name}</td>
            </tr>
            <tr>
              <td style={styles.infoLabel}>Bắt đầu</td>
              <td style={styles.infoValue}>{formatDate(schedule.startDate)}</td>
            </tr>
            <tr>
              <td style={styles.infoLabel}>Kết thúc</td>
              <td style={styles.infoValue}>{formatDate(schedule.endDate)}</td>
            </tr>
            <tr>
              <td style={styles.infoLabel}>Loại vé</td>
              <td style={styles.infoValue}>{displayType}</td>
            </tr>
            <tr>
              <td style={styles.infoLabel}>Khách hàng</td>
              <td style={styles.infoValue}>{customer.name}</td>
            </tr>
            <tr>
              <td style={styles.infoLabel}>Số điện thoại</td>
              <td style={styles.infoValue}>{customer.phone || ''}</td>
            </tr>
            <tr>
              <td style={styles.infoLabel}>Nhân viên xử lý</td>
              <td style={styles.infoValue}>{currentUser?.name || ''}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>STT</th>
            <th style={styles.th}>Loại vé</th>
            <th style={styles.th}>Số lượng</th>
            <th style={styles.th}>Đơn giá</th>
            <th style={styles.th}>Thành tiền</th>
          </tr>
        </thead>
        <tbody>
          {ticketCart.filter((item) => item.quantity > 0).map((item, index) => (
            <tr key={item.type}>
              <td style={styles.td}>{index + 1}</td>
              <td style={styles.td}>{item.label}</td>
              <td style={styles.td}>{item.quantity}</td>
              <td style={styles.td}>{formatMoney(item.price)}</td>
              <td style={styles.td}>{formatMoney(item.quantity * item.price)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 style={styles.subtitle}>Dịch vụ đi kèm</h3>
      {services.length > 0 ? (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>STT</th>
              <th style={styles.th}>Tên dịch vụ</th>
              <th style={styles.th}>Đơn vị</th>
              <th style={styles.th}>Số lượng</th>
              <th style={styles.th}>Đơn giá</th>
              <th style={styles.th}>Thành tiền</th>
              <th style={styles.th}>Ghi chú</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service, index) => {
              const quantity = Number(service.quantity || 0);
              const price = Number(service.price || 0);
              const lineTotal = quantity * price;
              return (
                <tr key={service.id}>
                  <td style={styles.td}>{index + 1}</td>
                  <td style={styles.td}>{service.name}</td>
                  <td style={styles.td}>{service.unit || ''}</td>
                  <td style={styles.td}>{service.quantity ?? ''}</td>
                  <td style={styles.td}>{formatMoney(price)}</td>
                  <td style={styles.td}>{formatMoney(lineTotal)}</td>
                  <td style={styles.td}>{service.note || ''}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <p style={styles.infoText}>Tour không có dịch vụ đi kèm.</p>
      )}

      <div style={styles.footer}>
        <div style={styles.totalBox}>
          <span style={styles.totalLabel}>Tổng tiền vé</span>
          <span>{formatMoney(totalAmount)}</span>
        </div>
        <div style={styles.totalBox}>
          <span style={styles.totalLabel}>Tổng tiền dịch vụ</span>
          <span>{formatMoney(totalServiceAmount)}</span>
        </div>
        <div style={styles.totalBox}>
          <span style={styles.totalLabel}>Tổng cộng</span>
          <span>{formatMoney(grandTotalAmount)}</span>
        </div>
        <button id="btnConfirm" type="button" style={styles.button} onClick={handleBooking} disabled={submitting}>
          {submitting ? 'Đang đặt vé...' : 'Xác nhận'}
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '10px 0', display: 'flex', flexDirection: 'column', gap: '18px' },
  backLink: { textDecoration: 'none', color: '#007bff', fontWeight: 'bold', display: 'inline-block' },
  title: { color: '#007bff', margin: 0, textAlign: 'center' },
  infoTableWrap: { display: 'flex', justifyContent: 'center' },
  infoTable: { borderCollapse: 'collapse', minWidth: '520px' },
  infoLabel: { border: '1px solid #dee2e6', padding: '10px', fontWeight: 'bold', backgroundColor: '#f8f9fa' },
  infoValue: { border: '1px solid #dee2e6', padding: '10px' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { border: '1px solid #dee2e6', padding: '10px', backgroundColor: '#f8f9fa', textAlign: 'left' },
  td: { border: '1px solid #dee2e6', padding: '10px' },
  footer: { display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'center', flexWrap: 'wrap' },
  totalBox: { display: 'flex', gap: '8px', alignItems: 'center', border: '1px solid #dee2e6', padding: '10px 14px' },
  totalLabel: { fontWeight: 'bold' },
  subtitle: { color: '#343a40', marginBottom: '12px' },
  infoText: { color: '#6c757d', margin: 0 },
  button: { padding: '10px 18px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' },
};

export default ConfirmPage;
