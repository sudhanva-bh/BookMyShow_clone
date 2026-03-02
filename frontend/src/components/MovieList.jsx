import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Search, Globe, Clock, Calendar, Ticket, X, MapPin } from 'lucide-react';

const MovieList = ({ onSelectMovie }) => {
  const [movies, setMovies] = useState([]);
  const [availableCities, setAvailableCities] = useState([]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [languageFilter, setLanguageFilter] = useState('');
  const [certFilter, setCertFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');

  // Fetch available cities on component mount
  useEffect(() => {
    api.get('/theatres/cities')
      .then(res => setAvailableCities(res.data))
      .catch(console.error);
  }, []);

  // Fetch movies when city filter changes
  useEffect(() => {
    fetchMovies();
  }, [cityFilter]);

  const fetchMovies = async () => {
    try {
      if (cityFilter) {
        const res = await api.get('/shows/movies-by-city', {
          params: { city: cityFilter }
        });
        setMovies(res.data);
      } else {
        const res = await api.get('/movies/');
        setMovies(res.data);
      }
    } catch (err) {
      console.error("Error fetching movies", err);
      setMovies([]); // Graceful fallback
    }
  };

  const uniqueLanguages = [...new Set(movies.map(m => m.language))];
  const uniqueCerts = [...new Set(movies.map(m => m.certificate).filter(Boolean))];

  const filteredMovies = movies.filter(movie => {
    const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLang = languageFilter === '' || movie.language === languageFilter;
    const matchesCert = certFilter === '' || movie.certificate === certFilter;
    return matchesSearch && matchesLang && matchesCert;
  });

  return (
    <div style={containerStyle}>
      <div style={filterContainer}>
        <div style={searchWrapper}>
          <Search size={18} color="#666" style={searchIcon} />
          <input 
            style={searchInput} 
            type="text" 
            placeholder="Search movies..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Updated City Filter to be a Select Dropdown */}
        <div style={locationWrapper}>
          <MapPin size={18} color="#666" style={searchIcon} />
          <select 
            style={selectInputWithIcon}
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
          >
            <option value="">All Cities</option>
            {availableCities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>
        
        <select style={selectInput} value={languageFilter} onChange={(e) => setLanguageFilter(e.target.value)}>
          <option value="">All Languages</option>
          {uniqueLanguages.map(lang => <option key={lang} value={lang}>{lang}</option>)}
        </select>

        <select style={selectInput} value={certFilter} onChange={(e) => setCertFilter(e.target.value)}>
          <option value="">All Certs</option>
          {uniqueCerts.map(cert => <option key={cert} value={cert}>{cert}</option>)}
        </select>
        
        {(searchTerm || languageFilter || certFilter || cityFilter) && (
          <button style={clearBtn} onClick={() => { setSearchTerm(''); setLanguageFilter(''); setCertFilter(''); setCityFilter(''); }}>
            <X size={16} />
          </button>
        )}
      </div>

      <div style={gridStyle}>
        {filteredMovies.length > 0 ? (
          filteredMovies.map(movie => (
            <div key={movie.movie_id} style={movieCard}>
              <div style={cardHeader}>
                <h3 style={movieTitle}>{movie.title}</h3>
                <span style={certBadge}>{movie.certificate || 'U'}</span>
              </div>
              
              <div style={detailsWrapper}>
                <p style={movieDetail}><Globe size={14} /> {movie.language}</p>
                <p style={movieDetail}><Clock size={14} /> {movie.duration_mins} mins</p>
                <p style={movieDetail}><Calendar size={14} /> {new Date(movie.release_date).toLocaleDateString()}</p>
              </div>
              
              <button style={bookBtn} onClick={() => onSelectMovie(movie)}>
                <Ticket size={16} /> Book Tickets
              </button>
            </div>
          ))
        ) : (
          <p style={emptyText}>No movies found matching your criteria.</p>
        )}
      </div>
    </div>
  );
};

// --- Styles ---
const containerStyle = { display: 'flex', flexDirection: 'column', height: '100%' };
const filterContainer = { display: 'flex', gap: '10px', marginBottom: '25px', flexWrap: 'wrap', alignItems: 'center' };
const searchWrapper = { position: 'relative', flex: 2, minWidth: '180px' };
const locationWrapper = { position: 'relative', flex: 1, minWidth: '150px' };
const searchIcon = { position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' };
const searchInput = { width: '100%', padding: '10px 10px 10px 38px', background: '#1a1a1a', border: '1px solid #333', color: '#fff', borderRadius: '6px', boxSizing: 'border-box' };
const selectInputWithIcon = { width: '100%', padding: '10px 10px 10px 38px', background: '#1a1a1a', border: '1px solid #333', color: '#fff', borderRadius: '6px', cursor: 'pointer', appearance: 'none' };
const selectInput = { flex: 1, minWidth: '130px', padding: '10px', background: '#1a1a1a', border: '1px solid #333', color: '#fff', borderRadius: '6px', cursor: 'pointer' };
const clearBtn = { display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px', background: 'transparent', border: '1px solid #333', color: '#888', borderRadius: '6px', cursor: 'pointer' };

const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px', overflowY: 'auto', paddingRight: '5px' };
const movieCard = { background: '#111', border: '1px solid #222', borderRadius: '8px', padding: '20px', display: 'flex', flexDirection: 'column', transition: 'border-color 0.2s', cursor: 'pointer' };
const cardHeader = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' };
const movieTitle = { margin: 0, fontSize: '1.1rem', color: '#fff', fontWeight: '600' };
const certBadge = { background: '#222', color: '#aaa', fontSize: '0.7rem', padding: '4px 8px', borderRadius: '4px', border: '1px solid #333' };
const detailsWrapper = { display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' };
const movieDetail = { margin: 0, color: '#888', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' };
const bookBtn = { marginTop: 'auto', padding: '10px', background: 'transparent', color: '#f3ce00', border: '1px solid #f3ce00', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s' };
const emptyText = { color: '#666', gridColumn: '1 / -1', textAlign: 'center', padding: '40px 0' };

export default MovieList;