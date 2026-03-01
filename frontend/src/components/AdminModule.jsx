import React, { useState, useEffect } from 'react';
import api from '../services/api';

const AdminModule = () => {
  const [view, setView] = useState('theatres');
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({});

  useEffect(() => { fetchData(); }, [view]);

  const fetchData = async () => {
    const res = await api.get(`/${view}/`);
    setItems(res.data);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    await api.post(`/${view}/`, form);
    setForm({});
    fetchData();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={tabContainer}>
        <button onClick={() => setView('theatres')} style={view === 'theatres' ? activeTab : tab}>Manage Theatres</button>
        <button onClick={() => setView('movies')} style={view === 'movies' ? activeTab : tab}>Manage Movies</button>
      </div>

      <div style={moduleWrapper}>
        <div style={columnStyle}>
          <h3 style={titleStyle}>All {view}</h3>
          <div style={scrollContainer}>
            {items.map(item => (
              <div key={item.theatre_id || item.movie_id} style={cardStyle}>
                <span style={{ color: '#fff' }}>{item.name || item.title}</span> 
                <br/>
                <small style={{ color: '#666' }}>{item.city || item.language}</small>
              </div>
            ))}
          </div>
        </div>

        <div style={{ ...columnStyle, borderLeft: '1px solid #333' }}>
          <h3 style={titleStyle}>Add New {view.slice(0, -1)}</h3>
          <form onSubmit={handleCreate} style={formStyle}>
            {view === 'theatres' ? (
              <>
                <input style={inputStyle} placeholder="Name" value={form.name || ''} onChange={e => setForm({...form, name: e.target.value})} required />
                <input style={inputStyle} placeholder="Location" value={form.location || ''} onChange={e => setForm({...form, location: e.target.value})} required />
                <input style={inputStyle} placeholder="City" value={form.city || ''} onChange={e => setForm({...form, city: e.target.value})} required />
              </>
            ) : (
              <>
                <input style={inputStyle} placeholder="Title" value={form.title || ''} onChange={e => setForm({...form, title: e.target.value})} required />
                <input style={inputStyle} placeholder="Language" value={form.language || ''} onChange={e => setForm({...form, language: e.target.value})} required />
                <input style={inputStyle} placeholder="Duration" type="number" value={form.duration_mins || ''} onChange={e => setForm({...form, duration_mins: e.target.value})} required />
                <input style={inputStyle} type="date" value={form.release_date || ''} onChange={e => setForm({...form, release_date: e.target.value})} required />
              </>
            )}
            <button type="submit" style={submitBtn}>Create Entry</button>
          </form>
        </div>
      </div>
    </div>
  );
};

// --- Shared Styles (reused for consistency) ---
const moduleWrapper = { display: 'flex', height: '500px', background: '#111', borderRadius: '12px', border: '1px solid #333', overflow: 'hidden' };
const columnStyle = { flex: 1, padding: '20px', display: 'flex', flexDirection: 'column' };
const titleStyle = { marginTop: 0, color: '#fff', fontSize: '1.1rem', borderBottom: '1px solid #333', paddingBottom: '10px' };
const scrollContainer = { flex: 1, overflowY: 'auto' };
const cardStyle = { padding: '10px', borderBottom: '1px solid #222' };
const formStyle = { display: 'flex', flexDirection: 'column', gap: '12px' };
const inputStyle = { padding: '10px', background: '#1a1a1a', border: '1px solid #333', color: '#fff', borderRadius: '4px' };
const submitBtn = { padding: '12px', background: '#4caf50', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' };
const tabContainer = { display: 'flex', gap: '10px' };
const tab = { padding: '8px 16px', background: '#222', color: '#888', border: '1px solid #333', borderRadius: '4px', cursor: 'pointer' };
const activeTab = { ...tab, background: '#f3ce00', color: '#000', borderColor: '#f3ce00', fontWeight: 'bold' };

export default AdminModule;