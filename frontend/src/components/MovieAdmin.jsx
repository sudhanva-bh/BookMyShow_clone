import React, { useState, useEffect } from 'react';
import api from '../services/api';

const MovieAdmin = ({ styles }) => {
  const [movies, setMovies] = useState([]);
  const [form, setForm] = useState({ title: '', language: '', duration_mins: '', release_date: '', certificate: '' });
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [movieSchedules, setMovieSchedules] = useState([]);
  const [loading, setLoading] = useState(false);

  // Stats and Edit Modal State
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [movieStats, setMovieStats] = useState(null);
  const [editForm, setEditForm] = useState(null);

  // Custom Notification Modal State
  const [notification, setNotification] = useState({ show: false, message: '', isError: false });

  useEffect(() => { fetchMovies(); }, []);

  const fetchMovies = async () => {
    try {
      const res = await api.get('/movies/');
      setMovies(res.data);
    } catch (err) { console.error("Error fetching movies", err); }
  };

  const showNotify = (message, isError = false) => {
    setNotification({ show: true, message, isError });
  };

  const handleMovieClick = async (movie) => {
    setSelectedMovie(movie);
    setLoading(true);
    try {
      const [showsRes, screensRes, theatresRes] = await Promise.all([
        api.get('/shows/'),
        api.get('/screens/'),
        api.get('/theatres/')
      ]);

      const screenMap = Object.fromEntries(screensRes.data.map(s => [s.screen_id, s]));
      const theatreMap = Object.fromEntries(theatresRes.data.map(t => [t.theatre_id, t]));

      const uniqueSchedules = [];
      const seenPairs = new Set();

      showsRes.data
        .filter(s => s.movie_id === movie.movie_id)
        .forEach(show => {
          const screen = screenMap[show.screen_id];
          const theatre = theatreMap[screen?.theatre_id];
          const pairKey = `${theatre?.theatre_id}-${screen?.screen_id}`;

          if (theatre && screen && !seenPairs.has(pairKey)) {
            seenPairs.add(pairKey);
            uniqueSchedules.push({
              id: show.show_id,
              theatreName: theatre.name,
              screenName: screen.screen_name
            });
          }
        });

      setMovieSchedules(uniqueSchedules);
    } catch (err) { 
      console.error("Error building movie schedule", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDetails = async (e, movie) => {
    e.stopPropagation(); 
    setEditForm({ ...movie });
    try {
      const res = await api.get(`/admin/stats/revenue/${movie.movie_id}`);
      setMovieStats(res.data);
    } catch (err) {
      setMovieStats({ total_revenue: 0, total_tickets: 0 });
    }
    setIsDetailModalOpen(true);
  };

  const handleUpdateMovie = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/movies/${editForm.movie_id}`, editForm);
      setIsDetailModalOpen(false);
      fetchMovies();
      showNotify("Movie details updated successfully!");
    } catch (err) {
      showNotify("Failed to update movie.", true);
    }
  };

  const handleCreateMovie = async (e) => {
    e.preventDefault();
    try {
      await api.post('/movies/', form);
      setForm({ title: '', language: '', duration_mins: '', release_date: '', certificate: '' });
      fetchMovies();
      showNotify("New movie added successfully!");
    } catch (err) { 
      showNotify("Error creating movie.", true); 
    }
  };

  return (
    <div style={styles.moduleWrapper}>
      <div style={styles.columnStyle}>
        <h3 style={styles.titleStyle}>All Movies</h3>
        <div style={styles.scrollContainer}>
          {movies.map(m => (
            <div key={m.movie_id} onClick={() => !loading && handleMovieClick(m)}
                 style={{ ...styles.cardStyle, 
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          opacity: loading ? 0.7 : 1,
                          background: selectedMovie?.movie_id === m.movie_id ? '#333' : '#1a1a1a', 
                          border: selectedMovie?.movie_id === m.movie_id ? '1px solid #f3ce00' : '1px solid #333' }}>
              <div>
                <strong style={{ color: '#fff' }}>{m.title}</strong><br/>
                <small style={{ color: '#aaa' }}>{m.language}</small>
              </div>
              
              <button 
                onClick={(e) => handleOpenDetails(e, m)}
                style={{
                  background: 'none', border: 'none', color: '#f3ce00',
                  fontSize: '1.2rem', cursor: 'pointer', padding: '5px 10px'
                }}
              >
                ▶
              </button>
            </div>
          ))}
        </div>
      </div>

      <div style={{ ...styles.columnStyle, borderLeft: '1px solid #333' }}>
        {selectedMovie ? (
          <div style={styles.flexColumn}>
            <div style={styles.headerRow}>
              <h3 style={{ margin: 0, color: '#fff', fontSize: '1.1rem' }}>Available at:</h3>
              <button onClick={() => setSelectedMovie(null)} style={styles.backSmallBtn}>Back</button>
            </div>
            <div style={styles.scrollContainer}>
              {loading ? <p style={{ color: '#666', textAlign: 'center' }}>Loading schedules...</p> : 
                movieSchedules.length > 0 ? movieSchedules.map(item => (
                <div key={item.id} style={styles.screenCard}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ color: '#fff', fontWeight: 'bold' }}>{item.theatreName}</span>
                    <span style={{ color: '#888', fontSize: '0.85rem' }}>{item.screenName}</span>
                  </div>
                </div>
              )) : <p style={{ color: '#666', textAlign: 'center', marginTop: '20px' }}>No active shows found.</p>}
            </div>
          </div>
        ) : (
          <div style={styles.flexColumn}>
            <h3 style={styles.titleStyle}>Add New Movie</h3>
            <form onSubmit={handleCreateMovie} style={styles.formStyle}>
              <input style={styles.inputStyle} placeholder="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
              <input style={styles.inputStyle} placeholder="Language" value={form.language} onChange={e => setForm({...form, language: e.target.value})} required />
              <input style={styles.inputStyle} placeholder="Duration (min)" type="number" value={form.duration_mins} onChange={e => setForm({...form, duration_mins: e.target.value})} required />
              <input style={styles.inputStyle} type="date" value={form.release_date} onChange={e => setForm({...form, release_date: e.target.value})} required />
              <input style={styles.inputStyle} placeholder="Certificate" value={form.certificate} onChange={e => setForm({...form, certificate: e.target.value})} required />
              <button type="submit" style={styles.submitBtn}>Create Movie</button>
            </form>
          </div>
        )}
      </div>

      {/* Details, Stats & Edit Modal */}
      {isDetailModalOpen && editForm && (
        <div style={styles.modalOverlay}>
          <div style={{...styles.modalContent, width: '450px'}}>
            <h3 style={{ color: '#fff', marginTop: 0 }}>Movie Insights & Edit</h3>
            
            <div style={{ background: '#222', padding: '15px', borderRadius: '8px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <small style={{ color: '#888' }}>Total Revenue</small>
                <div style={{ color: '#4caf50', fontSize: '1.2rem', fontWeight: 'bold' }}>₹{movieStats?.total_revenue || 0}</div>
              </div>
              <div>
                <small style={{ color: '#888' }}>Tickets Sold</small>
                <div style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 'bold' }}>{movieStats?.total_tickets || 0}</div>
              </div>
            </div>

            <form onSubmit={handleUpdateMovie} style={styles.formStyle}>
              <label style={{ color: '#888', fontSize: '0.8rem' }}>Title</label>
              <input style={styles.inputStyle} value={editForm.title} onChange={e => setEditForm({...editForm, title: e.target.value})} required />
              
              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ color: '#888', fontSize: '0.8rem' }}>Language</label>
                  <input style={styles.inputStyle} value={editForm.language} onChange={e => setEditForm({...editForm, language: e.target.value})} required />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ color: '#888', fontSize: '0.8rem' }}>Certificate</label>
                  <input style={styles.inputStyle} value={editForm.certificate} onChange={e => setEditForm({...editForm, certificate: e.target.value})} required />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                <button type="submit" style={{...styles.submitBtn, flex: 2}}>Save Changes</button>
                <button type="button" onClick={() => setIsDetailModalOpen(false)} style={{...styles.tab, flex: 1}}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Notification Pop-up */}
      {notification.show && (
        <div style={styles.modalOverlay}>
          <div style={{ ...styles.modalContent, width: '300px', textAlign: 'center', border: notification.isError ? '1px solid #f44336' : '1px solid #4caf50' }}>
            <div style={{ color: notification.isError ? '#f44336' : '#4caf50', fontSize: '2rem', marginBottom: '10px' }}>
              {notification.isError ? '⚠️' : '✅'}
            </div>
            <p style={{ color: '#fff', margin: '10px 0 20px 0' }}>{notification.message}</p>
            <button 
              onClick={() => setNotification({ ...notification, show: false })} 
              style={{ ...styles.submitBtn, width: '100%', background: notification.isError ? '#f44336' : '#4caf50' }}>
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieAdmin;