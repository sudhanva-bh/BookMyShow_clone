import React, { useState, useEffect } from 'react';
import api from '../services/api';

// --- Date & Time Formatting Helpers ---
const getOrdinalNum = (n) => {
  return n + (n > 0 ? ['th', 'st', 'nd', 'rd'][(n > 3 && n < 21) || n % 10 > 3 ? 0 : n % 10] : '');
};

const formatDateHeading = (dateString) => {
  const d = new Date(dateString);
  const date = d.getDate();
  const month = d.toLocaleString('en-GB', { month: 'long' });
  const year = d.getFullYear();
  const day = d.toLocaleString('en-GB', { weekday: 'long' });
  return `${day}, ${getOrdinalNum(date)} ${month} ${year}`;
};

const formatTime = (dateString) => {
  const d = new Date(dateString);
  let hours = d.getHours();
  let minutes = d.getMinutes();
  const ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  return `${hours}:${minutes}${ampm}`;
};

const TheatreAdmin = ({ styles }) => {
  const [theatres, setTheatres] = useState([]);
  const [theatreForm, setTheatreForm] = useState({ name: '', location: '', city: '' });
  const [selectedTheatre, setSelectedTheatre] = useState(null);
  const [screens, setScreens] = useState([]);
  
  // Show Management State
  const [selectedScreen, setSelectedScreen] = useState(null);
  const [screenShows, setScreenShows] = useState([]);
  const [isAddingShow, setIsAddingShow] = useState(false);
  const [moviesList, setMoviesList] = useState([]);
  const [expandedDates, setExpandedDates] = useState({}); // Track which date accordions are open
  
  const [showForm, setShowForm] = useState({ 
    movie_id: '', 
    show_time: '', 
    seat_price: 250
  });

  const [showModal, setShowModal] = useState(false); 
  const [editingScreen, setEditingScreen] = useState(null);
  
  const [screenForm, setScreenForm] = useState({ screen_name: '', rows: '', cols: '' });
  const [confirmConfig, setConfirmConfig] = useState({ show: false, type: '', targetId: null, message: '' });
  const [errorConfig, setErrorConfig] = useState({ show: false, message: '' }); // Custom Error Popup State

  useEffect(() => { 
    fetchTheatres(); 
    fetchMovies(); 
  }, []);

  const fetchTheatres = async () => {
    try {
      const res = await api.get('/theatres/');
      setTheatres(res.data);
    } catch (err) { console.error("Theatre fetch error", err); }
  };

  const fetchMovies = async () => {
    try {
      const res = await api.get('/movies/');
      setMoviesList(res.data);
    } catch (err) { console.error("Movie fetch error", err); }
  };

  const fetchScreens = async (theatreId) => {
    try {
      const res = await api.get('/screens/');
      setScreens(res.data.filter(s => s.theatre_id === theatreId));
    } catch (err) { console.error("Screen fetch error", err); }
  };

  const fetchScreenShows = async (screenId) => {
    try {
      const res = await api.get(`/shows/screen/${screenId}`);
      setScreenShows(res.data);
    } catch (err) { console.error("Error fetching screen shows", err); }
  };

  const handleScreenClick = (screen) => {
    setSelectedScreen(screen);
    setIsAddingShow(false);
    setExpandedDates({}); // Reset expansions when switching screens
    fetchScreenShows(screen.screen_id);
  };

  const handleCreateShow = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        movie_id: parseInt(showForm.movie_id),
        screen_id: selectedScreen.screen_id,
        show_time: showForm.show_time,
        seat_price: parseFloat(showForm.seat_price)
      };
      await api.post('/shows/', payload);
      setIsAddingShow(false);
      fetchScreenShows(selectedScreen.screen_id); 
    } catch (err) { 
      // Replace default alert with custom popup for time clashing
      setErrorConfig({ show: true, message: "Another show already added during that time." });
    }
  };

  const handleCreateTheatre = async (e) => {
    e.preventDefault();
    try {
      await api.post('/theatres/', theatreForm);
      setTheatreForm({ name: '', location: '', city: '' });
      fetchTheatres();
    } catch (err) { alert(err.response?.data?.detail || "Error creating theatre"); }
  };

  const triggerConfirm = (type, message, id = null) => {
    setConfirmConfig({ show: true, type, message, targetId: id });
  };

  const executeAction = async () => {
    try {
      if (confirmConfig.type === 'DELETE_SCREEN') {
        await api.delete(`/screens/${confirmConfig.targetId}`);
        fetchScreens(selectedTheatre.theatre_id);
      } else if (confirmConfig.type === 'SAVE_SCREEN') {
        const payload = {
          screen_name: screenForm.screen_name,
          rows: parseInt(screenForm.rows, 10),
          cols: parseInt(screenForm.cols, 10)
        };
        if (editingScreen) await api.put(`/screens/${editingScreen.screen_id}`, payload);
        else await api.post(`/screens/${selectedTheatre.theatre_id}`, payload);
        fetchScreens(selectedTheatre.theatre_id);
      }
      setConfirmConfig({ show: false }); 
      setShowModal(false); 
      setEditingScreen(null);
      setScreenForm({ screen_name: '', rows: '', cols: '' });
    } catch (err) { alert("Action failed"); }
  };

  const toggleDateExpansion = (dateHeading) => {
    setExpandedDates(prev => ({
      ...prev,
      [dateHeading]: !prev[dateHeading]
    }));
  };

  // --- Group Shows by Date ---
  const groupedShows = screenShows
    .sort((a, b) => new Date(a.show_time) - new Date(b.show_time)) // Sort chronologically
    .reduce((acc, sh) => {
      const dateHeading = formatDateHeading(sh.show_time);
      if (!acc[dateHeading]) acc[dateHeading] = [];
      acc[dateHeading].push(sh);
      return acc;
    }, {});

  return (
    <div style={styles.adminContainer}>
      <div style={styles.moduleWrapper}>
        <div style={styles.columnStyle}>
          <h3 style={styles.titleStyle}>All Theatres</h3>
          <div style={styles.scrollContainer}>
            {theatres.map(t => (
              <div key={t.theatre_id} onClick={() => { setSelectedTheatre(t); fetchScreens(t.theatre_id); }}
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
                <button onClick={() => setSelectedTheatre(null)} style={styles.backSmallBtn}>Back to Add</button>
              </div>
              <div style={styles.scrollContainer}>
                {screens.map(s => (
                  <div key={s.screen_id} className="screen-row" style={{...styles.screenCard, cursor: 'pointer'}} onClick={() => handleScreenClick(s)}>
                    <div style={{ color: '#fff' }}>{s.screen_name} <small style={{ color: '#888' }}>({s.rows * s.cols} seats)</small></div>
                    <div className="hover-actions" style={styles.actionGroup}>
                      <button onClick={(e) => { e.stopPropagation(); setEditingScreen(s); setScreenForm({ screen_name: s.screen_name, rows: s.rows, cols: s.cols }); setShowModal(true); }} style={styles.editBtn}>Edit</button>
                      <button onClick={(e) => { e.stopPropagation(); triggerConfirm('DELETE_SCREEN', 'Delete screen?', s.screen_id); }} style={styles.deleteBtn}>Delete</button>
                    </div>
                  </div>
                ))}
                <button onClick={() => { setEditingScreen(null); setScreenForm({ screen_name: '', rows: '', cols: '' }); setShowModal(true); }} style={styles.addScreenBtn}>+ Add Screen</button>
              </div>
            </div>
          ) : (
            <div style={styles.flexColumn}>
              <h3 style={styles.titleStyle}>Add New Theatre</h3>
              <form onSubmit={handleCreateTheatre} style={styles.formStyle}>
                <input style={styles.inputStyle} placeholder="Name" value={theatreForm.name} onChange={e => setTheatreForm({...theatreForm, name: e.target.value})} required />
                <input style={styles.inputStyle} placeholder="Area / Location" value={theatreForm.location} onChange={e => setTheatreForm({...theatreForm, location: e.target.value})} required />
                <input style={styles.inputStyle} placeholder="City" value={theatreForm.city} onChange={e => setTheatreForm({...theatreForm, city: e.target.value})} required />
                <button type="submit" style={styles.submitBtn}>Create Theatre</button>
              </form>
            </div>
          )}
        </div>

        {/* Show Management Modal */}
        {selectedScreen && (
          <div style={styles.modalOverlay}>
            <div style={{...styles.modalContent, width: '500px'}}>
              <h3 style={{ color: '#fff', marginTop: 0 }}>{selectedScreen.screen_name} - {isAddingShow ? 'New Show' : 'Schedules'}</h3>
              
              {!isAddingShow ? (
                <>
                  <div style={{ maxHeight: '400px', overflowY: 'auto', marginBottom: '20px', paddingRight: '5px' }}>
                    {Object.keys(groupedShows).length > 0 ? (
                      Object.keys(groupedShows).map(dateHeading => {
                        const isExpanded = expandedDates[dateHeading];
                        return (
                          <div key={dateHeading} style={{ marginBottom: '10px' }}>
                            <button 
                              onClick={() => toggleDateExpansion(dateHeading)}
                              style={{ 
                                width: '100%', 
                                textAlign: 'left', 
                                background: '#222', 
                                color: '#f3ce00', 
                                border: '1px solid #333', 
                                padding: '12px 15px', 
                                borderRadius: '6px', 
                                cursor: 'pointer', 
                                fontSize: '0.95rem',
                                fontWeight: 'bold',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                              }}
                            >
                              <span>{dateHeading}</span>
                              <span style={{ fontSize: '0.8rem' }}>{isExpanded ? '▼' : '▶'}</span>
                            </button>
                            
                            {/* Expandable Content Box */}
                            {isExpanded && (
                              <div style={{ marginTop: '8px', paddingLeft: '10px', borderLeft: '2px solid #333' }}>
                                {groupedShows[dateHeading].map(sh => (
                                  <div key={sh.show_id} style={{ padding: '12px', background: '#1a1a1a', border: '1px solid #222', color: '#fff', marginBottom: '8px', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                      <strong style={{ fontSize: '1.05rem' }}>{moviesList.find(m => m.movie_id === sh.movie_id)?.title || 'Loading Title...'}</strong>
                                      <div style={{ color: '#888', fontSize: '0.8rem', marginTop: '4px' }}>
                                        {sh.rows}x{sh.cols} Layout • ₹{sh.seat_price}
                                      </div>
                                    </div>
                                    <div style={{ background: '#333', padding: '6px 12px', borderRadius: '4px', fontSize: '0.9rem', fontWeight: 'bold' }}>
                                      {formatTime(sh.show_time)}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <p style={{ color: '#666', textAlign: 'center', margin: '40px 0' }}>No shows scheduled for this screen.</p>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => setIsAddingShow(true)} style={styles.submitBtn}>Add a New Show</button>
                    <button onClick={() => setSelectedScreen(null)} style={{...styles.tab, flex: 1}}>Close</button>
                  </div>
                </>
              ) : (
                <form onSubmit={handleCreateShow} style={styles.formStyle}>
                  <select style={styles.inputStyle} value={showForm.movie_id} onChange={e => setShowForm({...showForm, movie_id: e.target.value})} required>
                    <option value="">Select Movie</option>
                    {moviesList.map(m => <option key={m.movie_id} value={m.movie_id}>{m.title}</option>)}
                  </select>
                  <input style={styles.inputStyle} type="datetime-local" onChange={e => setShowForm({...showForm, show_time: e.target.value})} required />
                  <input style={styles.inputStyle} type="number" placeholder="Price" value={showForm.seat_price} onChange={e => setShowForm({...showForm, seat_price: e.target.value})} required />

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="submit" style={styles.submitBtn}>Create Schedule</button>
                    <button type="button" onClick={() => setIsAddingShow(false)} style={styles.tab}>Back</button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Screen Edit Modal */}
        {showModal && (
          <div style={styles.modalOverlay}>
            <div style={styles.modalContent}>
              <h3 style={{ color: '#fff', marginTop: 0 }}>{editingScreen ? 'Edit' : 'Add'} Screen</h3>
              <form onSubmit={(e) => { e.preventDefault(); triggerConfirm('SAVE_SCREEN', 'Save changes?'); }} style={styles.formStyle}>
                <input style={styles.inputStyle} placeholder="Screen Name" value={screenForm.screen_name} onChange={e => setScreenForm({...screenForm, screen_name: e.target.value})} required />
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input style={{...styles.inputStyle, flex: 1}} placeholder="Rows" type="number" value={screenForm.rows} onChange={e => setScreenForm({...screenForm, rows: e.target.value})} required />
                  <input style={{...styles.inputStyle, flex: 1}} placeholder="Columns" type="number" value={screenForm.cols} onChange={e => setScreenForm({...screenForm, cols: e.target.value})} required />
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="submit" style={styles.submitBtn}>Confirm</button>
                  <button type="button" onClick={() => setShowModal(false)} style={styles.tab}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
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

        {/* Custom Error Popup Modal */}
        {errorConfig.show && (
          <div style={{ ...styles.modalOverlay, zIndex: 9999 }}>
            <div style={{ ...styles.modalContent, width: '320px', textAlign: 'center', border: '1px solid #f44336' }}>
              <div style={{ color: '#f44336', fontSize: '2.5rem', marginBottom: '10px', lineHeight: 1 }}>⚠️</div>
              <h3 style={{ color: '#fff', marginTop: 0 }}>Action Failed</h3>
              <p style={{ color: '#ccc', fontSize: '0.9rem', marginBottom: '25px' }}>{errorConfig.message}</p>
              <button 
                onClick={() => setErrorConfig({ show: false, message: '' })} 
                style={{ ...styles.submitBtn, width: '100%', background: '#f44336' }}>
                Dismiss
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default TheatreAdmin;