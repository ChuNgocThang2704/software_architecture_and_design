import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { getTourSchedules, getTourServices } from '../api';

function SchedulePage() {
  const { tourId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const tour = location.state?.tour ?? null;
  const [schedules, setSchedules] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGetScheduleByTour = async (selectedTourId) => {
    return getTourSchedules(selectedTourId);
  };

  const handleGetServiceByTour = async (selectedTourId) => {
    return getTourServices(selectedTourId);
  };

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      if (!tourId) {
        setError('Thiếu mã tour.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');

      try {
        const [scheduleData, servicesData] = await Promise.all([
          handleGetScheduleByTour(tourId),
          handleGetServiceByTour(tourId),
        ]);

        if (!isMounted) {
          return;
        }

        setSchedules(scheduleData);
        setServices(servicesData);
      } catch (loadError) {
        if (isMounted) {
          setError('Không thể tải lịch trình hoặc dịch vụ của tour.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [tourId]);

  const formatDate = (dateStr) => {
    if (!dateStr) {
      return '';
    }

    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) {
      return String(dateStr);
    }

    return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
  };

  const formatMoney = (value) => {
    if (value === null || value === undefined) {
      return '0 VNĐ';
    }

    const amount = Number(value);
    return `${Number.isNaN(amount) ? 0 : amount.toLocaleString()} VNĐ`;
  };

  if (loading) {
    return <p style={styles.infoText}>Đang tải lịch trình và dịch vụ của tour...</p>;
  }

  if (error) {
    return <p style={styles.errorText}>{error}</p>;
  }

  const displayTourName = tour?.name || schedules[0]?.tourName || `Tour #${tourId}`;
  const displayTourDestination = tour?.destination || '';
  const displayTourType = tour?.type || '';
  const displayTourTime = tour?.time ? `${tour.time} ngày` : '';

  return (
    <div style={styles.container}>
      <Link to="/tours" style={styles.backLink}>&larr; Quay lại danh sách tour</Link>
      <h2 style={styles.title}>Danh sách lịch trình của tour</h2>

      <div style={styles.infoTableWrap}>
        <table style={styles.infoTable}>
          <tbody>
            <tr>
              <td style={styles.infoLabel}>Tên tour</td>
              <td style={styles.infoValue}>{displayTourName}</td>
            </tr>
            <tr>
              <td style={styles.infoLabel}>Điểm đến</td>
              <td style={styles.infoValue}>{displayTourDestination}</td>
            </tr>
            <tr>
              <td style={styles.infoLabel}>Loại tour</td>
              <td style={styles.infoValue}>{displayTourType}</td>
            </tr>
            <tr>
              <td style={styles.infoLabel}>Thời gian</td>
              <td style={styles.infoValue}>{displayTourTime}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style={styles.sectionWrap}>
        <h3 style={styles.sectionTitle}>Dịch vụ</h3>
        {services.length ? (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Tên dịch vụ</th>
                <th style={styles.th}>Đơn vị</th>
                <th style={styles.th}>Số lượng</th>
                <th style={styles.th}>Đơn giá</th>
                <th style={styles.th}>Ghi chú</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service.id}>
                  <td style={styles.td}>{service.name}</td>
                  <td style={styles.td}>{service.unit || ''}</td>
                  <td style={styles.td}>{service.quantity ?? ''}</td>
                  <td style={styles.td}>{formatMoney(service.price)}</td>
                  <td style={styles.td}>{service.note || ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={styles.emptyAddonText}>Tour này hiện chưa có dịch vụ đi kèm.</p>
        )}
      </div>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Ngày khởi hành</th>
            <th style={styles.th}>Ngày kết thúc</th>
            <th style={styles.th}>Số chỗ</th>
            <th style={styles.th}>Loại vé</th>
            <th style={styles.th}>Giá người lớn</th>
            <th style={styles.th}>Giá trẻ em</th>
            <th style={styles.th}></th>
          </tr>
        </thead>
        <tbody>
          {schedules.length === 0 && (
            <tr>
              <td colSpan="7" style={styles.emptyCell}>Không có lịch trình.</td>
            </tr>
          )}
          {schedules.map((schedule) => (
            <tr key={schedule.id}>
              <td style={styles.td}>{formatDate(schedule.startDate)}</td>
              <td style={styles.td}>{formatDate(schedule.endDate)}</td>
              <td style={styles.td}>{schedule.quantity}</td>
              <td style={styles.td}>{schedule.type}</td>
              <td style={styles.td}>{formatMoney(schedule.adultPrice)}</td>
              <td style={styles.td}>{formatMoney(schedule.childPrice)}</td>
              <td style={styles.td}>
                <button
                  type="button"
                  style={styles.button}
                  onClick={() => navigate(`/booking/${tourId}/customers/${schedule.id}`, { state: { tour, schedule, services } })}
                >
                  Chọn
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  container: { padding: '10px 0' },
  backLink: {
    textDecoration: 'none',
    color: '#007bff',
    fontWeight: 'bold',
    marginBottom: '20px',
    display: 'inline-block',
  },
  title: {
    color: '#007bff',
    marginBottom: '20px',
    textAlign: 'center',
  },
  infoTableWrap: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  infoTable: {
    borderCollapse: 'collapse',
    minWidth: '420px',
  },
  infoLabel: {
    border: '1px solid #dee2e6',
    padding: '10px',
    fontWeight: 'bold',
    backgroundColor: '#f8f9fa',
  },
  infoValue: {
    border: '1px solid #dee2e6',
    padding: '10px',
  },
  sectionWrap: {
    marginBottom: '24px',
  },
  sectionTitle: {
    color: '#007bff',
    marginBottom: '12px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    border: '1px solid #dee2e6',
    padding: '10px',
    backgroundColor: '#f8f9fa',
    textAlign: 'left',
  },
  td: {
    border: '1px solid #dee2e6',
    padding: '10px',
  },
  emptyCell: {
    border: '1px solid #dee2e6',
    padding: '16px',
    textAlign: 'center',
  },
  emptyAddonText: {
    margin: 0,
    padding: '12px 0',
    color: '#6c757d',
  },
  infoText: {
    textAlign: 'center',
    color: '#6c757d',
  },
  errorText: {
    textAlign: 'center',
    color: '#dc3545',
  },
  button: {
    padding: '8px 14px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default SchedulePage;
