import React, { useState } from 'react';
import UserModule from './components/UserModule';
import AdminModule from './components/AdminModule';

function App() {
  const [role, setRole] = useState(null); // Tracks 'user' or 'admin'

  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      <nav style={{ background: '#222', color: '#fff', padding: '15px', textAlign: 'center' }}>
        <h1 style={{ margin: 0 }}>BookMyShow Clone</h1>
        <div style={{ marginTop: '10px' }}>
          <button onClick={() => setRole('user')} style={btnStyle(role === 'user')}>USER VIEW</button>
          <button onClick={() => setRole('admin')} style={btnStyle(role === 'admin')}>ADMIN VIEW</button>
        </div>
      </nav>

      <div style={{ padding: '20px' }}>
        {!role && <h2 style={{ textAlign: 'center' }}>Please select a role to manage the system.</h2>}
        {role === 'user' && <UserModule />}
        {role === 'admin' && <AdminModule />}
      </div>
    </div>
  );
}

const btnStyle = (active) => ({
  margin: '0 10px',
  padding: '8px 20px',
  cursor: 'pointer',
  background: active ? '#f3ce00' : '#444',
  color: active ? '#000' : '#fff',
  border: 'none',
  borderRadius: '4px',
  fontWeight: 'bold'
});

export default App;