// src/components/Hero.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/hero.css";

export default function Hero() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  function handleSearch(e?: React.FormEvent) {
    if (e) e.preventDefault();
    const q = query.trim();
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    navigate(`/venues?${params.toString()}`);
  }

  return (
    <section className="hero">
      <div className="hero-inner">
        <div className="hero-left">
          <div className="hero-left-inner">
            <h1>An easier way to find your venue</h1>
            <p>To find a venue should bring joy, not stress</p>

            <form className="hero-search" onSubmit={handleSearch} role="search">
              <input
                className="hero-input"
                placeholder="Search for a venue or city..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search city"
              />

              <button type="submit" className="hero-search-btn" aria-label="Search">
                <img src="/images/search-icon.svg" alt="search" />
              </button>
            </form>
          </div>
        </div>

        <div className="hero-right" aria-hidden>
          <img src="/images/hero-img.png" alt="hero" />
        </div>
      </div>
    </section>
  );
}
