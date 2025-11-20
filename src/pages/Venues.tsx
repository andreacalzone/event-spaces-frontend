// src/pages/Venues.tsx
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { fetchVenues } from "../services/api";
import VenueCard from "../components/VenueCard";
import type { Venue } from "../types";
import "../styles/venues.css";

export default function Venues() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [filtered, setFiltered] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);

  const [leaving, setLeaving] = useState<number[]>([]); // <-- för animations

  const location = useLocation();
  const params = new URLSearchParams(location.search);

  // FROM HERO SEARCH
  const initialQuery = params.get("q") || "";

  // FILTER STATES
  const [search, setSearch] = useState(initialQuery);
  const [maxPrice, setMaxPrice] = useState<number>(0);
  const [maxPriceLimit, setMaxPriceLimit] = useState(0);

  const [maxCapacity, setMaxCapacity] = useState<number>(0);
  const [capacityLimit, setCapacityLimit] = useState<number>(0);

  // FETCH VENUES
  useEffect(() => {
    fetchVenues()
      .then((data) => {
        setVenues(data);

        // Highest price
        const highestPrice = Math.max(...data.map((v) => v.pricePerHour));
        setMaxPriceLimit(highestPrice);
        setMaxPrice(highestPrice);

        // Highest capacity
        const highestCap = Math.max(...data.map((v) => v.capacity));
        setCapacityLimit(highestCap);
        setMaxCapacity(highestCap);

        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // APPLY FILTERS + ANIMATION
  useEffect(() => {
    const beforeIds = filtered.map((v) => v.id);

    let v = [...venues];

    if (search.trim()) {
      const q = search.toLowerCase();
      v = v.filter(
        (x) =>
          x.title.toLowerCase().includes(q) ||
          x.location?.toLowerCase().includes(q) ||
          x.description?.toLowerCase().includes(q)
      );
    }

    v = v.filter((x) => x.pricePerHour <= maxPrice);
    v = v.filter((x) => x.capacity <= maxCapacity);

    const afterIds = v.map((v) => v.id);

    // IDs som försvinner → animera ut
    const removed = beforeIds.filter((id) => !afterIds.includes(id));

    if (removed.length > 0) {
      setLeaving(removed);

      // Låt CSS köra exit-animation
      setTimeout(() => {
        setFiltered(v);
        setLeaving([]);
      }, 250);
    } else {
      setFiltered(v);
    }
  }, [venues, search, maxPrice, maxCapacity]);

  if (loading) return <p className="container">Loading...</p>;

  return (
    <div className="container venues-page">
      <h1>Venues</h1>

      {/* FILTER BAR */}
      <div className="filter-bar">
        <input
          className="filter-input"
          placeholder="Search venues, locations, descriptions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* PRICE FILTER */}
        <div className="price-filter">
          <label>Max price/hour: {maxPrice} SEK</label>
          <input
            type="range"
            min={0}
            max={maxPriceLimit}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
          />
        </div>

        {/* CAPACITY FILTER */}
        <div className="capacity-filter">
          <label>Max capacity: {maxCapacity}</label>
          <input
            type="range"
            min={0}
            max={capacityLimit}
            value={maxCapacity}
            onChange={(e) => setMaxCapacity(Number(e.target.value))}
          />
        </div>
      </div>

      {/* GRID */}
      <div className="venues-grid">
        {filtered.length === 0 ? (
          <p>No venues match your filters.</p>
        ) : (
          filtered.map((v) => (
            <div
              key={v.id}
              className={
                "venue-card-wrapper " +
                (leaving.includes(v.id) ? "venue-card-wrapper-leave" : "")
              }
            >
              <VenueCard venue={v} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
