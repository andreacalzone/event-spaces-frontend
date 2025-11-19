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

          <p className="venue-location">{venue.location || "Unknown location"}</p>

          <p className="venue-price">{venue.pricePerHour} SEK / hour</p>

          <p className="venue-description">
            {venue.description?.slice(0, 90) || "No description"}
          </p>
        </div>

      </Link>
    </article>
  );
}
