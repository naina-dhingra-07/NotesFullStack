import { useEffect, useState } from 'react';

const EMPTY = { title: '', body: '', isPublic: false };

// Used for both creating and editing. Pass `note` to edit, omit it to create.
export default function NoteForm({ note, onSubmit, onCancel }) {
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setForm(note ? { title: note.title, body: note.body, isPublic: note.isPublic } : EMPTY);
    setError('');
  }, [note]);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await onSubmit(form);
      if (!note) setForm(EMPTY);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="note-form" onSubmit={submit}>
      <input
        placeholder="Title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        maxLength={120}
        required
      />
      <textarea
        placeholder="Write something…"
        rows={4}
        value={form.body}
        onChange={(e) => setForm({ ...form, body: e.target.value })}
      />
      <label className="checkbox">
        <input
          type="checkbox"
          checked={form.isPublic}
          onChange={(e) => setForm({ ...form, isPublic: e.target.checked })}
        />
        Make Public
      </label>
      {error && <p className="error">{error}</p>}
      <div className="row">
        <button type="submit" disabled={busy}>
          {note ? 'Save changes' : 'Add note'}
        </button>
        {note && (
          <button type="button" className="secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
