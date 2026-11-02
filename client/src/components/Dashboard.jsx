import { useCallback, useEffect, useState } from 'react';
import { api } from '../api';
import NoteForm from './NoteForm.jsx';
import NoteCard from './NoteCard.jsx';

export default function Dashboard({ user, onLogout }) {
  const [tab, setTab] = useState('mine'); // 'mine' | 'public'
  const [myNotes, setMyNotes] = useState([]);
  const [publicNotes, setPublicNotes] = useState([]);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      const [mine, pub] = await Promise.all([api.myNotes(), api.publicNotes()]);
      setMyNotes(mine);
      setPublicNotes(pub);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleSubmit = async (data) => {
    if (editing) {
      await api.updateNote(editing._id, data);
      setEditing(null);
    } else {
      await api.createNote(data);
    }
    await load();
  };

  const handleDelete = async (note) => {
    if (!window.confirm(`Delete "${note.title}"?`)) return;
    try {
      await api.deleteNote(note._id);
      if (editing?._id === note._id) setEditing(null);
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (note) => {
    setEditing(note);
    setTab('mine');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="dashboard">
      <header className="topbar">
        <h1>Notes</h1>
        <div className="row">
          <span>{user.name}</span>
          <button className="secondary small" onClick={onLogout}>
            Log out
          </button>
        </div>
      </header>

      <section>
        <h2>{editing ? 'Edit note' : 'New note'}</h2>
        <NoteForm note={editing} onSubmit={handleSubmit} onCancel={() => setEditing(null)} />
      </section>

      <nav className="tabs">
        <button className={tab === 'mine' ? 'active' : ''} onClick={() => setTab('mine')}>
          My Notes ({myNotes.length})
        </button>
        <button className={tab === 'public' ? 'active' : ''} onClick={() => setTab('public')}>
          Public Notes ({publicNotes.length})
        </button>
      </nav>

      {error && <p className="error">{error}</p>}

      <section className="list">
        {tab === 'mine' &&
          (myNotes.length === 0 ? (
            <p className="empty">No notes yet. Add one above.</p>
          ) : (
            myNotes.map((n) => (
              <NoteCard key={n._id} note={n} onEdit={handleEdit} onDelete={handleDelete} />
            ))
          ))}

        {tab === 'public' &&
          (publicNotes.length === 0 ? (
            <p className="empty">Nothing public yet.</p>
          ) : (
            publicNotes.map((n) => <NoteCard key={n._id} note={n} showAuthor />)
          ))}
      </section>
    </main>
  );
}
