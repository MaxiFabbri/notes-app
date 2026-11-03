import { useState } from 'react';
import { deleteNote, toggleArchiveNote } from '../api/notesApi.js';
import ConfirmDialog from './ConfirmDialog.jsx';
import './Note.css';

// Display one note and open the shared form for editing.
function Note({ note, onEdit, onNoteDeleted, onArchiveChanged }) {
  const [deleting, setDeleting] = useState(false);
  const [archiving, setArchiving] = useState(false);
  const busy = deleting || archiving;
  const [error, setError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  async function handleDelete() {
    if (busy) return;

    setDeleting(true);
    setError('');
    let deleted = false;
    try {
      await deleteNote(note.id);
      deleted = true;
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'Could not delete the note. Please try again.');
    } finally {
      setDeleting(false);
    }
    if (deleted) {
      setShowDeleteConfirm(false);
      onNoteDeleted();
    }
  }

  async function handleArchive() {
    if (busy) return;
    setArchiving(true);
    setError('');
    let updated = false;
    try {
      await toggleArchiveNote(note.id, !note.isArchived);
      updated = true;
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'Could not change the note status. Please try again.');
    } finally {
      setArchiving(false);
    }
    if (updated) onArchiveChanged(!note.isArchived);
  }

  return (
    <article className="note-card" aria-busy={busy}>
      {showDeleteConfirm && (
        <ConfirmDialog
          title="Delete note?"
          message="This will permanently delete the note. Its categories will remain available."
          pending={deleting}
          error={error}
          onConfirm={handleDelete}
          onCancel={() => { setShowDeleteConfirm(false); setError(''); }}
        />
      )}
      <h2>{note.title || ''}</h2>
      <p className="note-content">{note.content}</p>
      {note.tags?.length > 0 && (
        <ul className="note-tags" aria-label="Categories">
          {note.tags.map(tag => <li key={tag.id}>{tag.name}</li>)}
        </ul>
      )}
      <div className="note-form-actions">
        <button type="button" className="note-archive" disabled={busy} onClick={handleArchive}>
          {archiving ? 'Saving...' : note.isArchived ? 'Unarchive' : 'Archive'}
        </button>
        <button type="button" disabled={busy} onClick={() => onEdit(note)}>Edit</button>
        <button type="button" className="note-delete" disabled={busy} onClick={() => { setError(''); setShowDeleteConfirm(true); }}>
          {deleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
      {!showDeleteConfirm && error && <p className="note-action-error" role="alert">{error}</p>}
    </article>
  );
}

export default Note;
