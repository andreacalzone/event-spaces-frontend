// COMPLETE FILE — VenueDetail.tsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchVenueById } from "../services/api";
import type { Venue } from "../types";
import "../styles/venuedetail.css";
import Calendar from "../components/Calendar";

type BookingFromApi = {
  id: number;
  startDate: string;
  endDate: string;
  status?: string;
};

type BookingLocal = {
  id: number;
  startDate: Date;
  endDate: Date;
  status?: string;
};

export default function VenueDetail() {
  const { id } = useParams<{ id: string }>();
  const [venue, setVenue] = useState<Venue | null>(null);
  const [bookings, setBookings] = useState<BookingLocal[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  /* FETCH VENUE + BOOKINGS */
  useEffect(() => {
    if (!id) return;

    async function load() {
      try {
        const v = await fetchVenueById(id);
        setVenue(v);

        const r = await fetch(`/api/bookings/venue/${id}`);
        const raw = (await r.json()) as BookingFromApi[];

        const local = raw.map((b) => ({
          id: b.id,
          startDate: new Date(b.startDate),
          endDate: new Date(b.endDate),
          status: b.status,
        }));

        setBookings(local);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  /* PRICE */
  const totalPrice = (() => {
    if (!checkIn || !checkOut || !venue) return 0;
    const s = new Date(checkIn);
    const e = new Date(checkOut);
    const diff = e.getTime() - s.getTime();
    if (diff <= 0) return 0;
    const hours = diff / (1000 * 60 * 60);
    const rounded = Math.ceil(hours * 2) / 2;
    return rounded * venue.pricePerHour;
  })();

  function handleBook() {
    if (!checkIn || !checkOut) return;
    navigate("/booking/confirm", {
      state: { venue, checkIn, checkOut, totalPrice },
    });
  }

  if (loading) return <p className="container">Loading…</p>;
  if (!venue) return <p className="container">Venue not found</p>;

  return (
    <div className="container venue-detail-page">
      <div className="venue-main">

        {/* LEFT */}
        <div className="venue-left">
          <img className="venue-hero" src={venue.image} />
          <div className="venue-info">
            <h1>{venue.title}</h1>
            <p className="venue-sub">{venue.description}</p>
            <div className="venue-meta">
              <div>Capacity: {venue.capacity}</div>
              <div>{venue.pricePerHour} SEK / hour</div>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <aside className="venue-right">
          <div className="dates-panel">
            <label>Check in</label>
            <input
              readOnly
              value={checkIn ? new Date(checkIn).toLocaleString() : ""}
              placeholder="Choose date/time"
            />

            <label>Check out</label>
            <input
              readOnly
              value={checkOut ? new Date(checkOut).toLocaleString() : ""}
              placeholder="Choose date/time"
            />

            <div className="total">Total: {totalPrice} SEK</div>
          </div>

          <Calendar
            bookings={bookings}
            onRangeChange={(s, e) => {
              setCheckIn(s || "");
              setCheckOut(e || "");
            }}
          />

          <button
            className="btn-primary book-btn"
            disabled={!checkIn || !checkOut}
            onClick={handleBook}
          >
            Book now
          </button>
        </aside>
      </div>
    </div>
  );
}


