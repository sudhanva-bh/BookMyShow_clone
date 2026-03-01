import React, { useState, useEffect } from 'react';
import api from '../services/api';

const UserModule = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });

  useEffect(() => {
    fetchUsers();
    // Load saved user from memory on startup
    const savedUser = localStorage.getItem('activeUser');
    if (savedUser) setSelectedUser(JSON.parse(savedUser));
  }, []);

  const fetchUsers = async () => {
    const res = await api.get('/users/'); // Connects to backend/app/routers/users.py
    setUsers(res.data);
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    localStorage.setItem('activeUser', JSON.stringify(user)); // Persistence
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/users/', formData); //
      setFormData({ name: '', email: '', phone: '' });
      fetchUsers();
    } catch (err) { alert("Error: " + err.response?.data?.detail); }
  };

  return (
    <div style={{ display: 'flex', minHeight: '60vh' }}>
      {/* Left Column: List & Select */}
      <div style={{ flex: 1, borderRight: '1px solid #ddd', padding: '20px' }}>
        <h3>Select a User</h3>
        {users.map(u => (
          <div key={u.user_id} onClick={() => handleSelectUser(u)}
               style={{ padding: '10px', border: '1px solid #eee', marginBottom: '5px', cursor: 'pointer',
                        background: selectedUser?.user_id === u.user_id ? '#fff9c4' : '#fff' }}>
            <strong>{u.name}</strong> <br/> <small>{u.email}</small>
          </div>
        ))}
        {selectedUser && (
          <div style={{ marginTop: '20px', padding: '10px', background: '#e8f5e9' }}>
            Currently Logged In: <strong>{selectedUser.name}</strong>
          </div>
        )}
      </div>

      {/* Right Column: Create */}
      <div style={{ flex: 1, padding: '20px' }}>
        <h3>Create New User</h3>
        <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input placeholder="Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
          <input placeholder="Email" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
          <input placeholder="Phone" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} required />
          <button type="submit" style={{ padding: '10px', background: '#2196f3', color: 'white', border: 'none' }}>Register User</button>
        </form>
      </div>
    </div>
  );
};

export default UserModule;