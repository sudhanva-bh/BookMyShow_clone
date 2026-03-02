import React, { useState, useEffect } from "react";
import api from "../services/api";
import { MapPin, MonitorPlay, Film, CalendarDays } from "lucide-react";

const CitySchedule = ({ onSelectShow }) => {
  const [availableCities, setAvailableCities] = useState([]);
  const [city, setCity] = useState("");
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(false);

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

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ display: "flex", gap: "10px", marginBottom: "25px", flexWrap: "wrap", alignItems: "center" }}>
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

      <div style={{ flex: 1, overflowY: "auto", paddingRight: "10px" }}>
        {!city ? (
          <p style={placeholderText}>Please select a city to view its master schedule.</p>
        ) : loading ? (
          <p style={{ color: "#888" }}>Loading master schedule for {city}...</p>
        ) : schedule.length === 0 ? (
          <p style={{ color: "#666" }}>No shows found in {city}.</p>
        ) : (
          schedule.map(show => (
            <div key={show.show_id} style={cardStyle}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "15px" }}>
                <h3 style={{ margin: 0, color: "#fff", display: "flex", alignItems: "center", gap: "8px", fontSize: "1.1rem" }}>
                  <Film size={18} color="#f3ce00" /> {show.movie?.title || `Movie ID: ${show.movie_id}`}
                </h3>
                <div style={{ textAlign: "right" }}>
                  <span style={{ color: "#4caf50", fontWeight: "bold", fontSize: "1.1rem", display: "block" }}>
                    {new Date(show.show_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <span style={{ color: "#aaa", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "4px", justifyContent: "flex-end", marginTop: "4px" }}>
                     <CalendarDays size={12}/> {new Date(show.show_time).toLocaleDateString([], { month: 'short', day: 'numeric', weekday: 'short' })}
                  </span>
                </div>
              </div>
              
              <p style={{ margin: "0 0 12px 0", color: "#ccc", display: "flex", alignItems: "center", gap: "6px", fontSize: "0.95rem" }}>
                <MapPin size={14} /> {show.theatre?.name || `Theatre ID: ${show.theatre_id}`}
              </p>
              
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px dashed #333", paddingTop: "12px" }}>
                <span style={{ color: "#888", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "6px" }}>
                  <MonitorPlay size={14} /> {show.screen?.screen_name || `Screen ID: ${show.screen_id}`}
                </span>
                <button
                  onClick={() => onSelectShow(
                    show, 
                    show.theatre || { theatre_id: show.theatre_id, name: 'Selected Theatre' }, 
                    show.screen || { screen_id: show.screen_id }
                  )}
                  style={bookBtn}
                >
                  Select Seats
                </button>
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

const cardStyle = { background: "#111", border: "1px solid #222", borderRadius: "8px", padding: "20px", marginBottom: "15px", transition: "border-color 0.2s" };
const bookBtn = { padding: "8px 16px", background: "transparent", border: "1px solid #f3ce00", color: "#f3ce00", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", transition: "0.2s" };

export default CitySchedule;