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
import MyBooking from "./pages/MyBooking";

export default function App() {
  return (
    <div className="app-root">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/venues" element={<Venues />} />
          <Route path="/venues/:id" element={<VenueDetail />} />
          <Route path="/booking/confirm" element={<BookingConfirm />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/my-booking" element={<MyBooking />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
