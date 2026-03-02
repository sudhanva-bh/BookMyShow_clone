import React, { useState } from "react";
import api from "../services/api";
import { Search, MapPin, MonitorPlay, Film } from "lucide-react";

const CitySchedule = ({ onSelectShow }) => {
  const [city, setCity] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!city || !date) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await api.get("/shows/city-schedule", { params: { city, date } });
      setSchedule(res.data);
    } catch (err) {
      console.error(err);
      setSchedule([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <form onSubmit={handleSearch} style={{ display: "flex", gap: "10px", marginBottom: "25px", flexWrap: "wrap" }}>
        <input
          type="text"
          placeholder="Enter City Name (e.g. Hyderabad)"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          style={inputStyle}
          required
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{ ...inputStyle, minWidth: "150px" }}
          required
        />
        <button type="submit" style={searchBtn}>
          <Search size={16} /> Load City Schedule
        </button>
      </form>

      <div style={{ flex: 1, overflowY: "auto", paddingRight: "10px" }}>
        {loading ? (
          <p style={{ color: "#888" }}>Loading master schedule for {city}...</p>
        ) : searched && schedule.length === 0 ? (
          <p style={{ color: "#666" }}>No shows found in {city} on this date.</p>
        ) : (
          schedule.map(show => (
            <div key={show.show_id} style={cardStyle}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "15px" }}>
                <h3 style={{ margin: 0, color: "#fff", display: "flex", alignItems: "center", gap: "8px", fontSize: "1.1rem" }}>
                  <Film size={18} color="#f3ce00" /> {show.movie?.title || `Movie ID: ${show.movie_id}`}
                </h3>
                <span style={{ color: "#4caf50", fontWeight: "bold", fontSize: "1.1rem" }}>
                  {new Date(show.show_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
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
const inputStyle = { padding: "10px", background: "#1a1a1a", border: "1px solid #333", color: "#fff", borderRadius: "6px", minWidth: "220px", colorScheme: "dark" };
const searchBtn = { display: "flex", alignItems: "center", gap: "8px", padding: "10px 20px", background: "#f3ce00", color: "#000", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" };
const cardStyle = { background: "#111", border: "1px solid #222", borderRadius: "8px", padding: "20px", marginBottom: "15px", transition: "border-color 0.2s" };
const bookBtn = { padding: "8px 16px", background: "transparent", border: "1px solid #f3ce00", color: "#f3ce00", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", transition: "0.2s" };

export default CitySchedule;