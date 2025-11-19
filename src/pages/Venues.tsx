import { useEffect, useState } from "react";
import { fetchVenues } from "../services/api";
import VenueCard from "../components/VenueCard";
import type { Venue } from "../types";
import "../styles/venues.css";

export default function Venues() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    fetchVenues()
      .then((data) => {
        if (mounted) setVenues(data);
      })
      .catch((err) => {
        if (mounted) setError(err.message || "Error");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false; // <-- fix!
    };
  }, []);

  if (loading) return <p className="container">Loading...</p>;
  if (error) return <p className="container">Error: {error}</p>;

  return (
    <div className="container">
      <h1>Venues</h1>
      <div className="venues-grid">
        {venues.map((v) => (
          <VenueCard key={v.id} venue={v} />
        ))}
      </div>
    </div>
  );
}
