import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Venues from "./pages/Venues";
import VenueDetail from "./pages/VenueDetail";
import BookingConfirm from "./pages/BookingConfirm";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyBookings from "./pages/MyBooking";
import MyVenues from "./pages/MyVenues";
import AboutUs from "./pages/AboutUs";

export default function App() {
  return (
    <div className="app-root page-wrapper">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/venues" element={<Venues />} />
          <Route path="/venues/:id" element={<VenueDetail />} />
          <Route path="/booking/confirm" element={<BookingConfirm />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/my-venues" element={<MyVenues />} />
          <Route path="/about" element={<AboutUs />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
