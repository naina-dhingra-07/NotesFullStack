// Tiny fetch wrapper. The JWT lives in an httpOnly cookie, so the browser sends it automatically.
async function request(path, options = {}) {
  const res = await fetch(`/api${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.message || 'Request failed');
    err.status = res.status;
    throw err;
  }
  return data;
}

export const api = {
  register: (body) => request('/auth/register', { method: 'POST', body }),
  login: (body) => request('/auth/login', { method: 'POST', body }),
  logout: () => request('/auth/logout', { method: 'POST' }),
  me: () => request('/auth/me'),

  myNotes: () => request('/notes'),
  publicNotes: () => request('/notes/public'),
  createNote: (body) => request('/notes', { method: 'POST', body }),
  updateNote: (id, body) => request(`/notes/${id}`, { method: 'PUT', body }),
  deleteNote: (id) => request(`/notes/${id}`, { method: 'DELETE' }),
};
