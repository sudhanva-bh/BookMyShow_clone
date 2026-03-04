import React, { useState, useEffect } from "react";
import api from "../services/api";
import { MapPin, MonitorPlay, CalendarDays } from "lucide-react";

const TheatreShowtimes = ({ movie, onSelectShow }) => {
  const [theatres, setTheatres] = useState([]);
  const [screens, setScreens] = useState([]);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    const fetchSchedulingData = async () => {
      setLoading(true);
      try {
        const [showsRes, screensRes, theatresRes] = await Promise.all([
          api.get("/shows/"),
          api.get("/screens/"),
          api.get("/theatres/"),
        ]);

        const movieShows = showsRes.data.filter((s) => s.movie_id === movie.movie_id);
        setShows(movieShows);
        setScreens(screensRes.data);
        setTheatres(theatresRes.data);

        if (movieShows.length > 0) {
          const dates = [...new Set(movieShows.map((s) => s.show_time.split("T")[0]))].sort();
          setSelectedDate(dates[0]);
        }
      } catch (err) {
        console.error("Error fetching show data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (movie) fetchSchedulingData();
  }, [movie]);

  if (loading) return <p style={{ color: "#888", padding: "20px" }}>Loading showtimes...</p>;
  if (shows.length === 0) return <p style={{ color: "#888", padding: "20px" }}>No shows available for this movie right now.</p>;

  const availableDates = [...new Set(shows.map((s) => s.show_time.split("T")[0]))].sort();
  const showsOnDate = shows.filter((s) => s.show_time.startsWith(selectedDate));
  const groupedData = {};

  showsOnDate.forEach((show) => {
    const screen = screens.find((sc) => sc.screen_id === show.screen_id);
    if (!screen) return;
    const theatre = theatres.find((t) => t.theatre_id === screen.theatre_id);
    if (!theatre) return;

    if (!groupedData[theatre.theatre_id]) {
      groupedData[theatre.theatre_id] = { theatre, screens: {} };
    }
    if (!groupedData[theatre.theatre_id].screens[screen.screen_id]) {
      groupedData[theatre.theatre_id].screens[screen.screen_id] = { screen, shows: [] };
    }
    groupedData[theatre.theatre_id].screens[screen.screen_id].shows.push(show);
  });

  Object.values(groupedData).forEach((tData) => {
    Object.values(tData.screens).forEach((sData) => {
      sData.shows.sort((a, b) => new Date(a.show_time) - new Date(b.show_time));
    });
  });

  return (
    <div style={containerStyle}>
      <div style={dateTabContainer}>
        {availableDates.map((date) => {
          const dateObj = new Date(date);
          const displayDate = dateObj.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
          const isSelected = selectedDate === date;
          return (
            <button key={date} onClick={() => setSelectedDate(date)} style={isSelected ? activeDateTab : dateTab}>
              <CalendarDays size={16} />
              {displayDate}
            </button>
          );
        })}
      </div>

      <div style={listContainer}>
        {Object.keys(groupedData).length === 0 ? (
          <p style={{ color: "#666" }}>No shows scheduled for this date.</p>
        ) : (
          Object.values(groupedData).map(({ theatre, screens }) => (
            <div key={theatre.theatre_id} style={theatreCard}>
              <div style={theatreHeader}>
                <h3 style={theatreTitle}>{theatre.name}</h3>
                <p style={theatreLocation}><MapPin size={14} /> {theatre.location}, {theatre.city}</p>
              </div>

              {Object.values(screens).map(({ screen, shows }) => (
                <div key={screen.screen_id} style={screenSection}>
                  <p style={screenName}><MonitorPlay size={14} /> {screen.screen_name}</p>
                  <div style={timeGrid}>
                    {shows.map((show) => {
                      const time = new Date(show.show_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
                      return (
                        <button key={show.show_id} onClick={() => onSelectShow(show, theatre, screen)} style={timeBtn}>
                          <span style={timeText}>{time}</span>
                          <span style={priceText}>₹{show.seat_price}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// --- Styles ---
const containerStyle = { display: "flex", flexDirection: "column", height: "100%" };
const dateTabContainer = { display: "flex", gap: "10px", marginBottom: "20px", overflowX: "auto", paddingBottom: "5px" };
const dateTab = { display: "flex", alignItems: "center", gap: "8px", padding: "10px 16px", background: "#1a1a1a", color: "#888", border: "1px solid #333", borderRadius: "8px", cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.2s" };
const activeDateTab = { ...dateTab, background: "#f3ce00", color: "#000", border: "1px solid #f3ce00", fontWeight: "bold" };
const listContainer = { flex: 1, overflowY: "auto", paddingRight: "10px", display: "flex", flexDirection: "column", gap: "20px" };
const theatreCard = { background: "#111", border: "1px solid #222", borderRadius: "10px", padding: "20px" };
const theatreHeader = { borderBottom: "1px dashed #333", paddingBottom: "15px", marginBottom: "15px" };
const theatreTitle = { margin: 0, fontSize: "1.2rem", color: "#fff", fontWeight: "500" };
const theatreLocation = { margin: "8px 0 0 0", color: "#888", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "6px" };
const screenSection = { marginBottom: "15px", padding: "10px", background: "#1a1a1a", borderRadius: "8px", border: "1px solid #222" };
const screenName = { margin: "0 0 12px 0", color: "#ccc", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "6px", fontWeight: "500" };
const timeGrid = { display: "flex", flexWrap: "wrap", gap: "10px" };
const timeBtn = { display: "flex", flexDirection: "column", alignItems: "center", padding: "8px 16px", background: "transparent", border: "1px solid #4caf50", borderRadius: "6px", cursor: "pointer", transition: "all 0.2s" };
const timeText = { color: "#4caf50", fontSize: "1rem", fontWeight: "bold" };
const priceText = { color: "#888", fontSize: "0.8rem", marginTop: "4px" };

export default TheatreShowtimes;