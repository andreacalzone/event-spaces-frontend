// src/pages/VenueDetail.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchVenueById, createBooking } from "../services/api";
import type { Venue } from "../types";
import "../styles/venuedetail.css";

type BookingFromApi = { id: number; startDate: string; endDate: string; status?: string };

function startOfDayIso(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x.toISOString();
}

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

  // Totalpris (hours * price)
  const totalPrice = (() => {
    if (!checkIn || !checkOut) return 0;
    const s = new Date(checkIn);
    const e = new Date(checkOut);
    if (!(s instanceof Date) || isNaN(s.getTime()) || isNaN(e.getTime())) return 0;
    const hours = Math.max(1, Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60)));
    return hours * (venue?.pricePerHour || 0);
  })();

 async function handleBook() {
  if (!venue) return;

  if (!checkIn || !checkOut) return alert("Choose check-in and check-out");

  const s = new Date(checkIn);
  const e = new Date(checkOut);

  if (s >= e) return alert("Check-out must be after check-in");

  const startISO = s.toISOString();
  const endISO = e.toISOString();
  
  navigate("/booking/confirm", {
    state: {
      venue,
      checkIn: startISO,
      checkOut: endISO,
      totalPrice,
    },
  });
}


  if (loading) return <p className="container">Laddar...</p>;
  if (error) return <p className="container">Fel: {error}</p>;
  if (!venue) return <p className="container">Venue hittades inte</p>;

  return (
    <div className="container venue-detail-page">
      <div className="venue-main">
        <div className="venue-left">
          <img className="venue-hero" src={venue.image || "/placeholder.png"} alt={venue.title} />

          <div className="venue-info">
            <h1>{venue.title}</h1>
            <p className="venue-sub">{venue.description}</p>

            <div className="venue-meta">
              <div>Kapacitet: {venue.capacity}</div>
              <div>Pris/timme: {venue.pricePerHour} SEK</div>
            </div>
          </div>
        </div>

        <aside className="venue-right">
          <div className="dates-panel">
            <label>Check in</label>
            <input readOnly value={checkIn ? new Date(checkIn).toLocaleString() : ""} placeholder="Välj datum/tid i kalendern" />

            <label>Check out</label>
            <input readOnly value={checkOut ? new Date(checkOut).toLocaleString() : ""} placeholder="Välj datum/tid i kalendern" />

            <div className="total">Total: {totalPrice} SEK</div>
          </div>

          <Calendar
            venueId={Number(id)}
            onRangeChange={(startIso, endIso) => {
              setCheckIn(startIso || "");
              setCheckOut(endIso || "");
            }}
          />

          <button className="btn-primary book-btn" onClick={handleBook} disabled={!checkIn || !checkOut || bookingLoading}>
            {bookingLoading ? "Bokar..." : "Boka"}
          </button>
        </aside>
      </div>
    </div>
  );
}

/* ===========================
   CALENDAR (in samma fil för enkel insättning)
   =========================== */

function Calendar({ venueId, onRangeChange }: { venueId: number; onRangeChange: (startIso: string | null, endIso: string | null) => void; }) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d;
  });
  const [booked, setBooked] = useState<BookingFromApi[]>([]);
  const [selecting, setSelecting] = useState<"start" | "end" | null>(null);
  const [selectedStart, setSelectedStart] = useState<Date | null>(null);
  const [selectedEnd, setSelectedEnd] = useState<Date | null>(null);
  const [startHour, setStartHour] = useState<string>("12:00");
  const [endHour, setEndHour] = useState<string>("18:00");

  useEffect(() => {
    fetchBooked();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [venueId]);

  async function fetchBooked() {
    try {
      const res = await fetch(`/api/bookings/venue/${venueId}`);
      if (!res.ok) throw new Error("Could not fetch bookings");
      const data = await res.json();
      setBooked(data || []);
    } catch (e) {
      console.error("Fetch bookings error:", e);
      setBooked([]);
    }
  }

  // Helpers
  const monthStart = new Date(currentMonth);
  const month = monthStart.getMonth();
  const year = monthStart.getFullYear();

  function daysInMonth(y: number, m: number) {
    return new Date(y, m + 1, 0).getDate();
  }
  const firstWeekday = new Date(year, month, 1).getDay(); // 0..6 (Sun..Sat)
  const totalDays = daysInMonth(year, month);

  // check if a given date (midnight) is inside any booked range
  function isBookedDay(dayDate: Date) {
    const dayStart = new Date(dayDate); dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(dayDate); dayEnd.setHours(23, 59, 59, 999);

    for (const b of booked) {
      const s = new Date(b.startDate);
      const e = new Date(b.endDate);
      if (s <= dayEnd && e >= dayStart) return true;
    }
    return false;
  }

  function dateToIsoWithTime(d: Date, time: string) {
    const [hh, mm] = time.split(":").map(Number);
    const copy = new Date(d);
    copy.setHours(hh, mm, 0, 0);
    return copy.toISOString();
  }

  function handleDayClick(day: number) {
    const clicked = new Date(year, month, day);
    // ignore clicks on booked days
    if (isBookedDay(clicked)) return;

    if (!selectedStart || (selectedStart && selectedEnd)) {
      setSelectedStart(clicked);
      setSelectedEnd(null);
      setSelecting("end");
      // update parent (start set, end null)
      onRangeChange(dateToIsoWithTime(clicked, startHour), null);
    } else {
      // selectedStart exists, select end
      if (clicked < selectedStart) {
        // if picked earlier day, swap
        setSelectedEnd(selectedStart);
        setSelectedStart(clicked);
        onRangeChange(dateToIsoWithTime(clicked, startHour), dateToIsoWithTime(selectedStart, endHour));
      } else {
        setSelectedEnd(clicked);
        onRangeChange(dateToIsoWithTime(selectedStart, startHour), dateToIsoWithTime(clicked, endHour));
      }
      setSelecting(null);
    }
  }

  // render array of day cells including leading empty cells for weekday offset
  const cells: Array<null | { day: number; date: Date }> = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= totalDays; d++) {
    cells.push({ day: d, date: new Date(year, month, d) });
  }

  return (
    <div className="calendar">
      <div className="cal-header">
        <button onClick={() => setCurrentMonth(new Date(year, month - 1, 1))}>‹</button>
        <div>{monthStart.toLocaleString(undefined, { month: "long", year: "numeric" })}</div>
        <button onClick={() => setCurrentMonth(new Date(year, month + 1, 1))}>›</button>
      </div>

      <div className="weekdays">
        {["Sön","Mån","Tis","Ons","Tor","Fre","Lör"].map((w) => (
          <div key={w} className="weekday">{w}</div>
        ))}
      </div>

      <div className="days-grid">
        {cells.map((c, i) =>
          c ? (
            <button
              key={i}
              className={
                "day" +
                (isBookedDay(c.date) ? " booked" : "") +
                (selectedStart && dateEqual(selectedStart, c.date) ? " selected-start" : "") +
                (selectedEnd && dateEqual(selectedEnd, c.date) ? " selected-end" : "") +
                (selectedStart && selectedEnd && inRange(c.date, selectedStart, selectedEnd) ? " in-range" : "")
              }
              onClick={() => handleDayClick(c.day)}
            >
              {c.day}
            </button>
          ) : (
            <div key={i} className="empty" />
          )
        )}
      </div>

      <div className="time-picker">
        <label>Starttid</label>
        <select value={startHour} onChange={(e) => {
          setStartHour(e.target.value);
          if (selectedStart) onRangeChange(dateToIsoWithTime(selectedStart, e.target.value), selectedEnd ? dateToIsoWithTime(selectedEnd, endHour) : null);
        }}>
          {generateHours().map(h => <option key={h} value={h}>{h}</option>)}
        </select>

        <label>Sluttid</label>
        <select value={endHour} onChange={(e) => {
          setEndHour(e.target.value);
          if (selectedStart && selectedEnd) onRangeChange(dateToIsoWithTime(selectedStart, startHour), dateToIsoWithTime(selectedEnd, e.target.value));
        }}>
          {generateHours().map(h => <option key={h} value={h}>{h}</option>)}
        </select>
      </div>
    </div>
  );
}

/* small helpers */
function generateHours() {
  const arr: string[] = [];
  for (let h = 0; h < 24; h++) {
    arr.push((h < 10 ? "0" : "") + h + ":00");
    arr.push((h < 10 ? "0" : "") + h + ":30");
  }
  return arr;
}

function dateEqual(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function inRange(d: Date, a: Date, b: Date) {
  const da = new Date(a); da.setHours(0,0,0,0);
  const db = new Date(b); db.setHours(23,59,59,999);
  const dd = new Date(d); dd.setHours(12,0,0,0);
  return dd >= da && dd <= db;
}
