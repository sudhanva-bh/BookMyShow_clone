import React, { useState, useEffect } from "react";
import api from "../services/api";
import MovieList from "./MovieList";
import TheatreShowtimes from "./TheatreShowtimes";
import TheatreBrowse from "./TheatreBrowse";
import CitySchedule from "./CitySchedule";
import UserProfile from "./UserProfile";
import SeatSelection from "./SeatSelection";
import PaymentSimulation from "./PaymentSimulation";
import { User, LogOut, ArrowLeft, Mail, Phone, UserPlus } from "lucide-react";

const UserModule = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [activeTab, setActiveTab] = useState("browse"); 
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedShow, setSelectedShow] = useState(null);

  useEffect(() => {
    fetchUsers();
    const savedUser = localStorage.getItem("activeUser");
    if (savedUser) setSelectedUser(JSON.parse(savedUser));
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users/");
      setUsers(res.data);
    } catch (err) {
      console.error("Fetch error", err);
    }
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    localStorage.setItem("activeUser", JSON.stringify(user));
    fetchUsers(); // Refresh list to ensure we have updated profiles
  };

  const handleLogout = () => {
    setSelectedUser(null);
    setSelectedMovie(null);
    setSelectedShow(null);
    setBookingSuccess(null);
    localStorage.removeItem("activeUser");
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post("/users/", formData);
      setFormData({ name: "", email: "", phone: "" });
      fetchUsers();
    } catch (err) {
      alert("Error: " + err.response?.data?.detail);
    }
  };

  if (selectedUser) {
    return (
      <div style={moduleWrapperLarge}>
        <div style={headerStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={avatarCircle}>
              <User size={18} color="#aaa" />
            </div>
            <div>
              <strong style={{ color: "#eee", fontSize: "0.95rem", display: "block" }}>{selectedUser.name}</strong>
              <small style={{ color: "#666", fontSize: "0.8rem", display: "block" }}>{selectedUser.email}</small>
            </div>
          </div>

          <div style={navMenuContainer}>
            <button
              onClick={() => { setActiveTab("browse"); setSelectedMovie(null); setSelectedShow(null); }}
              style={activeTab === "browse" ? activeNavBtn : navBtn}
            >
              Movies
            </button>
            <button
              onClick={() => { setActiveTab("theatres"); setSelectedShow(null); }}
              style={activeTab === "theatres" ? activeNavBtn : navBtn}
            >
              Theatres
            </button>
            <button
              onClick={() => { setActiveTab("city-schedule"); setSelectedShow(null); }}
              style={activeTab === "city-schedule" ? activeNavBtn : navBtn}
            >
              City Schedule
            </button>
            <button
              onClick={() => { setActiveTab("profile"); setSelectedShow(null); }}
              style={activeTab === "profile" ? activeNavBtn : navBtn}
            >
              Profile
            </button>
          </div>

          <button onClick={handleLogout} style={logoutBtn}>
            <LogOut size={16} /> Logout
          </button>
        </div>

        <div style={contentStyle}>
          {selectedShow && !bookingSuccess ? (
            <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "20px" }}>
                <button onClick={() => setSelectedShow(null)} style={backBtn}>
                  <ArrowLeft size={16} /> Change Show
                </button>
                <div>
                  <h2 style={{ color: "#fff", margin: 0, fontWeight: 500 }}>Select Seats</h2>
                  <p style={{ color: "#888", margin: "4px 0 0 0", fontSize: "0.9rem" }}>
                    {selectedShow.theatre?.name || "Theatre"} - {selectedShow.screen?.screen_name || "Screen"} |{" "}
                    {new Date(selectedShow.show.show_time).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}
                  </p>
                </div>
              </div>
              <SeatSelection
                user={selectedUser}
                showContext={selectedShow}
                onBack={() => setSelectedShow(null)}
                onBookingComplete={(bookingData) => setBookingSuccess(bookingData)}
              />
            </div>
          ) : bookingSuccess ? (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100%" }}>
              <PaymentSimulation
                bookingData={bookingSuccess}
                onComplete={() => {
                  setSelectedMovie(null);
                  setSelectedShow(null);
                  setBookingSuccess(null);
                  setActiveTab("profile");
                }}
                onCancel={() => setBookingSuccess(null)}
              />
            </div>
          ) : activeTab === "browse" ? (
            <>
              {!selectedMovie ? (
                <MovieList onSelectMovie={(movie) => setSelectedMovie(movie)} />
              ) : (
                <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "20px" }}>
                    <button onClick={() => setSelectedMovie(null)} style={backBtn}><ArrowLeft size={16} /> Back</button>
                    <h2 style={{ color: "#fff", margin: 0, fontWeight: 500 }}>{selectedMovie.title}</h2>
                  </div>
                  <TheatreShowtimes movie={selectedMovie} onSelectShow={(show, theatre, screen) => setSelectedShow({ show, theatre, screen })} />
                </div>
              )}
            </>
          ) : activeTab === "theatres" ? (
            <TheatreBrowse onSelectShow={(show, theatre, screen) => setSelectedShow({ show, theatre, screen })} />
          ) : activeTab === "city-schedule" ? (
            <CitySchedule onSelectShow={(show, theatre, screen) => setSelectedShow({ show, theatre, screen })} />
          ) : (
            <UserProfile user={selectedUser} onUserUpdate={handleSelectUser} />
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={moduleWrapper}>
      <div style={columnStyle}>
        <h3 style={titleStyle}>Select Profile</h3>
        <div style={scrollContainer}>
          {users.map((u) => (
            <div key={u.user_id} onClick={() => handleSelectUser(u)} style={cardStyle}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={avatarCircleSmall}><User size={14} color="#aaa" /></div>
                <div>
                  <strong style={{ color: "#eee", fontSize: "0.95rem", display: "block" }}>{u.name}</strong>
                  <small style={{ color: "#666", fontSize: "0.8rem" }}>{u.email}</small>
                </div>
              </div>
            </div>
          ))}
          {users.length === 0 && <p style={{ color: "#666", fontSize: "0.9rem" }}>No users found.</p>}
        </div>
      </div>

      <div style={{ ...columnStyle, borderLeft: "1px solid #222" }}>
        <h3 style={titleStyle}>New Profile</h3>
        <form onSubmit={handleCreate} style={formStyle}>
          <div style={inputWrapper}>
            <User size={16} color="#666" style={inputIcon} />
            <input style={inputStyle} placeholder="Full Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
          </div>
          <div style={inputWrapper}>
            <Mail size={16} color="#666" style={inputIcon} />
            <input style={inputStyle} placeholder="Email Address" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
          </div>
          <div style={inputWrapper}>
            <Phone size={16} color="#666" style={inputIcon} />
            <input style={inputStyle} placeholder="Phone Number" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required />
          </div>
          <button type="submit" style={submitBtn}><UserPlus size={16} /> Register</button>
        </form>
      </div>
    </div>
  );
};

// --- Styles ---
const navMenuContainer = { display: "flex", gap: "10px", background: "#111", padding: "4px", borderRadius: "8px", border: "1px solid #333", flexWrap: "wrap" };
const navBtn = { padding: "8px 16px", background: "transparent", color: "#888", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "0.9rem", fontWeight: "500", transition: "all 0.2s" };
const activeNavBtn = { ...navBtn, background: "#222", color: "#fff", boxShadow: "0 2px 5px rgba(0,0,0,0.5)" };
const moduleWrapper = { display: "flex", minHeight: "550px", background: "#111", borderRadius: "12px", border: "1px solid #222", overflow: "hidden" };
const moduleWrapperLarge = { display: "flex", flexDirection: "column", height: "85vh", minHeight: "650px", maxHeight: "900px", background: "#111", borderRadius: "12px", border: "1px solid #222", overflow: "hidden" };
const headerStyle = { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px 25px", background: "#0a0a0a", borderBottom: "1px solid #222" };
const avatarCircle = { width: "36px", height: "36px", borderRadius: "50%", background: "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #333" };
const avatarCircleSmall = { width: "30px", height: "30px", borderRadius: "50%", background: "#222", display: "flex", alignItems: "center", justifyContent: "center" };
const logoutBtn = { display: "flex", alignItems: "center", gap: "6px", padding: "8px 12px", background: "transparent", color: "#888", border: "1px solid #333", borderRadius: "6px", cursor: "pointer", fontSize: "0.85rem", transition: "0.2s" };
const backBtn = { display: "flex", alignItems: "center", gap: "6px", padding: "8px 15px", background: "#1a1a1a", color: "#ccc", border: "1px solid #333", borderRadius: "6px", cursor: "pointer", fontSize: "0.9rem" };
const contentStyle = { padding: "25px", flex: 1, overflowY: "auto" };
const columnStyle = { flex: 1, padding: "25px", display: "flex", flexDirection: "column" };
const titleStyle = { marginTop: 0, color: "#fff", fontSize: "1.1rem", fontWeight: 500, marginBottom: "20px" };
const scrollContainer = { flex: 1, overflowY: "auto", paddingRight: "10px" };
const cardStyle = { padding: "12px", marginBottom: "10px", cursor: "pointer", borderRadius: "8px", background: "#1a1a1a", border: "1px solid #222", transition: "border-color 0.2s" };
const formStyle = { display: "flex", flexDirection: "column", gap: "15px" };
const inputWrapper = { position: "relative" };
const inputIcon = { position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" };
const inputStyle = { width: "100%", padding: "12px 12px 12px 38px", background: "#1a1a1a", border: "1px solid #222", color: "#fff", borderRadius: "6px", boxSizing: "border-box", fontSize: "0.9rem" };
const submitBtn = { display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", padding: "12px", background: "#fff", color: "#000", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", marginTop: "5px" };

export default UserModule;