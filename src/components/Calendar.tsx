import { useState } from "react";

type BookingLocal = {
  id: number;
  startDate: Date;
  endDate: Date;
  status?: string;
};

export default function Calendar({
  bookings,
  onRangeChange,
}: {
  bookings: BookingLocal[];
  onRangeChange: (startIso: string | null, endIso: string | null) => void;
}) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const d = new Date();
    d.setDate(1);
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const [selectedStart, setSelectedStart] = useState<Date | null>(null);
  const [selectedEnd, setSelectedEnd] = useState<Date | null>(null);

  const [startHour, setStartHour] = useState("12:00");
  const [endHour, setEndHour] = useState("18:00");

  const month = currentMonth.getMonth();
  const year = currentMonth.getFullYear();

  /* HELPERS */
  function startOfDay(d: Date) {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x;
  }

  function endOfDay(d: Date) {
    const x = new Date(d);
    x.setHours(23, 59, 59, 999);
    return x;
  }

  function getDayBookingType(d: Date): "free" | "partial" | "full" {
    const dayStart = startOfDay(d);
    const dayEnd = endOfDay(d);

    const overlaps = bookings.filter(
      (b) => b.startDate <= dayEnd && b.endDate >= dayStart
    );

    if (overlaps.length === 0) return "free";

    const isFull = overlaps.some(
      (b) => b.startDate <= dayStart && b.endDate >= dayEnd
    );

    return isFull ? "full" : "partial";
  }

  function isHourBookedOn(date: Date, hhmm: string) {
    const [hh, mm] = hhmm.split(":").map(Number);
    const t = new Date(date);
    t.setHours(hh, mm, 0, 0);
    return bookings.some((b) => t >= b.startDate && t < b.endDate);
  }

  function formatISO(d: Date, hhmm: string) {
    const [hh, mm] = hhmm.split(":").map(Number);
    const c = new Date(d);
    c.setHours(hh, mm, 0, 0);
    return c.toISOString();
  }

  function handleDayClick(day: number) {
    const d = new Date(year, month, day);
    const type = getDayBookingType(d);
    if (type === "full") return;

    if (!selectedStart || selectedEnd) {
      setSelectedStart(d);
      setSelectedEnd(null);
      onRangeChange(formatISO(d, startHour), null);
      return;
    }

    if (d < selectedStart) {
      setSelectedEnd(selectedStart);
      setSelectedStart(d);
      onRangeChange(formatISO(d, startHour), formatISO(selectedStart, endHour));
    } else {
      setSelectedEnd(d);
      onRangeChange(formatISO(selectedStart, startHour), formatISO(d, endHour));
    }
  }

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstWeekday = new Date(year, month, 1).getDay();
  const cells: Array<null | { day: number; date: Date }> = [];

  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++)
    cells.push({ day: d, date: new Date(year, month, d) });

  function dateEqual(a: Date, b: Date) {
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  }

  function inRange(d: Date, a: Date, b: Date) {
    const da = startOfDay(a);
    const db = endOfDay(b);
    const dd = startOfDay(d);
    return dd >= da && dd <= db;
  }

  const hours = [];
  for (let h = 0; h < 24; h++) {
    hours.push(`${String(h).padStart(2, "0")}:00`);
    hours.push(`${String(h).padStart(2, "0")}:30`);
  }

  return (
    <div className="calendar">
      <div className="cal-header">
        <button onClick={() => setCurrentMonth(new Date(year, month - 1, 1))}>
          ‹
        </button>
        <div>
          {currentMonth.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </div>
        <button onClick={() => setCurrentMonth(new Date(year, month + 1, 1))}>
          ›
        </button>
      </div>

      <div className="weekdays">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((w) => (
          <div key={w} className="weekday">
            {w}
          </div>
        ))}
      </div>

      <div className="days-grid">
        {cells.map((c, i) =>
          !c ? (
            <div key={i} className="empty" />
          ) : (
            <button
              key={i}
              className={
                "day " +
                (getDayBookingType(c.date) === "full"
                  ? "full-booked "
                  : getDayBookingType(c.date) === "partial"
                  ? "partial-booked "
                  : "") +
                (selectedStart && dateEqual(selectedStart, c.date)
                  ? "selected-start "
                  : "") +
                (selectedEnd && dateEqual(selectedEnd, c.date)
                  ? "selected-end "
                  : "") +
                (selectedStart &&
                selectedEnd &&
                inRange(c.date, selectedStart, selectedEnd)
                  ? "in-range "
                  : "")
              }
              disabled={getDayBookingType(c.date) === "full"}
              onClick={() => handleDayClick(c.day)}
            >
              {c.day}
            </button>
          )
        )}
      </div>

      {/* TIME PICKER */}
      <div className="time-picker">
        <label>Start time</label>
        <select
          value={startHour}
          onChange={(e) => {
            setStartHour(e.target.value);
            if (selectedStart) {
              onRangeChange(
                formatISO(selectedStart, e.target.value),
                selectedEnd ? formatISO(selectedEnd, endHour) : null
              );
            }
          }}
        >
          {hours.map((h) => (
            <option
              key={h}
              value={h}
              disabled={selectedStart ? isHourBookedOn(selectedStart, h) : false}
            >
              {h}
            </option>
          ))}
        </select>

        <label>End time</label>
        <select
          value={endHour}
          onChange={(e) => {
            setEndHour(e.target.value);
            if (selectedStart && selectedEnd) {
              onRangeChange(
                formatISO(selectedStart, startHour),
                formatISO(selectedEnd, e.target.value)
              );
            }
          }}
        >
          {hours.map((h) => (
            <option
              key={h}
              value={h}
              disabled={selectedEnd ? isHourBookedOn(selectedEnd, h) : false}
            >
              {h}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
