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
        * {
          box-sizing: border-box;
        }
        body, html {
          margin: 0;
          padding: 0;
          background-color: #0a0a0a;
          color: white;
          min-height: 100vh;
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

        /* --- CLEAN SCROLLBAR STYLES --- */
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

      {/* Main Content Area */}
      <main style={mainContentStyle}>
        {!role ? (
          <div style={selectionWrapper}>
            <div
              style={{ ...roleCard, borderRight: "1px solid #333" }}
              onClick={() => setRole("user")}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#1a1a1a")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <h2 style={roleTitle}>USER</h2>
              <p style={roleSub}>Find and book your seat</p>
            </div>

            <div
              style={roleCard}
              onClick={() => setRole("admin")}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#1a1a1a")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <h2 style={roleTitle}>ADMIN</h2>
              <p style={roleSub}>Manage the database</p>
            </div>
          </div>
        ) : (
          <div style={moduleContainer}>
            <div style={{ textAlign: "left", marginBottom: "15px" }}>
              <button onClick={() => setRole(null)} style={backBtn}>
                ← Switch Role
              </button>
            </div>
            {role === "user" && <UserModule />}
            {role === "admin" && <AdminModule />}
          </div>
        )}
      </main>

      {/* Footer Area with Logo and Project Details */}
      <footer style={footerStyle}>
        <div style={footerLeft}>
          <img src={logo} alt="KerchiefonSeat Logo" style={logoImageStyle} />
        </div>
        
        <div style={footerRight}>
          <h3 style={projectTitle}>DBS Project 1</h3>
          <div style={studentGrid}>
            <div style={studentCol}>
              <p style={studentText}>Rohan Pamulapati (2024A7PS0062H)</p>
              <p style={studentText}>Gunaganuru Vamsinadha Reddy (2024A7PS0080H)</p>
              <p style={studentText}>Sudhanva B H (2024A7PS0085H)</p>
            </div>
            <div style={studentCol}>
              <p style={studentText}>Valavala Jitendra Vinay (2024A7PS0087H)</p>
              <p style={studentText}>Nischal Reddy Muthumula (2024A7PS0151H)</p>
              <p style={studentText}>B Nikhil Radha Krishna (2024A7PS0175H)</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// --- Styles ---

const containerStyle = {
  backgroundColor: "#0a0a0a",
  color: "#ffffff",
  minHeight: "100vh",
  fontFamily: "'Inter', 'Segoe UI', sans-serif",
  display: "flex",
  flexDirection: "column",
};

const mainContentStyle = {
  flex: 1, // Pushes the footer to the bottom naturally
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  padding: "40px 20px",
  width: "100%",
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
  backgroundColor: "#0d0d0d", // slightly darker so inner modules pop
  padding: "20px",
  borderRadius: "15px",
  border: "1px solid #222",
  display: "flex",
  flexDirection: "column",
};

const backBtn = {
  padding: "8px 16px",
  background: "#1a1a1a",
  color: "#ccc",
  border: "1px solid #333",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "500",
  fontSize: "0.9rem",
  transition: "background 0.2s",
};

// --- Footer Styles ---

const footerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-end",
  padding: "20px 50px",
  backgroundColor: "#050505",
  borderTop: "1px solid #222",
  flexWrap: "wrap",
  gap: "30px",
};

const footerLeft = {
  display: "flex",
  alignItems: "flex-end",
};

const logoImageStyle = {
  height: "110px", 
  width: "auto",
  mixBlendMode: "lighten",
  marginBottom: "-10px", // Snugs it closer to the bottom edge
};

const footerRight = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end",
};

const projectTitle = {
  margin: "0 0 15px 0",
  color: "#f3ce00",
  fontSize: "1.2rem",
  fontWeight: "700",
  letterSpacing: "1px",
  textTransform: "uppercase",
};

const studentGrid = {
  display: "flex",
  gap: "40px",
  textAlign: "right",
};

const studentCol = {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
};

const studentText = {
  margin: 0,
  color: "#888",
  fontSize: "0.85rem",
};

export default App;