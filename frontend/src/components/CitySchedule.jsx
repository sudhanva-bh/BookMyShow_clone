import React, { useState, useEffect } from "react";
import api from "../services/api";
import { MapPin, MonitorPlay, Film, CalendarDays } from "lucide-react";

const CitySchedule = ({ onSelectShow }) => {
  const [availableCities, setAvailableCities] = useState([]);
  const [city, setCity] = useState("");
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

  // Generate next 7 days for the date chip selector
  const nextDays = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d.toISOString().split("T")[0];
  });

  // Fetch available cities on component mount
  useEffect(() => {
    api.get('/theatres/cities')
      .then(res => setAvailableCities(res.data))
      .catch(console.error);
  }, []);

  // Fetch schedule automatically when a city is selected
  useEffect(() => {
    if (city) {
      setLoading(true);
      api.get("/shows/city-schedule-all", { params: { city } })
        .then(res => setSchedule(res.data))
        .catch(err => {
          console.error(err);
          setSchedule([]);
        })
        .finally(() => setLoading(false));
    } else {
      setSchedule([]); // Clear schedule if no city is selected
    }
  }, [city]);

  // Check if a show is still valid (Discard 1 hour after show ends)
  const isShowValid = (show) => {
    const durationMins = show.movie?.duration_mins || 150; // default to 2.5 hours if missing
    const bufferMins = 60; // 1 hour buffer after the movie ends
    const endTime = new Date(show.show_time).getTime() + (durationMins + bufferMins) * 60000;
    return endTime > Date.now();
  };

  // Group shows by Theatre -> Movie for cleaner UI
  const groupedSchedule = {};
  schedule.forEach(show => {
    if (!show.show_time.startsWith(selectedDate)) return;
    if (!isShowValid(show)) return;

    const theatre = show.screen?.theatre || show.theatre || { theatre_id: "unknown", name: "Unknown Theatre" };
    const tId = theatre.theatre_id;
    
    if (!groupedSchedule[tId]) {
      groupedSchedule[tId] = { theatre, movies: {} };
    }

    const movie = show.movie || { movie_id: show.movie_id, title: `Movie ${show.movie_id}` };
    const mId = movie.movie_id;

    if (!groupedSchedule[tId].movies[mId]) {
      groupedSchedule[tId].movies[mId] = { movie, shows: [] };
    }

    groupedSchedule[tId].movies[mId].shows.push(show);
  });

  // Sort shows chronologically within their screens
  Object.values(groupedSchedule).forEach(t => {
    Object.values(t.movies).forEach(m => {
      m.shows.sort((a, b) => new Date(a.show_time) - new Date(b.show_time));
    });
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap", alignItems: "center" }}>
        <div style={locationWrapper}>
          <MapPin size={18} color="#666" style={searchIcon} />
          <select 
            style={selectInputWithIcon}
            value={city}
            onChange={(e) => setCity(e.target.value)}
          >
            <option value="">Select a City...</option>
            {availableCities.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Date Selector Chips */}
      <div style={dateTabContainer}>
        {nextDays.map(date => {
          const dateObj = new Date(date);
          const displayDate = dateObj.toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric' });
          return (
            <button
              key={date}
              onClick={() => setSelectedDate(date)}
              style={selectedDate === date ? activeDateTab : dateTab}
            >
              <CalendarDays size={16} />
              {displayDate}
            </button>
          );
        })}
      </div>

      <div style={{ flex: 1, overflowY: "auto", paddingRight: "10px", display: "flex", flexDirection: "column", gap: "20px" }}>
        {!city ? (
          <p style={placeholderText}>Please select a city to view its master schedule.</p>
        ) : loading ? (
          <p style={{ color: "#888" }}>Loading master schedule for {city}...</p>
        ) : Object.keys(groupedSchedule).length === 0 ? (
          <p style={{ color: "#666" }}>No valid shows found in {city} for the selected date.</p>
        ) : (
          Object.values(groupedSchedule).map(({ theatre, movies }) => (
            <div key={theatre.theatre_id} style={cardStyle}>
              <h3 style={theatreTitle}><MapPin size={18} color="#f3ce00"/> {theatre.name}</h3>
              <p style={theatreSubtitle}>{theatre.location || 'Location not specified'}</p>

              <div style={{ marginTop: "15px", display: "flex", flexDirection: "column", gap: "15px" }}>
                {Object.values(movies).map(({ movie, shows }) => (
                  <div key={movie.movie_id} style={movieGroup}>
                    <h4 style={movieTitle}><Film size={16} /> {movie.title}</h4>
                    <div style={timeGrid}>
                      {shows.map(show => {
                        const timeStr = new Date(show.show_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                        return (
                          <button
                            key={show.show_id}
                            onClick={() => onSelectShow(show, theatre, show.screen || { screen_id: show.screen_id })}
                            style={timeBtn}
                          >
                            <span style={timeText}>{timeStr}</span>
                            <span style={screenText}><MonitorPlay size={10} style={{marginRight: '2px'}}/>{show.screen?.screen_name || 'Screen'}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// --- Styles ---
const locationWrapper = { position: 'relative', flex: 1, maxWidth: '400px' };
const searchIcon = { position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' };
const selectInputWithIcon = { width: '100%', padding: '12px 12px 12px 38px', background: '#1a1a1a', border: '1px solid #333', color: '#fff', borderRadius: '6px', cursor: 'pointer', appearance: 'none', fontSize: "1rem" };
const placeholderText = { color: "#666", textAlign: "center", padding: "40px 0", fontSize: "1.1rem" };

const dateTabContainer = { display: "flex", gap: "10px", marginBottom: "20px", overflowX: "auto", paddingBottom: "5px" };
const dateTab = { display: "flex", alignItems: "center", gap: "8px", padding: "10px 16px", background: "#1a1a1a", color: "#888", border: "1px solid #333", borderRadius: "8px", cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.2s" };
const activeDateTab = { ...dateTab, background: "#f3ce00", color: "#000", border: "1px solid #f3ce00", fontWeight: "bold" };

const cardStyle = { background: "#111", border: "1px solid #222", borderRadius: "10px", padding: "20px" };
const theatreTitle = { margin: 0, color: "#fff", display: "flex", alignItems: "center", gap: "8px", fontSize: "1.2rem", fontWeight: "500" };
const theatreSubtitle = { margin: "5px 0 0 26px", color: "#888", fontSize: "0.9rem" };

const movieGroup = { padding: "12px", background: "#1a1a1a", borderRadius: "8px", border: "1px solid #222" };
const movieTitle = { margin: "0 0 12px 0", color: "#ccc", display: "flex", alignItems: "center", gap: "8px", fontSize: "1rem" };
const timeGrid = { display: "flex", flexWrap: "wrap", gap: "10px" };
const timeBtn = { display: "flex", flexDirection: "column", alignItems: "center", padding: "8px 16px", background: "transparent", border: "1px solid #4caf50", borderRadius: "6px", cursor: "pointer", transition: "all 0.2s" };
const timeText = { color: "#4caf50", fontSize: "1rem", fontWeight: "bold" };
const screenText = { color: "#888", fontSize: "0.75rem", marginTop: "4px", display: "flex", alignItems: "center" };

export default CitySchedule;