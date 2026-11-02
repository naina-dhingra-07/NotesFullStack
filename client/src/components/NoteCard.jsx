// Renders one note. Edit/Delete buttons only appear when handlers are passed (i.e. "My Notes").
export default function NoteCard({ note, onEdit, onDelete, showAuthor }) {
  return (
    <article className="note">
      <header>
        <h3>{note.title}</h3>
        {!showAuthor && <span className="tag">{note.isPublic ? 'Public' : 'Private'}</span>}
      </header>
      {note.body && <p className="body">{note.body}</p>}
      <footer>
        <small>
          {showAuthor && note.owner?.name ? `by ${note.owner.name} · ` : ''}
          {new Date(note.updatedAt).toLocaleString()}
        </small>
        {(onEdit || onDelete) && (
          <div className="row">
            {onEdit && (
              <button className="secondary small" onClick={() => onEdit(note)}>
                Edit
              </button>
            )}
            {onDelete && (
              <button className="danger small" onClick={() => onDelete(note)}>
                Delete
              </button>
            )}
          </div>
        )}
      </footer>
    </article>
  );
}
