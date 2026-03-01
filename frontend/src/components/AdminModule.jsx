import React, { useState, useEffect } from 'react';
import api from '../services/api';

const AdminModule = () => {
  const [view, setView] = useState('theatres'); // Toggle between 'theatres' and 'movies'
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({});

  useEffect(() => { fetchData(); }, [view]);

  const fetchData = async () => {
    const res = await api.get(`/${view}/`); //
    setItems(res.data);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    await api.post(`/${view}/`, form); //
    setForm({});
    fetchData();
  };

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => setView('theatres')}>Manage Theatres</button>
        <button onClick={() => setView('movies')}>Manage Movies</button>
      </div>

      <div style={{ display: 'flex' }}>
        {/* Left: List */}
        <div style={{ flex: 1, borderRight: '1px solid #ddd', padding: '20px' }}>
          <h3>All {view.charAt(0).toUpperCase() + view.slice(1)}</h3>
          {items.map(item => (
            <div key={item.theatre_id || item.movie_id} style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
              {item.name || item.title} <small>({item.city || item.language})</small>
            </div>
          ))}
        </div>

        {/* Right: Create Form */}
        <div style={{ flex: 1, padding: '20px' }}>
          <h3>Add {view === 'theatres' ? 'Theatre' : 'Movie'}</h3>
          <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {view === 'theatres' ? (
              <>
                <input placeholder="Name" value={form.name || ''} onChange={e => setForm({...form, name: e.target.value})} required />
                <input placeholder="Location" value={form.location || ''} onChange={e => setForm({...form, location: e.target.value})} required />
                <input placeholder="City" value={form.city || ''} onChange={e => setForm({...form, city: e.target.value})} required />
              </>
            ) : (
              <>
                <input placeholder="Title" value={form.title || ''} onChange={e => setForm({...form, title: e.target.value})} required />
                <input placeholder="Language" value={form.language || ''} onChange={e => setForm({...form, language: e.target.value})} required />
                <input placeholder="Duration (min)" type="number" value={form.duration_mins || ''} onChange={e => setForm({...form, duration_mins: e.target.value})} required />
                <input type="date" value={form.release_date || ''} onChange={e => setForm({...form, release_date: e.target.value})} required />
                <input placeholder="Certificate" value={form.certificate || ''} onChange={e => setForm({...form, certificate: e.target.value})} required />
              </>
            )}
            <button type="submit" style={{ padding: '10px', background: '#4caf50', color: 'white', border: 'none' }}>Create Entry</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminModule;