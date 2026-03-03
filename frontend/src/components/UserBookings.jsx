import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Ticket, Calendar, Clock, MapPin, MonitorPlay, X, QrCode } from 'lucide-react';

const UserBookings = ({ user }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null); // State for modal

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

  // Handle closing modal on escape key
  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') setSelectedBooking(null); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

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
            <div 
              key={booking.booking_id} 
              style={{...ticketCard, borderLeft: `4px solid ${statusColor}`}}
              onClick={() => setSelectedBooking(booking)}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={ticketHeader}>
                <h3 style={movieTitle}>{movie?.title || 'Unknown Movie'}</h3>
                <span style={{...statusBadge, color: statusColor, borderColor: statusColor}}>
                  {booking.status}
                </span>
              </div>

              <div style={ticketBody}>
                <div style={detailRow}><MapPin size={14} color="#f3ce00" /> <span style={truncate}>{theatre?.name || 'Unknown Theatre'}</span></div>
                <div style={detailRow}><MonitorPlay size={14} color="#f3ce00" /> {screen?.screen_name || 'Unknown Screen'}</div>
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
                  <p style={{...footerLabel, textAlign: 'right'}}>Amount Paid</p>
                  <p style={{...footerValue, color: '#f3ce00', textAlign: 'right'}}>₹{booking.total_amount}</p>
                </div>
              </div>
              
              {booking.status === 'Cancelled' && (
                <div style={cancelledWatermark}>CANCELLED</div>
              )}
            </div>
          );
        })}
      </div>

      {/* --- DETAILED TICKET MODAL --- */}
      {selectedBooking && (
        <TicketModal 
          booking={selectedBooking} 
          onClose={() => setSelectedBooking(null)} 
        />
      )}
    </div>
  );
};

// Modal Component for Detailed View
const TicketModal = ({ booking, onClose }) => {
  const show = booking.show;
  const movie = show?.movie;
  const screen = show?.screen;
  const theatre = screen?.theatre;
  const seats = booking.seats?.map(s => s.seat_number).join(', ') || 'N/A';
  
  const showDate = new Date(show?.show_time).toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  const showTime = new Date(show?.show_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  let statusColor = '#f3ce00';
  if (booking.status === 'Booked') statusColor = '#4caf50';
  if (booking.status === 'Cancelled') statusColor = '#f44336';

  return (
    <div style={modalOverlay} onClick={onClose}>
      <div style={modalContent} onClick={(e) => e.stopPropagation()}>
        
        {/* Modal Header */}
        <div style={modalHeader}>
          <h2 style={{ margin: 0, color: '#fff', fontSize: '1.2rem' }}>E-Ticket Details</h2>
          <button onClick={onClose} style={closeBtn}><X size={24} color="#888" /></button>
        </div>

        {/* Detailed Ticket Card */}
        <div style={detailedTicket}>
          {/* Top Half: Movie Details */}
          <div style={{ padding: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div>
                <h1 style={{ margin: '0 0 5px 0', color: '#fff', fontSize: '1.8rem' }}>{movie?.title}</h1>
                <p style={{ margin: 0, color: '#aaa', fontSize: '0.9rem' }}>{movie?.language} • {movie?.certificate}</p>
              </div>
              <span style={{...statusBadge, color: statusColor, borderColor: statusColor, fontSize: '0.85rem', padding: '6px 12px'}}>
                {booking.status}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <p style={detailLabel}>Date</p>
                <p style={detailText}><Calendar size={14} style={{ marginRight: '6px', verticalAlign: 'middle'}}/>{showDate}</p>
              </div>
              <div>
                <p style={detailLabel}>Time</p>
                <p style={detailText}><Clock size={14} style={{ marginRight: '6px', verticalAlign: 'middle'}}/>{showTime}</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <p style={detailLabel}>Theatre</p>
                <p style={detailText}><MapPin size={14} style={{ marginRight: '6px', verticalAlign: 'middle'}}/>{theatre?.name}</p>
                <p style={{ margin: '4px 0 0 0', color: '#888', fontSize: '0.8rem' }}>{theatre?.location}, {theatre?.city}</p>
              </div>
              <div>
                <p style={detailLabel}>Screen & Seats</p>
                <p style={detailText}>{screen?.screen_name}</p>
                <p style={{ margin: '4px 0 0 0', color: '#f3ce00', fontSize: '1rem', fontWeight: 'bold' }}>Seats: {seats}</p>
              </div>
            </div>
          </div>

          {/* Perforated Divider */}
          <div style={perforatedDivider}>
             <div style={semiCircleLeft}></div>
             <div style={dashedLine}></div>
             <div style={semiCircleRight}></div>
          </div>

          {/* Bottom Half: QR & Billing */}
          <div style={{ padding: '30px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(0,0,0,0.2)' }}>
            <div>
              <p style={detailLabel}>Booking ID</p>
              <p style={{ margin: '0 0 15px 0', color: '#fff', fontSize: '1.2rem', fontFamily: 'monospace' }}>{booking.booking_id.toString().padStart(8, '0')}</p>
              
              <p style={detailLabel}>Total Amount Paid</p>
              <p style={{ margin: 0, color: '#4caf50', fontSize: '1.5rem', fontWeight: 'bold' }}>₹{booking.total_amount}</p>
            </div>
            
            <div style={{ background: '#fff', padding: '10px', borderRadius: '8px' }}>
              <QrCode size={80} color="#000" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

// --- Styles ---
const containerStyle = { display: 'flex', flexDirection: 'column', height: '100%' };
const emptyState = { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '40px', textAlign: 'center' };

const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '25px', overflowY: 'auto', paddingRight: '10px', paddingBottom: '20px' };

const ticketCard = { position: 'relative', background: '#111', border: '1px solid #222', borderRadius: '10px', overflow: 'hidden', display: 'flex', flexDirection: 'column', cursor: 'pointer', transition: 'all 0.2s ease', boxShadow: '0 4px 6px rgba(0,0,0,0.3)' };

const ticketHeader = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '15px 20px', background: '#1a1a1a', borderBottom: '1px dashed #333' };
const movieTitle = { margin: 0, fontSize: '1.1rem', color: '#fff', fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '70%' };
const statusBadge = { fontSize: '0.7rem', padding: '4px 8px', borderRadius: '6px', border: '1px solid', textTransform: 'uppercase', fontWeight: 'bold', background: 'rgba(0,0,0,0.2)', letterSpacing: '0.5px' };

const ticketBody = { padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' };
const detailRow = { display: 'flex', alignItems: 'center', gap: '8px', color: '#aaa', fontSize: '0.9rem' };
const truncate = { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' };

const ticketFooter = { display: 'flex', justifyContent: 'space-between', padding: '15px 20px', background: '#0a0a0a', borderTop: '1px solid #222', marginTop: 'auto' };
const footerLabel = { margin: 0, color: '#666', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' };
const footerValue = { margin: '4px 0 0 0', color: '#fff', fontSize: '1rem', fontWeight: 'bold' };

const cancelledWatermark = { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%) rotate(-30deg)', fontSize: '3rem', color: 'rgba(244, 67, 54, 0.1)', fontWeight: '900', pointerEvents: 'none', letterSpacing: '5px' };

// Modal Styles
const modalOverlay = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px', backdropFilter: 'blur(5px)' };
const modalContent = { width: '100%', maxWidth: '550px', display: 'flex', flexDirection: 'column', gap: '15px', animation: 'slideUp 0.3s ease-out' };
const modalHeader = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 10px' };
const closeBtn = { background: 'transparent', border: 'none', cursor: 'pointer', padding: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', transition: 'background 0.2s' };

const detailedTicket = { background: '#151515', borderRadius: '16px', overflow: 'hidden', border: '1px solid #333', position: 'relative' };
const detailLabel = { margin: '0 0 6px 0', color: '#666', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' };
const detailText = { margin: 0, color: '#eee', fontSize: '1rem' };

// Perforated Divider Effect
const perforatedDivider = { position: 'relative', height: '30px', display: 'flex', alignItems: 'center', overflow: 'hidden' };
const dashedLine = { flex: 1, borderTop: '2px dashed #333' };
const semiCircleLeft = { width: '30px', height: '30px', borderRadius: '50%', background: 'rgba(0,0,0,0.8)', marginLeft: '-15px', zIndex: 2, borderRight: '1px solid #333' };
const semiCircleRight = { width: '30px', height: '30px', borderRadius: '50%', background: 'rgba(0,0,0,0.8)', marginRight: '-15px', zIndex: 2, borderLeft: '1px solid #333' };

// Inject keyframes
const styleSheet = document.createElement("style");
styleSheet.innerText = `
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(styleSheet);

export default UserBookings;