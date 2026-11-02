import { useEffect, useState } from 'react';
import { api } from './api';
import AuthForm from './components/AuthForm.jsx';
import Dashboard from './components/Dashboard.jsx';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore the session if a valid cookie exists
  useEffect(() => {
    api
      .me()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    await api.logout();
    setUser(null);
  };

  if (loading) return <p className="center">Loading…</p>;

  return user ? (
    <Dashboard user={user} onLogout={handleLogout} />
  ) : (
    <AuthForm onAuth={setUser} />
  );
}
