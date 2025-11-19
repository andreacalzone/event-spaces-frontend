import React, { useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { createBooking } from "../services/api";
import type { Venue } from "../types";
import "../styles/checkout.css";

type StateType = {
  state?: {
    venue?: Venue;
    checkIn?: string;
    checkOut?: string;
    totalPrice?: number;
  };
};

export default function BookingConfirm() {
  const { state } = useLocation() as StateType;
  const venue = state?.venue;
  const checkIn = state?.checkIn;
  const checkOut = state?.checkOut;
  const totalPrice = state?.totalPrice ?? 0;

  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const navigate = useNavigate();

  const paymentOptions = [
    { id: "visa", src: "/images/Visa.png" },
    { id: "mastercard", src: "/images/Mastercard.png" },
    { id: "googlepay", src: "/images/GooglePay.png" },
    { id: "applepay", src: "/images/ApplePay.png" },
    { id: "klarna", src: "/images/Klarna.png" },
  ];

  async function handleConfirmPay() {
    if (!paymentMethod) return alert("Please select a payment method");
    if (!venue || !checkIn || !checkOut) return alert("Missing data");

    setLoading(true);
    try {
      await createBooking(Number(venue.id), checkIn, checkOut);

      setShowSuccess(true);
      setTimeout(() => navigate("/my-bookings"), 1800);
    } catch (err: any) {
      alert(err?.response?.data?.msg || "Booking failed");
    } finally {
      setLoading(false);
    }
  }

  function formatTime(t: string | undefined) {
    return t ? new Date(t).toLocaleString("sv-SE") : "";
  }

  return (
    <div className="checkout-wrapper">
      {/* hero-banner */}
      <div className="checkout-banner">
        You’re almost there — complete your EventSpace booking
      </div>

      <div className="checkout-grid">
        {/* PAYMENT BOX */}
        <div className="payment-box">
          <h3>Payment method</h3>
          <p>Choose your method of payment</p>

          <div className="payment-icons">
            {paymentOptions.map((p) => (
              <img
                key={p.id}
                src={p.src}
                className={paymentMethod === p.id ? "selected" : ""}
                onClick={() => setPaymentMethod(p.id)}
              />
            ))}
          </div>

          <button
            className="btn-primary pay-btn"
            onClick={handleConfirmPay}
            disabled={loading}
          >
            {loading ? "Processing..." : confirmed ? "Paid!" : "Confirm & pay"}
          </button>

          {confirmed && (
            <p style={{ marginTop: 12 }}>Payment simulated — redirecting…</p>
          )}
        </div>

        {/* SUMMARY BOX */}
        <div className="summary-box">
          <h4>Selected venue</h4>

          {venue ? (
            <div className="summary-inner">
              <img
                className="summary-image"
                src={venue.image || "/placeholder.png"}
                alt={venue.title}
              />

              <p className="summary-location">{venue.location}</p>
              <p className="summary-meta">Max capacity: {venue.capacity}</p>

              <p className="summary-dates">
                {formatTime(checkIn)} → {formatTime(checkOut)}
              </p>

              <p className="summary-total">Total: {totalPrice} SEK</p>
            </div>
          ) : (
            <p>
              No venue selected — <Link to="/venues">choose a venue</Link>
            </p>
          )}
        </div>
      </div>
      {showSuccess && (
        <div className="payment-success-backdrop">
          <div className="payment-success-modal">
            <div className="checkmark-circle">
              <div className="checkmark"></div>
            </div>

            <h2>Booking confirmed!</h2>
            <p>Your venue has been successfully booked.</p>
          </div>
        </div>
      )}
    </div>
  );
}
