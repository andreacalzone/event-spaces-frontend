// src/services/api.ts
import axios from "axios";
import type { Venue } from "../types";

const BACKEND = import.meta.env.VITE_BACKEND_URL || "http://localhost:5050";
const api = axios.create({ baseURL: BACKEND, headers: { "Content-Type": "application/json" } });

const token = localStorage.getItem("token");
if (token) api.defaults.headers.common.Authorization = `Bearer ${token}`;

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    return Promise.reject(err);
  }
);

export type VenuesResponse = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  data: Venue[];
};

export async function fetchVenues(page = 1, pageSize = 12): Promise<Venue[]> {
  const res = await api.get<VenuesResponse>("/api/venues", { params: { page, pageSize } });
  return res.data.data;
}

export async function fetchVenueById(id: string | number): Promise<Venue> {
  const res = await api.get<Venue>(`/api/venues/${id}`);
  return res.data;
}

export async function createBooking(venueId: number, startISO: string, endISO: string) {
  const res = await api.post("/api/bookings", { venueId, start: startISO, end: endISO });
  return res.data;
}

export async function fetchMyBookings() {
  const res = await api.get("/api/bookings/me");
  return res.data;
}

/**
 * Create a venue. Because backend uses upload.single('image') we send FormData.
 * Fields: title, description, capacity, pricePerHour, location, (optional) image file.
 */
export async function createVenue(formData: FormData) {
  // Axios will set Content-Type multipart/form-data including boundary automatically
  const res = await api.post("/api/venues", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

export default api;
