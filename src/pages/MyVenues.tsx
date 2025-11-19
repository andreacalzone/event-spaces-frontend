import React, { useEffect, useState } from "react";
import {
  fetchVenues,
  createVenue,
  updateVenue,
  deleteVenue,
  restoreVenue,
} from "../services/api";
import type { Venue } from "../types";
import "../styles/my.css";

export default function MyVenues() {
  const [myVenues, setMyVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingVenue, setEditingVenue] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);

  const user =
    typeof localStorage !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "null")
      : null;

  // FORM STATE
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [capacity, setCapacity] = useState(10);
  const [pricePerHour, setPricePerHour] = useState(1000);
  const [location, setLocation] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  // LOAD VENUES
  useEffect(() => {
    setLoading(true);
    fetchVenues()
      .then((data) => {
        const mine = data.filter((v: any) => v.ownerId === user?.id);
        setMyVenues(mine);
      })
      .finally(() => setLoading(false));
  }, []);

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

      const newVenue = await createVenue(fd);
      setMyVenues((prev) => [newVenue, ...prev]);

      setTitle("");
      setDescription("");
      setCapacity(10);
      setPricePerHour(1000);
      setLocation("");
      setImageFile(null);
    } finally {
      setUploading(false);
    }
  }

  async function handleDeleteVenue(id: number) {
    if (!confirm("Delete this venue?")) return;
    await deleteVenue(id);
    setMyVenues((prev) =>
      prev.map((v) => (v.id === id ? { ...v, available: false } : v))
    );
  }

  async function handleRestoreVenue(id: number) {
    await restoreVenue(id);
    setMyVenues((prev) =>
      prev.map((v) => (v.id === id ? { ...v, available: true } : v))
    );
  }

  async function handleEditSubmit(id: number, e: React.FormEvent) {
    e.preventDefault();

    const fd = new FormData();
    fd.append("title", title);
    fd.append("description", description);
    fd.append("capacity", String(capacity));
    fd.append("pricePerHour", String(pricePerHour));
    fd.append("location", location);
    if (imageFile) fd.append("image", imageFile);

    const updated = await updateVenue(id, fd);
    setMyVenues((prev) => prev.map((v) => (v.id === id ? updated : v)));
    setEditingVenue(null);
  }

  if (loading) return <p className="container">Loading…</p>;

  return (
    <div className="container my-venues-wrapper">
      {/* LEFT COLUMN - CREATE VENUE */}
      <div className="left-column">
        <div className="venue-form-box">
          <h2>Create venue</h2>

          <form onSubmit={handleCreateVenue}>
            <label>Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} />

            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <label>Capacity</label>
            <input
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(Number(e.target.value))}
            />

            <label>Price/hr</label>
            <input
              type="number"
              value={pricePerHour}
              onChange={(e) => setPricePerHour(Number(e.target.value))}
            />

            <label>Address</label>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />

            <label>Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            />

            <button className="btn-primary" disabled={uploading}>
              {uploading ? "Creating…" : "Create venue"}
            </button>
          </form>
        </div>
      </div>

      {/* RIGHT COLUMN - YOUR VENUES */}
      <div className="right-column">
        <h2>Your venues</h2>

        <div className="my-grid">
          {myVenues.map((v) => (
            <div key={v.id} className="my-venue-card">
              <img
                src={v.image || "/placeholder.png"}
                alt={v.title}
              />

              <h3>
                {v.title} {!v.available && "(DELETED)"}
              </h3>

              <p>{v.description}</p>

              <div className="meta">
                Capacity: {v.capacity} • {v.pricePerHour} SEK/hr
              </div>

              {v.available ? (
                <div className="venue-card-btns">
                  <button
                    className="btn-primary"
                    onClick={() => {
                      setEditingVenue(v.id);
                      setTitle(v.title);
                      setDescription(v.description);
                      setCapacity(v.capacity);
                      setPricePerHour(v.pricePerHour);
                      setLocation(v.location || "");
                      setImageFile(null);
                    }}
                  >
                    Edit
                  </button>

                  <button
                    className="btn-primary danger"
                    onClick={() => handleDeleteVenue(v.id)}
                  >
                    Delete
                  </button>
                </div>
              ) : (
                <button
                  className="btn-primary"
                  onClick={() => handleRestoreVenue(v.id)}
                >
                  Restore venue
                </button>
              )}

              {editingVenue === v.id && (
                <form
                  className="edit-form"
                  onSubmit={(e) => handleEditSubmit(v.id, e)}
                >
                  <label>Title</label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />

                  <label>Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />

                  <label>Capacity</label>
                  <input
                    type="number"
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
                  />

                  <label>Price/hr</label>
                  <input
                    type="number"
                    value={pricePerHour}
                    onChange={(e) => setPricePerHour(Number(e.target.value))}
                  />

                  <label>Address</label>
                  <input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />

                  <label>Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  />

                  <button className="btn-primary">Save changes</button>
                </form>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
