import React, { useState, useEffect } from 'react';
import api from '../services/api';

const UserModule = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });

  useEffect(() => {
    fetchUsers();
    const savedUser = localStorage.getItem('activeUser');
    if (savedUser) setSelectedUser(JSON.parse(savedUser));
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users/');
      setUsers(res.data);
    } catch (err) { console.error("Fetch error", err); }
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    localStorage.setItem('activeUser', JSON.stringify(user));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/users/', formData);
      setFormData({ name: '', email: '', phone: '' });
      fetchUsers();
    } catch (err) { alert("Error: " + err.response?.data?.detail); }
  };

  return (
    <div style={moduleWrapper}>
      {/* Left Column: Fixed List */}
      <div style={columnStyle}>
        <h3 style={titleStyle}>Select a User</h3>
        <div style={scrollContainer}>
          {users.map(u => (
            <div key={u.user_id} onClick={() => handleSelectUser(u)}
                 style={{ ...cardStyle, background: selectedUser?.user_id === u.user_id ? '#333' : '#1a1a1a', border: selectedUser?.user_id === u.user_id ? '1px solid #f3ce00' : '1px solid #333' }}>
              <strong style={{ color: '#fff' }}>{u.name}</strong> <br/> 
              <small style={{ color: '#aaa' }}>{u.email}</small>
            </div>
          ))}
        </div>
        {selectedUser && (
          <div style={activeUserBadge}>
            Logged In: <strong style={{ color: '#f3ce00' }}>{selectedUser.name}</strong>
          </div>
        )}
      </div>

      {/* Right Column: Fixed Form */}
      <div style={{ ...columnStyle, borderLeft: '1px solid #333' }}>
        <h3 style={titleStyle}>Create New User</h3>
        <form onSubmit={handleCreate} style={formStyle}>
          <input style={inputStyle} placeholder="Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
          <input style={inputStyle} placeholder="Email" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
          <input style={inputStyle} placeholder="Phone" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} required />
          <button type="submit" style={submitBtn}>Register User</button>
        </form>
      </div>
    </div>
  );
};

// --- Module Styles ---
const moduleWrapper = { display: 'flex', height: '500px', background: '#111', borderRadius: '12px', overflow: 'hidden' };
const columnStyle = { flex: 1, padding: '20px', display: 'flex', flexDirection: 'column' };
const titleStyle = { marginTop: 0, color: '#fff', fontSize: '1.2rem', borderBottom: '1px solid #333', paddingBottom: '10px' };
const scrollContainer = { flex: 1, overflowY: 'auto', paddingRight: '10px' };
const cardStyle = { padding: '12px', marginBottom: '8px', cursor: 'pointer', borderRadius: '8px', transition: '0.2s' };
const activeUserBadge = { marginTop: '15px', padding: '10px', background: '#1a1a1a', borderRadius: '6px', fontSize: '0.9rem', border: '1px solid #222' };
const formStyle = { display: 'flex', flexDirection: 'column', gap: '15px' };
const inputStyle = { padding: '12px', background: '#1a1a1a', border: '1px solid #333', color: '#fff', borderRadius: '6px' };
const submitBtn = { padding: '12px', background: '#2196f3', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' };

export default UserModule;