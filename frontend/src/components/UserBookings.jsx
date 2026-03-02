import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Ticket, Calendar, Clock, MapPin, MonitorPlay, AlertCircle } from 'lucide-react';

const UserBookings = ({ user }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get(`/bookings/user/${user.user_id}`);
        setBookings(res.data);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchBookings();
  }, [user]);

  if (loading) return <p style={{ color: '#888', padding: '20px' }}>Loading your tickets...</p>;

  if (bookings.length === 0) {
    return (
      <div style={emptyState}>
        <Ticket size={48} color="#333" style={{ marginBottom: '15px' }} />
        <h3 style={{ color: '#fff', margin: 0 }}>No Bookings Found</h3>
        <p style={{ color: '#888' }}>You haven't booked any movies yet.</p>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <h2 style={{ color: '#fff', marginTop: 0, marginBottom: '20px', fontWeight: 500 }}>My Tickets</h2>
      
      <div style={gridStyle}>
        {bookings.map((booking) => {
          const show = booking.show;
          const movie = show?.movie;
          const screen = show?.screen;
          const theatre = screen?.theatre;
          
          const showDate = new Date(show?.show_time).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
          const showTime = new Date(show?.show_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

          // Determine color based on status
          let statusColor = '#f3ce00'; // Pending
          if (booking.status === 'Booked') statusColor = '#4caf50'; // Green
          if (booking.status === 'Cancelled') statusColor = '#f44336'; // Red

          return (
            <div key={booking.booking_id} style={{...ticketCard, borderLeft: `4px solid ${statusColor}`}}>
              
              <div style={ticketHeader}>
                <h3 style={movieTitle}>{movie?.title || 'Unknown Movie'}</h3>
                <span style={{...statusBadge, color: statusColor, borderColor: statusColor}}>
                  {booking.status}
                </span>
              </div>

              <div style={ticketBody}>
                <div style={detailRow}><MapPin size={14} /> {theatre?.name || 'Unknown Theatre'}</div>
                <div style={detailRow}><MonitorPlay size={14} /> {screen?.screen_name || 'Unknown Screen'}</div>
                <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                  <div style={detailRow}><Calendar size={14} /> {showDate}</div>
                  <div style={detailRow}><Clock size={14} /> {showTime}</div>
                </div>
              </div>

              <div style={ticketFooter}>
                <div>
                  <p style={footerLabel}>Booking ID</p>
                  <p style={footerValue}>#{booking.booking_id}</p>
                </div>
                <div>
                  <p style={footerLabel}>Amount Paid</p>
                  <p style={{...footerValue, color: '#f3ce00'}}>₹{booking.total_amount}</p>
                </div>
              </div>
              
              {/* Optional: Add a watermark if cancelled */}
              {booking.status === 'Cancelled' && (
                <div style={cancelledWatermark}>CANCELLED</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- Styles ---
const containerStyle = { display: 'flex', flexDirection: 'column', height: '100%' };
const emptyState = { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '40px', textAlign: 'center' };

const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', overflowY: 'auto', paddingRight: '10px' };

const ticketCard = { position: 'relative', background: '#111', borderTop: '1px solid #222', borderRight: '1px solid #222', borderBottom: '1px solid #222', borderRadius: '8px', overflow: 'hidden', display: 'flex', flexDirection: 'column' };

const ticketHeader = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '15px 20px', background: '#1a1a1a', borderBottom: '1px dashed #333' };
const movieTitle = { margin: 0, fontSize: '1.2rem', color: '#fff', fontWeight: 'bold' };
const statusBadge = { fontSize: '0.75rem', padding: '4px 8px', borderRadius: '4px', border: '1px solid', textTransform: 'uppercase', fontWeight: 'bold', background: 'rgba(0,0,0,0.2)' };

const ticketBody = { padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' };
const detailRow = { display: 'flex', alignItems: 'center', gap: '8px', color: '#aaa', fontSize: '0.9rem' };

const ticketFooter = { display: 'flex', justifyContent: 'space-between', padding: '15px 20px', background: '#0a0a0a', borderTop: '1px solid #222', marginTop: 'auto' };
const footerLabel = { margin: 0, color: '#666', fontSize: '0.75rem', textTransform: 'uppercase' };
const footerValue = { margin: '4px 0 0 0', color: '#fff', fontSize: '1rem', fontWeight: 'bold' };

const cancelledWatermark = { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%) rotate(-30deg)', fontSize: '3rem', color: 'rgba(244, 67, 54, 0.1)', fontWeight: '900', pointerEvents: 'none', letterSpacing: '5px' };

export default UserBookings;