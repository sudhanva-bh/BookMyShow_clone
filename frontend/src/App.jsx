import React, { useState } from 'react';
import UserModule from './components/UserModule';
import AdminModule from './components/AdminModule';

function App() {
  const [role, setRole] = useState(null);

  return (
    <div style={containerStyle}>
      {/* Global Style Injection for the Body/HTML edges */}
      <style>{`
        body, html {
          margin: 0;
          padding: 0;
          background-color: #0a0a0a; /* Darkest black for the edges */
          color: white;
        }
        input {
          background: #222;
          border: 1px solid #444;
          color: white;
          padding: 10px;
          border-radius: 4px;
        }
        button:hover {
          opacity: 0.8;
        }
      `}</style>

      {/* Top Heading */}
      <header style={headerStyle}>
        <h1 style={logoStyle}>KerchiefonSeat</h1>
      </header>

      <main style={mainContentStyle}>
        {!role ? (
          <div style={selectionWrapper}>
            {/* User Option (Left) */}
            <div 
              style={{ ...roleCard, borderRight: '1px solid #333' }} 
              onClick={() => setRole('user')}
              onMouseEnter={(e) => e.currentTarget.style.background = '#1a1a1a'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <h2 style={roleTitle}>USER</h2>
              <p style={roleSub}>Find and book your seat</p>
            </div>

            {/* Admin Option (Right) */}
            <div 
              style={roleCard} 
              onClick={() => setRole('admin')}
              onMouseEnter={(e) => e.currentTarget.style.background = '#1a1a1a'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <h2 style={roleTitle}>ADMIN</h2>
              <p style={roleSub}>Manage the database</p>
            </div>
          </div>
        ) : (
          <div style={moduleContainer}>
            <div style={{ textAlign: 'left', marginBottom: '20px' }}>
              <button onClick={() => setRole(null)} style={backBtn}>
                ← Switch Role
              </button>
            </div>
            {role === 'user' && <UserModule />}
            {role === 'admin' && <AdminModule />}
          </div>
        )}
      </main>
    </div>
  );
}

// --- Styles ---

const containerStyle = {
  backgroundColor: '#0a0a0a', 
  color: '#ffffff',
  minHeight: '100vh',
  width: '100vw',
  fontFamily: "'Inter', 'Segoe UI', sans-serif",
  display: 'flex',
  flexDirection: 'column',
};

const headerStyle = {
  padding: '60px 20px 20px 20px',
  textAlign: 'center',
};

const logoStyle = {
  fontSize: '3.5rem',
  fontWeight: '900',
  letterSpacing: '-2px',
  margin: 0,
  color: '#ffffff',
  textTransform: 'uppercase',
};

const mainContentStyle = {
  flex: 1,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '40px',
};

const selectionWrapper = {
  display: 'flex',
  width: '100%',
  maxWidth: '900px',
  height: '400px',
  backgroundColor: '#111',
  borderRadius: '20px',
  border: '1px solid #333',
  overflow: 'hidden',
  boxShadow: '0 20px 50px rgba(0,0,0,0.7)',
};

const roleCard = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  textAlign: 'center',
};

const roleTitle = {
  fontSize: '2.5rem',
  margin: '0 0 10px 0',
  fontWeight: '800',
  color: '#fff',
};

const roleSub = {
  color: '#666',
  fontSize: '1rem',
  letterSpacing: '1px',
};

const moduleContainer = {
  width: '100%',
  maxWidth: '1200px',
  backgroundColor: '#111',
  padding: '30px',
  borderRadius: '15px',
  border: '1px solid #222'
};

const backBtn = {
  padding: '10px 20px',
  background: '#333',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: 'bold'
};

export default App;