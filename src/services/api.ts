import axios from "axios";

const API_URL = "http://localhost:5050/api";

// Inject token automatically
function authHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/* ================================
   VENUES
================================ */

export async function fetchVenues() {
  const res = await axios.get(`${API_URL}/venues`);
  return res.data.data;
}

export async function fetchVenueById(id: string | number) {
  const res = await axios.get(`${API_URL}/venues/${id}`);
  return res.data;
}

export async function createVenue(formData: FormData) {
  const res = await axios.post(`${API_URL}/venues`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      ...authHeaders(),
    },
  });
  return res.data;
}

export async function updateVenue(id: number, formData: FormData) {
  const res = await axios.put(`${API_URL}/venues/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      ...authHeaders(),
    },
  });
  return res.data;
}

export async function deleteVenue(id: number) {
  const res = await axios.delete(`${API_URL}/venues/${id}`, {
    headers: authHeaders(),
  });
  return res.data;
}

export async function restoreVenue(id: number) {
  const res = await axios.put(`${API_URL}/venues/${id}/restore`, null, {
    headers: authHeaders(),
  });
  return res.data;
}

/* ================================
   BOOKINGS
================================ */

export async function createBooking(
  venueId: number,
  start: string,
  end: string
) {
  const res = await axios.post(
    `${API_URL}/bookings`,
    { venueId, start, end },
    { headers: { "Content-Type": "application/json", ...authHeaders() } }
  );

  return res.data;
}

export async function fetchMyBookings() {
  const res = await axios.get(`${API_URL}/bookings/me`, {
    headers: authHeaders(),
  });
  return res.data;
}

export async function cancelBooking(id: number) {
  const res = await axios.put(
    `${API_URL}/bookings/${id}/cancel`,
    {},
    { headers: authHeaders() }
  );
  return res.data;
}
