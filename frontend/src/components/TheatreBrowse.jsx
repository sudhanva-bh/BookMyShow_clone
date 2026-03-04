import React, { useState, useEffect } from "react";
import api from "../services/api";
import { MapPin, ArrowLeft, Film, CalendarDays } from "lucide-react";

const TheatreBrowse = ({ onSelectShow }) => {
  const [theatres, setTheatres] = useState([]);
  const [selectedTheatre, setSelectedTheatre] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [movies, setMovies] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(false);

  const nextDays = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d.toISOString().split("T")[0];
  });

  useEffect(() => {
    api.get("/theatres/").then(res => setTheatres(res.data)).catch(console.error);
  }, []);

  useEffect(() => {
    if (selectedTheatre && date) {
      setLoading(true);
      Promise.all([
        api.get(`/theatres/${selectedTheatre.theatre_id}/movies`),
        api.get(`/theatres/${selectedTheatre.theatre_id}/schedule`, { params: { target_date: date } })
      ]).then(([moviesRes, schedRes]) => {
        setMovies(moviesRes.data);
        setSchedule(schedRes.data);
      }).catch(console.error).finally(() => setLoading(false));
    }
  }, [selectedTheatre, date]);

  if (!selectedTheatre) {
    return (
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <h2 style={{ color: "#fff", marginBottom: "20px", fontWeight: 500, fontSize: "1.2rem" }}>Browse by Theatre</h2>
        <div style={gridStyle}>
          {theatres.map(t => (
            <div key={t.theatre_id} onClick={() => setSelectedTheatre(t)} style={theatreCardStyle}>
              <h3 style={{ margin: "0 0 10px 0", color: "#fff", fontSize: "1.1rem" }}>{t.name}</h3>
              <p style={{ margin: 0, color: "#888", display: "flex", alignItems: "center", gap: "6px", fontSize: "0.9rem" }}>
                <MapPin size={14} /> {t.location}, {t.city}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const isShowValid = (show) => {
    const durationMins = show.movie?.duration_mins || 150;
    const bufferMins = 60;
    const endTime = new Date(show.show_time).getTime() + (durationMins + bufferMins) * 60000;
    return endTime > Date.now();
  };

  const groupedSchedule = {};
  schedule.forEach(show => {
    if (!isShowValid(show)) return;
    const movie = show.movie || { movie_id: show.movie_id, title: `Movie ${show.movie_id}` };
    const mId = movie.movie_id;
    if (!groupedSchedule[mId]) {
      groupedSchedule[mId] = { movie, shows: [] };
    }
    groupedSchedule[mId].shows.push(show);
  });

  Object.values(groupedSchedule).forEach(m => {
    m.shows.sort((a, b) => new Date(a.show_time) - new Date(b.show_time));
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "20px" }}>
        <button onClick={() => setSelectedTheatre(null)} style={backBtn}>
          <ArrowLeft size={16} /> Back
        </button>
        <div>
          <h2 style={{ color: "#fff", margin: 0, fontWeight: 500 }}>{selectedTheatre.name}</h2>
          <p style={{ color: "#888", margin: "4px 0 0 0", fontSize: "0.9rem" }}>{selectedTheatre.location}, {selectedTheatre.city}</p>
        </div>
      </div>

      <div style={dateTabContainer}>
        {nextDays.map(d => {
          const dateObj = new Date(d);
          const displayDate = dateObj.toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric' });
          return (
            <button
              key={d}
              onClick={() => setDate(d)}
              style={date === d ? activeDateTab : dateTab}
            >
              <CalendarDays size={16} />
              {displayDate}
            </button>
          );
        })}
      </div>

      {loading ? (
        <p style={{ color: "#888" }}>Loading theatre schedule...</p>
      ) : (
        <div style={{ flex: 1, overflowY: "auto", paddingRight: "10px", display: "flex", flexDirection: "column", gap: "20px" }}>
          {movies.length > 0 && (
            <div style={{ marginBottom: "10px" }}>
              <h4 style={{ color: "#fff", marginBottom: "10px" }}>Now Playing Here</h4>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {movies.map(m => (
                  <span key={m.movie_id} style={moviePill}><Film size={12}/> {m.title}</span>
                ))}
              </div>
            </div>
          )}

          {Object.keys(groupedSchedule).length === 0 ? (
            <p style={{ color: "#666" }}>No valid shows scheduled for this date.</p>
          ) : (
            Object.values(groupedSchedule).map(({ movie, shows }) => (
              <div key={movie.movie_id} style={movieGroupCard}>
                <h3 style={movieTitle}><Film size={18} color="#f3ce00" /> {movie.title}</h3>
                <div style={timeGrid}>
                  {shows.map(show => {
                    const timeStr = new Date(show.show_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    return (
                      <button 
                        key={show.show_id}
                        onClick={() => onSelectShow(show, selectedTheatre, show.screen || { screen_id: show.screen_id })} 
                        style={timeBtn}
                      >
                        <span style={timeText}>{timeStr}</span>
                        <span style={priceText}>₹{show.seat_price}</span>
                        <span style={screenText}>{show.screen?.screen_name || `Screen ${show.screen_id}`}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

// --- Styles ---
const gridStyle = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px", overflowY: "auto" };
const theatreCardStyle = { background: "#111", border: "1px solid #222", borderRadius: "8px", padding: "20px", cursor: "pointer", transition: "border-color 0.2s" };
const backBtn = { display: "flex", alignItems: "center", gap: "6px", padding: "8px 15px", background: "#1a1a1a", color: "#ccc", border: "1px solid #333", borderRadius: "6px", cursor: "pointer", fontSize: "0.9rem" };
const dateTabContainer = { display: "flex", gap: "10px", marginBottom: "20px", overflowX: "auto", paddingBottom: "5px" };
const dateTab = { display: "flex", alignItems: "center", gap: "8px", padding: "10px 16px", background: "#1a1a1a", color: "#888", border: "1px solid #333", borderRadius: "8px", cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.2s" };
const activeDateTab = { ...dateTab, background: "#f3ce00", color: "#000", border: "1px solid #f3ce00", fontWeight: "bold" };
const movieGroupCard = { padding: "20px", background: "#111", border: "1px solid #222", borderRadius: "10px" };
const movieTitle = { margin: "0 0 15px 0", color: "#fff", display: "flex", alignItems: "center", gap: "8px", fontSize: "1.2rem", fontWeight: "500" };
const timeGrid = { display: "flex", flexWrap: "wrap", gap: "10px" };
const timeBtn = { display: "flex", flexDirection: "column", alignItems: "center", padding: "8px 16px", background: "transparent", border: "1px solid #4caf50", borderRadius: "6px", cursor: "pointer", transition: "all 0.2s" };
const timeText = { color: "#4caf50", fontSize: "1rem", fontWeight: "bold" };
const priceText = { color: "#888", fontSize: "0.8rem", marginTop: "4px" };
const screenText = { color: "#666", fontSize: "0.7rem", marginTop: "4px" };
const moviePill = { display: "flex", alignItems: "center", gap: "6px", background: "#222", color: "#ccc", fontSize: "0.8rem", padding: "6px 10px", borderRadius: "12px", border: "1px solid #333" };

export default TheatreBrowse;