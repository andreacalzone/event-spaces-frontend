import React, { useEffect, useState } from "react";
import { fetchVenues } from "../services/api";
import VenueCard from "../components/VenueCard";
import type { Venue } from "../types";

import "../styles/home.css";
import "../styles/hero.css";
import "../styles/footer.css";

import Hero from "../components/Hero";

export default function Home() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 600);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetchVenues()
      .then((data) => setVenues(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="home-wrapper">
      <Hero />

      <section className="why-section">
        <h2>Why choose us?</h2>

        <div className="why-grid">
          <div className="why-card">
            <img src="/images/why1.png" alt="" />
          </div>

          <div className="why-card">
            <img src="/images/why2.png" alt="" />
          </div>

          <div className="why-card">
            <img src="/images/why3.png" alt="" />
          </div>
        </div>
      </section>

      <section className="venues-preview">
        <h2>Available venues</h2>
        <a className="see-all" href="/venues">
          See all venues →
        </a>
      </section>

      <section className="home-venues-grid">
        {venues.slice(0, isMobile ? 3 : 8).map((v) => (
          <VenueCard key={v.id} venue={v} />
        ))}
      </section>
    </div>
  );
}
