import React, { useState } from "react";
import UserModule from "./components/UserModule";
import AdminModule from "./components/AdminModule";
// Ensure your logo file is named logo.png in the src folder
import logo from "./logo.png";

function App() {
  const [role, setRole] = useState(null);

  return (
    <div style={containerStyle}>
      {/* Global Style Injection for the Body/HTML edges */}
      <style>{`
        body, html {
          margin: 0;
          padding: 0;
          background-color: #0a0a0a;
          color: white;
        }
        input {
          background: #222;
          border: 1px solid #444;
          color: white;
          padding: 10px;
          border-radius: 4px;
        }
        button:hover {
          opacity: 0.8;
        }

        /* --- NEW SCROLLBAR STYLES --- */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        ::-webkit-scrollbar-track {
          background: transparent; 
        }
        ::-webkit-scrollbar-thumb {
          background: #333; 
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #555; 
        }
      `}</style>

      {/* Header with Logo */}
      <header style={headerStyle}>
        <img src={logo} alt="KerchiefonSeat Logo" style={logoImageStyle} />
      </header>

      <main style={mainContentStyle}>
        {!role ? (
          <div style={selectionWrapper}>
            <div
              style={{ ...roleCard, borderRight: "1px solid #333" }}
              onClick={() => setRole("user")}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#1a1a1a")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              <h2 style={roleTitle}>USER</h2>
              <p style={roleSub}>Find and book your seat</p>
            </div>

            <div
              style={roleCard}
              onClick={() => setRole("admin")}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#1a1a1a")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              <h2 style={roleTitle}>ADMIN</h2>
              <p style={roleSub}>Manage the database</p>
            </div>
          </div>
        ) : (
          <div style={moduleContainer}>
            <div style={{ textAlign: "left", marginBottom: "20px" }}>
              <button onClick={() => setRole(null)} style={backBtn}>
                ← Switch Role
              </button>
            </div>
            {role === "user" && <UserModule />}
            {role === "admin" && <AdminModule />}
          </div>
        )}
      </main>
    </div>
  );
}

// --- Styles ---

const containerStyle = {
  backgroundColor: "#0a0a0a",
  color: "#ffffff",
  minHeight: "100vh",
  width: "100vw",
  fontFamily: "'Inter', 'Segoe UI', sans-serif",
  display: "flex",
  flexDirection: "column",
};

const headerStyle = {
  padding: "30px 20px 10px 20px",
  textAlign: "center",
};

const logoImageStyle = {
  height: "200px", // Increased size
  width: "auto",
  display: "block",
  margin: "0 auto",
  backgroundColor: "transparent", // Ensures no white box around logo
  mixBlendMode: "lighten", // Helps blend the logo edges with the dark background
};

const mainContentStyle = {
  flex: 1,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "40px",
};

const selectionWrapper = {
  display: "flex",
  width: "100%",
  maxWidth: "900px",
  height: "400px",
  backgroundColor: "#111",
  borderRadius: "20px",
  border: "1px solid #333",
  overflow: "hidden",
  boxShadow: "0 20px 50px rgba(0,0,0,0.7)",
};

const roleCard = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  cursor: "pointer",
  transition: "all 0.3s ease",
  textAlign: "center",
};

const roleTitle = {
  fontSize: "2.5rem",
  margin: "0 0 10px 0",
  fontWeight: "800",
  color: "#fff",
};

const roleSub = {
  color: "#666",
  fontSize: "1rem",
  letterSpacing: "1px",
};

const moduleContainer = {
  width: "100%",
  maxWidth: "1200px",
  backgroundColor: "#111",
  padding: "30px",
  borderRadius: "15px",
  border: "1px solid #222",
};

const backBtn = {
  padding: "10px 20px",
  background: "#333",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "bold",
};

export default App;
