const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

async function request(path, { method = "GET", body, token } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try {
    data = await res.json();
  } catch (_) {
    // no JSON body
  }

  if (!res.ok) {
    throw new Error(data?.error || `Request failed (${res.status})`);
  }
  return data;
}

export const api = {
  login: (username, password) => request("/auth/login", { method: "POST", body: { username, password } }),

  getTeams: () => request("/teams"),
  createTeam: (data, token) => request("/teams", { method: "POST", body: data, token }),
  deleteTeam: (id, token) => request(`/teams/${id}`, { method: "DELETE", token }),

  getPlayers: () => request("/players"),
  createPlayer: (data, token) => request("/players", { method: "POST", body: data, token }),
  deletePlayer: (id, token) => request(`/players/${id}`, { method: "DELETE", token }),

  getFixtures: () => request("/fixtures"),
  createFixture: (data, token) => request("/fixtures", { method: "POST", body: data, token }),
  deleteFixture: (id, token) => request(`/fixtures/${id}`, { method: "DELETE", token }),
  saveResult: (id, data, token) => request(`/fixtures/${id}/result`, { method: "PUT", body: data, token }),
  addEvent: (fixtureId, data, token) => request(`/fixtures/${fixtureId}/events`, { method: "POST", body: data, token }),
  removeEvent: (fixtureId, eventId, token) =>
    request(`/fixtures/${fixtureId}/events/${eventId}`, { method: "DELETE", token }),
};
