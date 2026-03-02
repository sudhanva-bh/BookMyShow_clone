import React, { useState, useEffect } from "react";
import api from "../services/api";
import { MapPin, MonitorPlay, ArrowLeft, Film } from "lucide-react";

const TheatreBrowse = ({ onSelectShow }) => {
  const [theatres, setTheatres] = useState([]);
  const [selectedTheatre, setSelectedTheatre] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [movies, setMovies] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get("/theatres/").then(res => setTheatres(res.data)).catch(console.error);
  }, []);

  useEffect(() => {
    if (selectedTheatre && date) {
      setLoading(true);
      Promise.all([
        api.get(`/theatres/${selectedTheatre.theatre_id}/movies`),
        api.get(`/theatres/${selectedTheatre.theatre_id}/schedule`, { params: { date } })
      ]).then(([moviesRes, schedRes]) => {
        setMovies(moviesRes.data);
        setSchedule(schedRes.data);
      }).catch(console.error).finally(() => setLoading(false));
    }
  }, [selectedTheatre, date]);

  if (!selectedTheatre) {
    return (
      <div>
        <h2 style={{ color: "#fff", marginBottom: "20px", fontWeight: 500, fontSize: "1.2rem" }}>Browse by Theatre</h2>
        <div style={gridStyle}>
          {theatres.map(t => (
            <div key={t.theatre_id} onClick={() => setSelectedTheatre(t)} style={cardStyle}>
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

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px", alignItems: "center" }}>
        <span style={{ color: "#ccc", fontSize: "0.95rem" }}>Select Date:</span>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={dateInput} />
      </div>

      {loading ? (
        <p style={{ color: "#888" }}>Loading theatre schedule...</p>
      ) : (
        <div style={{ flex: 1, overflowY: "auto", paddingRight: "10px" }}>
          <div style={{ marginBottom: "20px" }}>
            <h4 style={{ color: "#fff", marginBottom: "10px" }}>Now Playing</h4>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {movies.map(m => (
                <span key={m.movie_id} style={moviePill}><Film size={12}/> {m.title}</span>
              ))}
            </div>
          </div>

          {schedule.length === 0 ? (
            <p style={{ color: "#666" }}>No shows scheduled for this date.</p>
          ) : (
            schedule.map(show => (
              <div key={show.show_id} style={scheduleCard}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <h4 style={{ color: "#fff", margin: "0 0 8px 0" }}>{show.movie?.title || `Movie ID: ${show.movie_id}`}</h4>
                    <span style={{ color: "#ccc", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "6px" }}>
                      <MonitorPlay size={14} /> {show.screen?.screen_name || `Screen ${show.screen_id}`}
                    </span>
                  </div>
                  <button 
                    onClick={() => onSelectShow(show, selectedTheatre, show.screen || { screen_id: show.screen_id })} 
                    style={timeBtn}
                  >
                    {new Date(show.show_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </button>
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
const cardStyle = { background: "#111", border: "1px solid #222", borderRadius: "8px", padding: "20px", cursor: "pointer", transition: "border-color 0.2s" };
const backBtn = { display: "flex", alignItems: "center", gap: "6px", padding: "8px 15px", background: "#1a1a1a", color: "#ccc", border: "1px solid #333", borderRadius: "6px", cursor: "pointer", fontSize: "0.9rem" };
const dateInput = { padding: "8px 12px", background: "#1a1a1a", border: "1px solid #333", color: "#fff", borderRadius: "6px", colorScheme: "dark" };
const timeBtn = { padding: "8px 16px", background: "transparent", border: "1px solid #4caf50", color: "#4caf50", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" };
const scheduleCard = { padding: "15px", background: "#111", border: "1px solid #222", borderRadius: "8px", marginBottom: "15px" };
const moviePill = { display: "flex", alignItems: "center", gap: "6px", background: "#222", color: "#ccc", fontSize: "0.8rem", padding: "6px 10px", borderRadius: "12px", border: "1px solid #333" };

export default TheatreBrowse;