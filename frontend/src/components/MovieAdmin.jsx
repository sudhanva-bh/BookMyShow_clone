import React, { useState, useEffect } from 'react';
import api from '../services/api';

const MovieAdmin = ({ styles }) => {
  const [movies, setMovies] = useState([]);
  const [form, setForm] = useState({ title: '', language: '', duration_mins: '', release_date: '', certificate: '' });
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [movieSchedules, setMovieSchedules] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchMovies(); }, []);

  const fetchMovies = async () => {
    try {
      const res = await api.get('/movies/');
      setMovies(res.data);
    } catch (err) { console.error("Error fetching movies", err); }
  };

  const handleMovieClick = async (movie) => {
    setSelectedMovie(movie);
    setLoading(true);
    try {
      // Fetch data in parallel for efficiency
      const [showsRes, screensRes, theatresRes] = await Promise.all([
        api.get('/shows/'),
        api.get('/screens/'),
        api.get('/theatres/')
      ]);

      // Create Lookups (Dictionaries) for O(1) access instead of repeated .find()
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

  const handleCreateMovie = async (e) => {
    e.preventDefault();
    try {
      await api.post('/movies/', form);
      setForm({ title: '', language: '', duration_mins: '', release_date: '', certificate: '' });
      fetchMovies();
    } catch (err) { alert("Error creating movie"); }
  };

  return (
    <div style={styles.moduleWrapper}>
      <div style={styles.columnStyle}>
        <h3 style={styles.titleStyle}>All Movies</h3>
        <div style={styles.scrollContainer}>
          {movies.map(m => (
            <div key={m.movie_id} onClick={() => !loading && handleMovieClick(m)}
                 style={{ ...styles.cardStyle, 
                          opacity: loading ? 0.7 : 1,
                          background: selectedMovie?.movie_id === m.movie_id ? '#333' : '#1a1a1a', 
                          border: selectedMovie?.movie_id === m.movie_id ? '1px solid #f3ce00' : '1px solid #333' }}>
              <strong style={{ color: '#fff' }}>{m.title}</strong><br/>
              <small style={{ color: '#aaa' }}>{m.language}</small>
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
    </div>
  );
};

export default MovieAdmin;