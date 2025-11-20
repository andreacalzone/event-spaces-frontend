import React from "react";
import { Link } from "react-router-dom";
import type { Venue } from "../types";
import "../styles/venuecard.css";

export default function VenueCard({ venue }: { venue: Venue }) {
  return (
    <article className="venue-card">
      <Link to={`/venues/${venue.id}`}>
        <img
          className="venue-img"
          src={venue.image || "/placeholder.png"}
          alt={venue.title}
        />

        <div className="venue-body">
          <h3>{venue.title}</h3>
          <p className="venue-location">{venue.location}</p>
          <p className="venue-description">{venue.description}</p>
          <p className="venue-price">{venue.pricePerHour} SEK / h</p>
          <p className="venue-capacity">Max capacity: {venue.capacity}</p>
        </div>
      </Link>
    </article>
  );
}
