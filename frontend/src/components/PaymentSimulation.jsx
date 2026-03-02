import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { CreditCard, CheckCircle2, XCircle, Clock, QrCode, Smartphone, ArrowRight } from 'lucide-react';

const PaymentSimulation = ({ bookingData, onComplete, onCancel }) => {
  const [timeLeft, setTimeLeft] = useState(60); // 60 second timer to simulate expiration
  const [status, setStatus] = useState('pending'); // pending, processing, success, failed

  useEffect(() => {
    // Timer countdown logic
    if (timeLeft === 0 && status === 'pending') {
      handlePayment('failed');
      return;
    }

    const timer = setInterval(() => {
      if (status === 'pending') {
        setTimeLeft((prev) => prev - 1);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, status]);

  const handlePayment = async (result) => {
    setStatus('processing');
    
    // Simulating a brief network delay for the "Payment Gateway"
    setTimeout(async () => {
      try {
        // Adjust this endpoint based on your payments.py router definition
        // Common structure: POST /payments/ or PUT /bookings/{id}/payment
        const payload = {
          booking_id: bookingData.booking_id,
          amount: bookingData.total_amount,
          status: result === 'success' ? 'Success' : 'Failed'
        };
        
        await api.post('/payments/', payload);
        setStatus(result);
      } catch (err) {
        console.error("Payment API Error:", err);
        setStatus('failed');
      }
    }, 1500);
  };

  // Format the time as MM:SS
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  if (status === 'success') {
    return (
      <div style={resultCard}>
        <div style={iconCircleSuccess}><CheckCircle2 size={40} color="#4caf50" /></div>
        <h2 style={{ color: '#fff', margin: '10px 0' }}>Booking Confirmed!</h2>
        <p style={{ color: '#aaa', marginBottom: '20px' }}>Your payment of ₹{bookingData.total_amount} was successful.</p>
        
        <div style={ticketMockup}>
          <p style={{ margin: 0, color: '#888', fontSize: '0.8rem', textTransform: 'uppercase' }}>Booking ID</p>
          <p style={{ margin: '0 0 10px 0', color: '#fff', fontSize: '1.2rem', fontWeight: 'bold' }}>#{bookingData.booking_id}</p>
          <div style={{ borderTop: '1px dashed #333', margin: '10px 0' }}></div>
          <p style={{ margin: 0, color: '#f3ce00' }}>Show this at the theatre entrance.</p>
        </div>

        <button onClick={onComplete} style={primaryBtn}>Back to Home</button>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div style={resultCard}>
        <div style={iconCircleFailed}><XCircle size={40} color="#f44336" /></div>
        <h2 style={{ color: '#fff', margin: '10px 0' }}>Payment Failed</h2>
        <p style={{ color: '#aaa', marginBottom: '30px' }}>
          {timeLeft === 0 ? "The session expired." : "The transaction was declined or cancelled."} <br/>
          Your selected seats have been released.
        </p>
        <button onClick={onCancel} style={outlineBtn}>Try Booking Again</button>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={headerSection}>
        <div>
          <h3 style={{ margin: 0, color: '#fff', fontWeight: '500' }}>Payment Gateway</h3>
          <p style={{ margin: '4px 0 0 0', color: '#888', fontSize: '0.9rem' }}>Booking #{bookingData.booking_id}</p>
        </div>
        <div style={timerBox}>
          <Clock size={16} color={timeLeft < 15 ? '#f44336' : '#f3ce00'} />
          <span style={{ color: timeLeft < 15 ? '#f44336' : '#fff', fontWeight: 'bold' }}>
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      <div style={amountSection}>
        <span style={{ color: '#888', fontSize: '0.9rem' }}>Amount to Pay</span>
        <h1 style={{ margin: '5px 0 0 0', color: '#fff', fontSize: '2.5rem' }}>₹{bookingData.total_amount}</h1>
      </div>

      {status === 'processing' ? (
        <div style={processingState}>
          <div style={spinner}></div>
          <p style={{ color: '#aaa', marginTop: '20px' }}>Processing payment securely...</p>
          <p style={{ color: '#666', fontSize: '0.8rem' }}>Please do not close this window.</p>
        </div>
      ) : (
        <div style={paymentMethods}>
          <p style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '15px' }}>Select Simulation Method</p>
          
          <button style={methodBtn} onClick={() => handlePayment('success')}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={iconBox}><QrCode size={20} color="#4caf50" /></div>
              <div style={{ textAlign: 'left' }}>
                <strong style={{ display: 'block', color: '#fff' }}>Simulate Success</strong>
                <span style={{ color: '#888', fontSize: '0.8rem' }}>Approves the transaction</span>
              </div>
            </div>
            <ArrowRight size={18} color="#666" />
          </button>

          <button style={methodBtn} onClick={() => handlePayment('failed')}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={iconBox}><XCircle size={20} color="#f44336" /></div>
              <div style={{ textAlign: 'left' }}>
                <strong style={{ display: 'block', color: '#fff' }}>Simulate Failure</strong>
                <span style={{ color: '#888', fontSize: '0.8rem' }}>Declines and releases seats</span>
              </div>
            </div>
            <ArrowRight size={18} color="#666" />
          </button>
        </div>
      )}
    </div>
  );
};

// --- Styles ---
const containerStyle = { background: '#111', border: '1px solid #222', borderRadius: '12px', padding: '30px', maxWidth: '450px', margin: '0 auto', width: '100%' };

const headerSection = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px dashed #333', paddingBottom: '20px', marginBottom: '20px' };
const timerBox = { display: 'flex', alignItems: 'center', gap: '6px', background: '#1a1a1a', padding: '6px 12px', borderRadius: '20px', border: '1px solid #333' };

const amountSection = { textAlign: 'center', marginBottom: '30px' };

const paymentMethods = { display: 'flex', flexDirection: 'column', gap: '12px' };
const methodBtn = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '15px', background: '#1a1a1a', border: '1px solid #333', borderRadius: '10px', cursor: 'pointer', transition: 'all 0.2s' };
const iconBox = { width: '40px', height: '40px', borderRadius: '8px', background: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center' };

const processingState = { textAlign: 'center', padding: '40px 0' };
const spinner = { width: '40px', height: '40px', border: '3px solid #333', borderTop: '3px solid #f3ce00', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' };

// Add a quick keyframe style injection for the spinner
const styleSheet = document.createElement("style");
styleSheet.innerText = `@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`;
document.head.appendChild(styleSheet);

const resultCard = { background: '#111', border: '1px solid #222', borderRadius: '12px', padding: '40px', maxWidth: '450px', margin: '0 auto', width: '100%', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' };
const iconCircleSuccess = { width: '80px', height: '80px', borderRadius: '50%', background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', border: '2px solid #4caf50' };
const iconCircleFailed = { width: '80px', height: '80px', borderRadius: '50%', background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', border: '2px solid #f44336' };
const ticketMockup = { background: '#1a1a1a', border: '1px dashed #4caf50', padding: '20px', borderRadius: '8px', width: '100%', marginBottom: '30px' };

const primaryBtn = { width: '100%', padding: '14px', background: '#f3ce00', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' };
const outlineBtn = { width: '100%', padding: '14px', background: 'transparent', color: '#fff', border: '1px solid #555', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' };

export default PaymentSimulation;