import React, { useEffect, useState } from "react";
import { fetchMyBookings, cancelBooking } from "../services/api";
import "../styles/mybooking.css";

export default function MyBookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyBookings()
      .then((data) => setBookings(data))
      .finally(() => setLoading(false));
  }, []);

  async function handleCancel(id: number) {
    if (!confirm("Cancel booking?")) return;
    const updated = await cancelBooking(id);

    // update UI
    setBookings((items) => items.map((b) => (b.id === id ? updated : b)));
  }

  if (loading) return <p className="container">Loading…</p>;

  const active = bookings.filter((b) => b.status !== "cancelled");
  const cancelled = bookings.filter((b) => b.status === "cancelled");

  return (
    <div className="container">
      <h1>My bookings</h1>

      <h2>Active bookings</h2>
      <div className="my-grid">
        {active.map((b) => (
          <div className="booking-card" key={b.id}>
            <img
              key={b.venue?.image}
              src={b.venue?.image || "/placeholder.png"}
              alt=""
              className="booking-img"
            />
            <h3>{b.venue?.title || "(Deleted venue)"}</h3>

            <p>
              {new Date(b.startDate).toLocaleString()} →{" "}
              {new Date(b.endDate).toLocaleString()}
            </p>

            <div>Total: {b.totalPrice} SEK</div>
            <div>Status: {b.status}</div>

            <button
              className="btn-primary danger"
              onClick={() => handleCancel(b.id)}
            >
              Cancel booking
            </button>
          </div>
        ))}
      </div>

      <h2 style={{ marginTop: 40 }}>Cancelled bookings</h2>
      <div className="my-grid">
        {cancelled.map((b) => (
          <div className="booking-card cancelled" key={b.id}>
            <img
              key={b.venue?.image}
              src={b.venue?.image || "/placeholder.png"}
              alt=""
              className="booking-img"
            />
            <h3>{b.venue?.title || "(Deleted venue)"}</h3>
            <p>
              {new Date(b.startDate).toLocaleString()} →{" "}
              {new Date(b.endDate).toLocaleString()}
            </p>
            <div>Total: {b.totalPrice} SEK</div>
            <div>Status: {b.status}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
