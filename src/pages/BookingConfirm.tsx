// src/pages/BookingConfirm.tsx
import React, { useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { createBooking } from "../services/api";
import type { Venue } from "../types";

type StateType = { state?: { venue?: Venue; checkIn?: string; checkOut?: string; totalPrice?: number; booking?: any } };

export default function BookingConfirm() {
  const location = useLocation() as StateType;
  const s = location.state;
  const venue = s?.venue;
  const checkIn = s?.checkIn;
  const checkOut = s?.checkOut;
  const totalPrice = s?.totalPrice ?? 0;
  const existingBooking = s?.booking;

  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState<boolean>(!!existingBooking);
  const navigate = useNavigate();

  async function handleConfirmPay() {
    if (confirmed) {
      // already confirmed
      navigate("/my-booking");
      return;
    }
    if (!venue || !checkIn || !checkOut) {
      alert("Missing booking data");
      return;
    }
    setLoading(true);
    try {
      // Call backend to create booking. Backend validates availability
      const res = await createBooking(Number(venue.id), checkIn, checkOut);
      console.log("Booking created:", res);
      setConfirmed(true);

      // Simulate payment success for the school project:
      // show success and redirect after 1.5s
      setTimeout(() => navigate("/my-booking"), 1200);
    } catch (err: any) {
      console.error("Booking error:", err);
      const msg = err?.response?.data?.msg || err?.message || "Booking failed";
      alert(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container booking-confirm">
      <div className="mini-hero">you're almost there — complete your EventSpace booking</div>

      <div className="confirm-grid">
        <div className="payment-box">
          <h3>Payment method</h3>
          <p>Choose your method of payment.</p>
          <div className="payment-icons" style={{ display: "grid", gridTemplateColumns: "repeat(3, auto)", gap: 8 }}>
            <img src="/payments/visa.png" alt="visa" />
            <img src="/payments/mastercard.png" alt="mc" />
            <img src="/payments/gpay.png" alt="gpay" />
            <img src="/payments/applepay.png" alt="applepay" />
            <img src="/payments/klarna.png" alt="klarna" />
          </div>

          <div style={{ marginTop: 16 }}>
            <button className="btn-primary" onClick={handleConfirmPay} disabled={loading}>
              {loading ? "Processing..." : confirmed ? "Paid — go to My page" : "Confirm & pay"}
            </button>
          </div>

          {confirmed && <p style={{ marginTop: 12 }}>Payment simulated — booking confirmed. Redirecting...</p>}
        </div>

        <aside className="summary-box">
          <h4>Selected venue</h4>
          {venue ? (
            <div className="selected">
              <img src={venue.image || "/placeholder.png"} alt={venue.title} style={{ width: 120 }} />
              <div>
                <div>{venue.location}</div>
                <div>Max capacity: {venue.capacity}</div>
              </div>

              <div className="dates">{checkIn} → {checkOut}</div>
              <div className="total">Total: {totalPrice} SEK</div>
            </div>
          ) : (
            <p>No venue selected — <Link to="/venues">choose a venue</Link></p>
          )}
        </aside>
      </div>
    </div>
  );
}
