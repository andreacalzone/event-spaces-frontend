import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchVenueById, createBooking } from "../services/api";
import type { Venue } from "../types";

export default function VenueDetail() {
  const { id } = useParams<{ id: string }>();
  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [checkIn, setCheckIn] = useState<string>("");
  const [checkOut, setCheckOut] = useState<string>("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    fetchVenueById(id)
      .then((data) => {
        if (mounted) setVenue(data);
      })
      .catch((err) => {
        if (mounted) setError(err?.message || "Error");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) return <p className="container">Loading...</p>;
  if (error) return <p className="container">Error: {error}</p>;
  if (!venue) return <p className="container">Venue not found</p>;

  // total price = hours * pricePerHour (default 0)
  const totalPrice = (() => {
    if (!checkIn || !checkOut) return 0;
    const s = new Date(checkIn);
    const e = new Date(checkOut);
    if (!(s instanceof Date) || isNaN(s.getTime()) || isNaN(e.getTime())) return 0;
    const hours = Math.max(1, Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60)));
    return hours * (venue.pricePerHour || 0);
  })();

  async function handleBook() {
    if (!venue) return;
    // basic validation
    if (!checkIn || !checkOut) {
      alert("Choose check-in and check-out");
      return;
    }
    const s = new Date(checkIn);
    const e = new Date(checkOut);
    if (s >= e) {
      alert("Check-out must be after check-in");
      return;
    }

    // konvertera till ISO (backend validerar ISO8601)
    const startISO = s.toISOString();
    const endISO = e.toISOString();

    setBookingLoading(true);
    try {
      // createBooking skickar Authorization-header automatiskt (om token sparats i localStorage via login)
      const result = await createBooking(Number(venue.id), startISO, endISO);
      // result borde innehålla booking + totalPrice enligt din backend
      const returnedTotal = result?.totalPrice ?? totalPrice;
      // navigera till confirm och skicka serverns svar + utvalda tider
      navigate("/booking/confirm", {
        state: { venue, checkIn: startISO, checkOut: endISO, totalPrice: returnedTotal, booking: result },
      });
    } catch (err: any) {
      const msg = err?.response?.data?.msg || err?.response?.data || err?.message || "Booking failed";
      alert(msg);
    } finally {
      setBookingLoading(false);
    }
  }

  return (
    <div className="container venue-detail">
      <div className="left">
        <div className="images">
          <img src={venue.image || "/placeholder.png"} alt={venue.title} style={{ width: "100%", borderRadius: 8 }} />
        </div>

        <div className="info">
          <h2>{venue.title}</h2>
          <p>{venue.description}</p>
        </div>

        <div className="amenities">
          <h4>Included</h4>
          <div className="amenity-list">
            <div className="amenity"><span>Wi-Fi</span></div>
            <div className="amenity"><span>Parking</span></div>
            <div className="amenity"><span>Sound</span></div>
          </div>
        </div>
      </div>

      <aside className="right">
        <label>Check in</label>
        <input type="datetime-local" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />

        <label>Check out</label>
        <input type="datetime-local" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />

        <div className="total">Total: {totalPrice} SEK</div>

        <button
          className="btn-primary"
          onClick={handleBook}
          disabled={!checkIn || !checkOut || bookingLoading}
        >
          {bookingLoading ? "Booking..." : "Book"}
        </button>
      </aside>
    </div>
  );
}
