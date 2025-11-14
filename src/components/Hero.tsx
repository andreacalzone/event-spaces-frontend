import React from "react";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="hero container">
      <div className="hero-left">
        <h1>Book unique venues for your events</h1>
        <p>Find the perfect space — filter by capacity, price and amenities.</p>
        <div className="search-form">
          <input placeholder="Search venues, e.g. conference room" />
          <button>Search</button>
        </div>
      </div>
      <div className="hero-right">
        <img src="/hero.jpg" alt="hero" />
      </div>
    </section>
  );
}
