import React, { useEffect, useState } from "react";
import { fetchVenues, createVenue, fetchMyBookings } from "../services/api";
import type { Venue } from "../types";

export default function MyBooking() {
  const [tab, setTab] = useState<"venues" | "bookings">("venues");
  const [allVenues, setAllVenues] = useState<Venue[]>([]);
  const [myVenues, setMyVenues] = useState<Venue[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const user = typeof localStorage !== "undefined" ? JSON.parse(localStorage.getItem("user") || "null") : null;

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchVenues().then((data) => {
      if (!mounted) return;
      setAllVenues(data);
      if (user) {
        setMyVenues(data.filter((v) => (v.owner as any)?.id === user.id || v.ownerId === user.id));
      }
    }).catch(console.error).finally(() => mounted && setLoading(false));

    fetchMyBookings().then((b) => { if (mounted) setBookings(b); }).catch(console.error);
    return () => { mounted = false; };
  }, []);

  // form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [capacity, setCapacity] = useState<number>(10);
  const [pricePerHour, setPricePerHour] = useState<number>(1000);
  const [location, setLocation] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  async function handleCreateVenue(e: React.FormEvent) {
    e.preventDefault();
    if (!title) return alert("Title required");
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("title", title);
      fd.append("description", description);
      fd.append("capacity", String(capacity));
      fd.append("pricePerHour", String(pricePerHour));
      fd.append("location", location);
      if (imageFile) fd.append("image", imageFile);

      const res = await createVenue(fd);
      alert("Venue created");
      setAllVenues((p) => [res, ...p]);
      setMyVenues((p) => [res, ...p]);
      // clear
      setTitle(""); setDescription(""); setCapacity(10); setPricePerHour(1000); setLocation(""); setImageFile(null);
    } catch (err: any) {
      console.error("create venue err", err);
      alert(err?.response?.data?.msg || "Create venue failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="container">
      <h1>My page</h1>
      <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        <button className="btn-primary" onClick={() => setTab("venues")}>My venues</button>
        <button className="btn-primary" onClick={() => setTab("bookings")}>My bookings</button>
      </div>

      {tab === "venues" && (
        <section>
          <h2>Create venue</h2>
          <form onSubmit={handleCreateVenue} style={{ maxWidth: 640 }}>
            <label>Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} />
            <label>Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
            <label>Capacity</label>
            <input type="number" value={capacity} onChange={(e) => setCapacity(Number(e.target.value))} />
            <label>Price / hour (SEK)</label>
            <input type="number" value={pricePerHour} onChange={(e) => setPricePerHour(Number(e.target.value))} />
            <label>Location</label>
            <input value={location} onChange={(e) => setLocation(e.target.value)} />
            <label>Image (optional)</label>
            <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
            <div style={{ marginTop: 12 }}>
              <button className="btn-primary" type="submit" disabled={uploading}>
                {uploading ? "Uploading..." : "Create venue"}
              </button>
            </div>
          </form>

          <h3 style={{ marginTop: 24 }}>Your venues</h3>
          <div className="venues-grid">
            {myVenues.map((v) => (
              <div key={v.id} style={{ border: "1px solid #eee", padding: 8, borderRadius: 8 }}>
                <img src={v.image || "/placeholder.png"} alt={v.title} style={{ width: "100%", height: 120, objectFit: "cover" }} />
                <h4>{v.title}</h4>
                <div className="meta">Capacity: {v.capacity} • Price/hr: {v.pricePerHour}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {tab === "bookings" && (
        <section>
          <h2>Your bookings</h2>
          {bookings.length === 0 ? <p>No bookings yet</p> : bookings.map((b) => (
            <div key={b.id} style={{ border: "1px solid #eee", padding: 12, marginBottom: 8 }}>
              <div><strong>{b.venue?.title || "Venue"}</strong></div>
              <div>{new Date(b.startDate).toLocaleString()} → {new Date(b.endDate).toLocaleString()}</div>
              <div>Total: {b.totalPrice ?? "—"} SEK</div>
              <div>Status: {b.status}</div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
