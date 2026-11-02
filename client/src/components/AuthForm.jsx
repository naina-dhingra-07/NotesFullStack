import { useState } from 'react';
import { api } from '../api';

export default function AuthForm({ onAuth }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const isRegister = mode === 'register';
  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const user = isRegister
        ? await api.register(form)
        : await api.login({ email: form.email, password: form.password });
      onAuth(user);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="auth">
      <h1>Notes</h1>
      <h2>{isRegister ? 'Create account' : 'Log in'}</h2>

      <form onSubmit={submit}>
        {isRegister && (
          <input name="name" placeholder="Name" value={form.name} onChange={update} required />
        )}
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={update}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password (min 6 characters)"
          value={form.password}
          onChange={update}
          minLength={6}
          required
        />
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={busy}>
          {busy ? '…' : isRegister ? 'Register' : 'Log in'}
        </button>
      </form>

      <p className="switch">
        {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
        <button
          type="button"
          className="link"
          onClick={() => {
            setMode(isRegister ? 'login' : 'register');
            setError('');
          }}
        >
          {isRegister ? 'Log in' : 'Register'}
        </button>
      </p>
    </main>
  );
}
