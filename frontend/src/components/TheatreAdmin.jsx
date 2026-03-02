import React, { useState, useEffect } from 'react';
import api from '../services/api';

const TheatreAdmin = ({ styles }) => {
  const [theatres, setTheatres] = useState([]);
  const [form, setForm] = useState({ name: '', location: '', city: '' });
  const [selectedTheatre, setSelectedTheatre] = useState(null);
  const [screens, setScreens] = useState([]);
  
  const [showModal, setShowModal] = useState(false);
  const [editingScreen, setEditingScreen] = useState(null);
  const [screenForm, setScreenForm] = useState({ screen_name: '', total_capacity: '' });
  const [confirmConfig, setConfirmConfig] = useState({ show: false, type: '', targetId: null, message: '' });

  useEffect(() => { fetchTheatres(); }, []);

  const fetchTheatres = async () => {
    try {
      const res = await api.get('/theatres/');
      setTheatres(res.data);
    } catch (err) { console.error("Theatre fetch error", err); }
  };

  const fetchScreens = async (theatreId) => {
    try {
      // Backend returns all screens; filter by the specific theatre_id
      const res = await api.get('/screens/');
      setScreens(res.data.filter(s => s.theatre_id === theatreId));
    } catch (err) { console.error("Screen fetch error", err); }
  };

  const handleCreateTheatre = async (e) => {
    e.preventDefault();
    try {
      await api.post('/theatres/', form);
      setForm({ name: '', location: '', city: '' });
      fetchTheatres();
    } catch (err) { alert(err.response?.data?.detail || "Error creating theatre"); }
  };

  const handleTheatreClick = (theatre) => {
    setSelectedTheatre(theatre);
    fetchScreens(theatre.theatre_id);
  };

  const triggerConfirm = (type, message, id = null) => {
    setConfirmConfig({ show: true, type, message, targetId: id });
  };

  const executeAction = async () => {
    try {
      if (confirmConfig.type === 'SAVE_SCREEN') {
        if (editingScreen) {
          await api.put(`/screens/${editingScreen.screen_id}`, screenForm);
        } else {
          await api.post(`/screens/${selectedTheatre.theatre_id}`, screenForm);
        }
      } else if (confirmConfig.type === 'DELETE_SCREEN') {
        await api.delete(`/screens/${confirmConfig.targetId}`);
      }
      
      // Cleanup and refresh
      setConfirmConfig({ show: false });
      setEditingScreen(null);
      setShowModal(false);
      setScreenForm({ screen_name: '', total_capacity: '' });
      fetchScreens(selectedTheatre.theatre_id);
    } catch (err) { alert("Action failed"); }
  };

  return (
    <div style={styles.moduleWrapper}>
      <div style={styles.columnStyle}>
        <h3 style={styles.titleStyle}>All Theatres</h3>
        <div style={styles.scrollContainer}>
          {theatres.map(t => (
            <div key={t.theatre_id} onClick={() => handleTheatreClick(t)}
                 style={{ ...styles.cardStyle, 
                          background: selectedTheatre?.theatre_id === t.theatre_id ? '#333' : '#1a1a1a', 
                          border: selectedTheatre?.theatre_id === t.theatre_id ? '1px solid #f3ce00' : '1px solid #333' }}>
              <strong style={{ color: '#fff' }}>{t.name}</strong><br/>
              <small style={{ color: '#aaa' }}>{t.city}</small>
            </div>
          ))}
        </div>
      </div>

      <div style={{ ...styles.columnStyle, borderLeft: '1px solid #333' }}>
        {selectedTheatre ? (
          <div style={styles.flexColumn}>
            <div style={styles.headerRow}>
              <h3 style={{ margin: 0, color: '#fff', fontSize: '1.1rem' }}>{selectedTheatre.name} Screens</h3>
              <button onClick={() => setSelectedTheatre(null)} style={styles.backSmallBtn}>Back</button>
            </div>
            <div style={styles.scrollContainer}>
              {screens.map(s => (
                <div key={s.screen_id} className="screen-row" style={styles.screenCard}>
                  <div style={{ color: '#fff' }}>{s.screen_name} <small style={{ color: '#888' }}>({s.total_capacity} seats)</small></div>
                  <div className="hover-actions" style={styles.actionGroup}>
                    <button onClick={() => { setEditingScreen(s); setScreenForm({ screen_name: s.screen_name, total_capacity: s.total_capacity }); setShowModal(true); }} style={styles.editBtn}>Edit</button>
                    <button onClick={() => triggerConfirm('DELETE_SCREEN', 'Delete this screen?', s.screen_id)} style={styles.deleteBtn}>Delete</button>
                  </div>
                </div>
              ))}
              <button onClick={() => { setEditingScreen(null); setScreenForm({ screen_name: '', total_capacity: '' }); setShowModal(true); }} style={styles.addScreenBtn}>+ Add Screen</button>
            </div>
          </div>
        ) : (
          <div style={styles.flexColumn}>
            <h3 style={styles.titleStyle}>Add New Theatre</h3>
            <form onSubmit={handleCreateTheatre} style={styles.formStyle}>
              <input style={styles.inputStyle} placeholder="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
              <input style={styles.inputStyle} placeholder="Area / Location" value={form.location} onChange={e => setForm({...form, location: e.target.value})} required />
              <input style={styles.inputStyle} placeholder="City" value={form.city} onChange={e => setForm({...form, city: e.target.value})} required />
              <button type="submit" style={styles.submitBtn}>Create Theatre</button>
            </form>
          </div>
        )}
      </div>

      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h3 style={{ color: '#fff', marginTop: 0 }}>{editingScreen ? 'Edit' : 'Add'} Screen</h3>
            <form onSubmit={(e) => { e.preventDefault(); triggerConfirm('SAVE_SCREEN', 'Save changes?'); }} style={styles.formStyle}>
              <input style={styles.inputStyle} placeholder="Screen Name" value={screenForm.screen_name} onChange={e => setScreenForm({...screenForm, screen_name: e.target.value})} required />
              <input style={styles.inputStyle} placeholder="Capacity" type="number" value={screenForm.total_capacity} onChange={e => setScreenForm({...screenForm, total_capacity: e.target.value})} required />
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" style={{ ...styles.submitBtn, flex: 1 }}>Confirm</button>
                <button type="button" onClick={() => setShowModal(false)} style={{ ...styles.tab, flex: 1 }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {confirmConfig.show && (
        <div style={styles.modalOverlay}>
          <div style={{ ...styles.modalContent, width: '320px', textAlign: 'center' }}>
            <h3 style={{ color: '#fff' }}>{confirmConfig.message}</h3>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={executeAction} style={{ ...styles.submitBtn, flex: 1, background: confirmConfig.type === 'DELETE_SCREEN' ? '#f44336' : '#4caf50' }}>Confirm</button>
              <button onClick={() => setConfirmConfig({ show: false })} style={{ ...styles.tab, flex: 1 }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TheatreAdmin;