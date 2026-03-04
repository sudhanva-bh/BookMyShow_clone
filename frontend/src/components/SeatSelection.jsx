import React, { useState, useEffect } from "react";
import api from "../services/api";
import { CreditCard, CheckCircle2, XCircle, AlertCircle } from "lucide-react";

const SeatSelection = ({ user, showContext, onBack, onBookingComplete }) => {
  const { show, theatre, screen } = showContext;
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSeats();
    const interval = setInterval(fetchSeats, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchSeats = async () => {
    try {
      const res = await api.get(`/shows/${show.show_id}/seats`);

      const sortedSeats = res.data.sort((a, b) => a.seat_id - b.seat_id);

      setSeats(sortedSeats);
    } catch (err) {
      console.error("Error fetching seats:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSeat = (seat) => {
    if (seat.status !== "UNBOOKED") return; 

    if (selectedSeats.find((s) => s.seat_id === seat.seat_id)) {
      setSelectedSeats([]);
    } else {
      setSelectedSeats([seat]);
    }
  };
  const handleCheckout = async () => {
    if (selectedSeats.length === 0) return;

    try {
      const payload = {
        user_id: user.user_id,
        show_id: show.show_id,
        seat_ids: selectedSeats.map((s) => s.seat_id),
      };

      const res = await api.post("/bookings/", payload);
      onBookingComplete(res.data);
    } catch (err) {
      alert("Booking failed: " + (err.response?.data?.detail || err.message));
      fetchSeats(); 
      setSelectedSeats([]); 
    }
  };

  if (loading && seats.length === 0)
    return (
      <p style={{ color: "#888", padding: "20px" }}>Loading seat map...</p>
    );

  const totalPrice = selectedSeats.length * parseFloat(show.seat_price);

  return (
    <div style={containerStyle}>
      <div style={gridArea}>
        {/* The Screen Graphic */}
        <div style={screenContainer}>
          <div style={screenCurve}></div>
          <p style={screenText}>All eyes this way</p>
        </div>

        {/* The Seat Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${screen?.cols || show?.cols || 10}, minmax(25px, 35px))`,
            gap: "8px",
            justifyContent: "center",
            marginBottom: "40px",
            padding: "0 20px",
          }}
        >
          {seats.map((seat) => {
            const isSelected = selectedSeats.some(
              (s) => s.seat_id === seat.seat_id,
            );
            let seatColor = "#1a1a1a"; 
            let borderColor = "#333";
            let cursor = "pointer";

            if (seat.status === "BOOKED") {
              seatColor = "#333";
              borderColor = "#222";
              cursor = "not-allowed";
            } else if (seat.status === "PROCESSING") {
              seatColor = "#554800"; 
              borderColor = "#f3ce00";
              cursor = "not-allowed";
            } else if (isSelected) {
              seatColor = "#4caf50"; 
              borderColor = "#4caf50";
            }

            return (
              <div
                key={seat.seat_id}
                onClick={() => toggleSeat(seat)}
                style={{
                  ...seatStyle,
                  background: seatColor,
                  borderColor: borderColor,
                  cursor: cursor,
                  opacity: seat.status === "BOOKED" ? 0.3 : 1,
                }}
                title={`Seat ${seat.seat_number} - ${seat.status}`}
              >
                <span style={seatNumber}>{seat.seat_number}</span>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div style={legendContainer}>
          <div style={legendItem}>
            <div
              style={{
                ...legendBox,
                background: "#1a1a1a",
                borderColor: "#333",
              }}
            ></div>{" "}
            Available
          </div>
          <div style={legendItem}>
            <div
              style={{
                ...legendBox,
                background: "#4caf50",
                borderColor: "#4caf50",
              }}
            ></div>{" "}
            Selected
          </div>
          <div style={legendItem}>
            <div
              style={{
                ...legendBox,
                background: "#554800",
                borderColor: "#f3ce00",
              }}
            ></div>{" "}
            Locked
          </div>
          <div style={legendItem}>
            <div
              style={{
                ...legendBox,
                background: "#333",
                borderColor: "#222",
                opacity: 0.3,
              }}
            ></div>{" "}
            Sold
          </div>
        </div>
      </div>

      {/* Footer / Checkout Area */}
      <div style={checkoutFooter}>
        <div>
          <p style={selectedText}>
            {selectedSeats.length > 0
              ? `${selectedSeats.length} Ticket(s) Selected`
              : "Select your seats"}
          </p>
          {selectedSeats.length > 0 && (
            <p style={seatsListText}>
              {selectedSeats.map((s) => s.seat_number).join(", ")}
            </p>
          )}
        </div>

        <div style={checkoutAction}>
          <div style={priceContainer}>
            <span style={totalLabel}>Total</span>
            <span style={priceText}>₹{totalPrice.toFixed(2)}</span>
          </div>
          <button
            style={{
              ...payBtn,
              opacity: selectedSeats.length === 0 ? 0.5 : 1,
              cursor: selectedSeats.length === 0 ? "not-allowed" : "pointer",
            }}
            onClick={handleCheckout}
            disabled={selectedSeats.length === 0}
          >
            <CreditCard size={18} /> Book & Pay
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Styles ---
const containerStyle = {
  display: "flex",
  flexDirection: "column",
  height: "100%",
  position: "relative",
};

const gridArea = {
  flex: 1,
  overflowY: "auto",
  padding: "20px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const screenContainer = {
  width: "80%",
  maxWidth: "600px",
  marginBottom: "50px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};
const screenCurve = {
  width: "100%",
  height: "40px",
  borderTop: "4px solid #f3ce00",
  borderRadius: "50% 50% 0 0",
  boxShadow: "0 -20px 40px -10px rgba(243, 206, 0, 0.15)",
};
const screenText = {
  color: "#666",
  fontSize: "0.8rem",
  marginTop: "-15px",
  letterSpacing: "2px",
  textTransform: "uppercase",
};

const seatStyle = {
  height: "30px",
  borderRadius: "6px 6px 2px 2px",
  borderStyle: "solid",
  borderWidth: "1px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "all 0.1s",
};
const seatNumber = { fontSize: "0.6rem", color: "#fff", opacity: 0.8 };

const legendContainer = {
  display: "flex",
  gap: "20px",
  padding: "20px",
  background: "#111",
  borderRadius: "8px",
  border: "1px solid #222",
  marginTop: "auto",
};
const legendItem = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  color: "#888",
  fontSize: "0.85rem",
};
const legendBox = {
  width: "16px",
  height: "16px",
  borderRadius: "4px",
  borderStyle: "solid",
  borderWidth: "1px",
};

const checkoutFooter = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "20px",
  background: "#1a1a1a",
  borderTop: "1px solid #333",
};
const selectedText = {
  margin: 0,
  color: "#fff",
  fontSize: "1.1rem",
  fontWeight: "500",
};
const seatsListText = {
  margin: "4px 0 0 0",
  color: "#888",
  fontSize: "0.9rem",
};

const checkoutAction = { display: "flex", alignItems: "center", gap: "20px" };
const priceContainer = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end",
};
const totalLabel = { color: "#888", fontSize: "0.8rem" };
const priceText = { color: "#f3ce00", fontSize: "1.4rem", fontWeight: "bold" };
const payBtn = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  padding: "12px 24px",
  background: "#fff",
  color: "#000",
  border: "none",
  borderRadius: "8px",
  fontWeight: "bold",
  fontSize: "1rem",
  transition: "all 0.2s",
};

export default SeatSelection;
