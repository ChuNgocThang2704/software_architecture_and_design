import React, { useEffect, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import { createCustomer, getApiErrorMessage, searchCustomers } from '../api';
import { Customer } from '../model';

function CustomerPage() {
  const { tourId, scheduleId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const tour = location.state?.tour ?? null;
  const schedule = location.state?.schedule ?? null;
  const services = location.state?.services ?? [];
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [customers, setCustomers] = useState([]);
  const [showNewCustomerForm, setShowNewCustomerForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [ticketCart, setTicketCart] = useState([
    { type: 'ADULT', label: 'Người lớn', quantity: 1, price: schedule?.adultPrice ?? 0 },
    { type: 'CHILD', label: 'Trẻ em', quantity: 0, price: schedule?.childPrice ?? 0 },
  ]);

  const handleSearchCustomer = async (name = '') => {
    try {
      const customersData = await searchCustomers(name);
      setCustomers(customersData);
    } catch (error) {
      alert(getApiErrorMessage(error, 'Không thể tải danh sách khách hàng.'));
    }
  };

  useEffect(() => {
    handleSearchCustomer();
  }, []);

  if (!tour || !schedule) {
    return <Navigate to={`/booking/${tourId}`} replace />;
  }

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
  };

  const handleQuantityChange = (type, value) => {
    setTicketCart((current) =>
      current.map((item) =>
        item.type === type ? { ...item, quantity: Math.max(0, parseInt(value, 10) || 0) } : item
      )
    );
  };

  const totalAmount = ticketCart.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  const totalTickets = ticketCart.reduce((sum, item) => sum + item.quantity, 0);

  const formatMoney = (value) => {
    const amount = Number(value || 0);
    return `${amount.toLocaleString()} VNĐ`;
  };

  const handleSearch = (event) => {
    event.preventDefault();
    handleSearchCustomer(searchTerm);
  };

  const handleCreateCustomer = async (event) => {
    event.preventDefault();

    try {
      const customer = new Customer(null, newName, newEmail, newPhone);
      const createdCustomer = await createCustomer(customer);

      alert(`Đã thêm khách hàng "${createdCustomer.name}" thành công.`);
      setShowNewCustomerForm(false);
      setNewName('');
      setNewEmail('');
      setNewPhone('');
      await handleSearchCustomer(searchTerm);
      setSelectedCustomer(createdCustomer);
    } catch (error) {
      alert(getApiErrorMessage(error, 'Không thể thêm khách hàng mới.'));
    }
  };

  const handleConfirm = () => {
    if (!selectedCustomer) {
      alert('Vui lòng chọn khách hàng.');
      return;
    }
    if (totalTickets === 0) {
      alert('Vui lòng chọn ít nhất một vé.');
      return;
    }

    navigate(`/booking/${tourId}/confirm/${scheduleId}`, {
      state: { tour, schedule, services, customer: selectedCustomer, ticketCart },
    });
  };

  return (
    <div style={styles.container}>
      <Link to={`/booking/${tourId}`} state={{ tour }} style={styles.backLink}>&larr; Quay lại danh sách lịch trình</Link>
      <h2 style={styles.title}>Thông tin khách hàng</h2>

      <div style={styles.infoTableWrap}>
        <table style={styles.infoTable}>
          <tbody>
            <tr>
              <td style={styles.infoLabel}>Tour</td>
              <td style={styles.infoValue}>{tour.name}</td>
            </tr>
            <tr>
              <td style={styles.infoLabel}>Lịch trình</td>
              <td style={styles.infoValue}>{formatDate(schedule.startDate)} - {formatDate(schedule.endDate)}</td>
            </tr>
            <tr>
              <td style={styles.infoLabel}>Loại lịch trình</td>
              <td style={styles.infoValue}>{schedule.type}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Loại vé</th>
            <th style={styles.th}>Đơn giá</th>
            <th style={styles.th}>Số lượng</th>
          </tr>
        </thead>
        <tbody>
          {ticketCart.map((item) => (
            <tr key={item.type}>
              <td style={styles.td}>{item.label}</td>
              <td style={styles.td}>{formatMoney(item.price)}</td>
              <td style={styles.td}>
                <input
                  type="number"
                  min="0"
                  value={item.quantity}
                  onChange={(event) => handleQuantityChange(item.type, event.target.value)}
                  style={styles.numberInput}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={styles.customerSection}>
        <form onSubmit={handleSearch} style={styles.searchForm}>
          <input
            id="inName"
            type="text"
            placeholder="Nhập tên khách hàng cần tìm"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            style={styles.searchInput}
          />
          <button id="btnSearch" type="submit" style={styles.button}>Tìm kiếm</button>
          <button
            type="button"
            style={styles.secondaryButton}
            onClick={() => setShowNewCustomerForm((value) => !value)}
          >
            {showNewCustomerForm ? 'Đóng form' : 'Thêm khách hàng'}
          </button>
        </form>

        {showNewCustomerForm && (
          <form onSubmit={handleCreateCustomer} style={styles.createForm}>
            <div style={styles.formLine}>
              <label style={styles.label}>Tên khách hàng:</label>
              <input type="text" value={newName} onChange={(event) => setNewName(event.target.value)} required style={styles.input} />
            </div>
            <div style={styles.formLine}>
              <label style={styles.label}>Email:</label>
              <input type="email" value={newEmail} onChange={(event) => setNewEmail(event.target.value)} required style={styles.input} />
            </div>
            <div style={styles.formLine}>
              <label style={styles.label}>Số điện thoại:</label>
              <input type="text" value={newPhone} onChange={(event) => setNewPhone(event.target.value)} style={styles.input} />
            </div>
            <button type="submit" style={styles.button}>Lưu khách hàng</button>
          </form>
        )}

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>STT</th>
              <th style={styles.th}>Tên khách hàng</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Số điện thoại</th>
              <th style={styles.th}></th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 && (
              <tr>
                <td colSpan="5" style={styles.emptyCell}>Không có khách hàng phù hợp.</td>
              </tr>
            )}
            {customers.map((customer, index) => {
              const isSelected = selectedCustomer?.id === customer.id;
              return (
                <tr key={customer.id}>
                  <td style={styles.td}>{index + 1}</td>
                  <td style={styles.td}>{customer.name}</td>
                  <td style={styles.td}>{customer.email}</td>
                  <td style={styles.td}>{customer.phone || ''}</td>
                  <td style={styles.td}>
                    <button type="button" style={styles.button} onClick={() => setSelectedCustomer(customer)}>
                      {isSelected ? 'Đã chọn' : 'Chọn'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div style={styles.footer}>
        <div style={styles.totalBox}>
          <span style={styles.totalLabel}>Tổng tiền tạm tính:</span>
          <span>{formatMoney(totalAmount)}</span>
        </div>
        <button id="btnConfirm" type="button" style={styles.button} onClick={handleConfirm}>Xác nhận</button>
      </div>
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
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { border: '1px solid #dee2e6', padding: '10px', backgroundColor: '#f8f9fa', textAlign: 'left' },
  td: { border: '1px solid #dee2e6', padding: '10px' },
  numberInput: { width: '100px', padding: '8px', border: '1px solid #ced4da', borderRadius: '5px' },
  customerSection: { display: 'flex', flexDirection: 'column', gap: '16px' },
  searchForm: { display: 'flex', gap: '10px', flexWrap: 'wrap' },
  createForm: { display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px', border: '1px solid #dee2e6', borderRadius: '8px' },
  formLine: { display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' },
  label: { minWidth: '120px', fontWeight: 'bold' },
  searchInput: { flex: '1 1 320px', padding: '10px', border: '1px solid #ced4da', borderRadius: '5px' },
  input: { padding: '10px', border: '1px solid #ced4da', borderRadius: '5px', minWidth: '280px' },
  emptyCell: { border: '1px solid #dee2e6', padding: '16px', textAlign: 'center' },
  footer: { display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'center', flexWrap: 'wrap' },
  totalBox: { display: 'flex', gap: '8px', alignItems: 'center', border: '1px solid #dee2e6', padding: '10px 14px' },
  totalLabel: { fontWeight: 'bold' },
  button: { padding: '10px 18px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' },
  secondaryButton: { padding: '10px 18px', backgroundColor: '#6c757d', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' },
};

export default CustomerPage;
