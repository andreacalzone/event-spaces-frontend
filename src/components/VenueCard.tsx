import React from "react";
import { Link } from "react-router-dom";
import type { Venue } from "../types";

export default function VenueCard({ venue }: { venue: Venue }) {
  return (
    <article className="venue-card">
      <Link to={`/venues/${venue.id}`}>
        <img src={venue.image || "/placeholder.png"} alt={venue.title} />
        <div className="venue-body">
          <h3>{venue.title}</h3>
          <p>{venue.description?.slice(0, 100)}</p>
          <div className="meta">Capacity: {venue.capacity} • Price/hr: {venue.pricePerHour} SEK</div>
        </div>
      </Link>
    </article>
  );
}
