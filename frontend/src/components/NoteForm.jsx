import { useEffect, useRef, useState } from 'react';
import { createNote, updateNote } from '../api/notesApi.js';
import { addTagToNote, removeTagFromNote } from '../api/notesTagsApi.js';
import TagSelector from './TagSelector.jsx';
import './NoteForm.css';

function NoteForm({ note = null, onNoteSaved, onCancel, availableTags, onTagCreated, tagsLoading, tagsError, onReloadTags }) {
  const dialogRef = useRef(null);
  const submittingRef = useRef(false);
  const savedIdRef = useRef(note?.id || null);
  const savedTagsRef = useRef(note?.tags || []);
  const [selectedTags, setSelectedTags] = useState(note?.tags || []);
  const [tagBusy, setTagBusy] = useState(false);
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [isArchived, setIsArchived] = useState(note?.isArchived || false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const dialog = dialogRef.current;
    // Native dialog handles focus, keyboard navigation and the background overlay.
    dialog.showModal();
    return () => dialog.close();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    if (submittingRef.current || tagBusy) return;
    if (!content.trim()) {
      setError('Content is required.');
      return;
    }

    submittingRef.current = true;
    setSaving(true);
    setError('');
    let saved = false;
    let fieldsSaved = false;
    try {
      const data = { title: title.trim(), content, isArchived };
      const savedNote = savedIdRef.current
        ? await updateNote(savedIdRef.current, data)
        : await createNote(data);
      // Retain the ID on a tag failure so retry does not create another note.
      savedIdRef.current = savedNote.id;
      fieldsSaved = true;
      for (const tag of [...savedTagsRef.current]) {
        if (!selectedTags.some(selected => selected.id === tag.id)) {
          await removeTagFromNote(savedNote.id, tag.id);
          savedTagsRef.current = savedTagsRef.current.filter(item => item.id !== tag.id);
        }
      }
      for (const tag of selectedTags) {
        if (!savedTagsRef.current.some(item => item.id === tag.id)) {
          await addTagToNote(savedNote.id, tag.id);
          savedTagsRef.current = [...savedTagsRef.current, tag];
        }
      }
      saved = true;
    } catch (requestError) {
      const message = requestError.response?.data?.error || 'Check your connection and try again.';
      setError(fieldsSaved ? `Note saved, but categories could not be fully updated. ${message} Retry to complete the changes.` : `Could not save the note. ${message}`);
    } finally {
      submittingRef.current = false;
      setSaving(false);
    }
    if (saved) onNoteSaved();
  }

  function handleCancel(event) {
    // Do not dismiss the dialog with Escape while a save is in progress.
    event.preventDefault();
    if (!submittingRef.current && !tagBusy) onCancel();
  }

  return (
    <dialog className="note-dialog" ref={dialogRef} aria-labelledby="new-note-title" onCancel={handleCancel}>
      <form className="note-form" onSubmit={handleSubmit} aria-busy={saving}>
        <h2 id="new-note-title">{note ? 'Edit note' : 'New note'}</h2>
        <fieldset disabled={saving}>
          <label htmlFor="note-title">Title (optional)</label>
          <input
            id="note-title"
            type="text"
            maxLength={255}
            value={title}
            onChange={event => setTitle(event.target.value)}
            placeholder="Note title"
          />

          <label htmlFor="note-content">Content</label>
          <textarea
            id="note-content"
            value={content}
            onChange={event => setContent(event.target.value)}
            placeholder="Write your note content here..."
            rows={6}
            required
          />

          <TagSelector
            availableTags={availableTags}
            selectedTags={selectedTags}
            onChange={setSelectedTags}
            onTagCreated={onTagCreated}
            loading={tagsLoading}
            loadError={tagsError}
            onReload={onReloadTags}
            onBusyChange={setTagBusy}
          />

          <label className="note-form-checkbox" htmlFor="note-archived">
            <input
              id="note-archived"
              type="checkbox"
              checked={isArchived}
              onChange={event => setIsArchived(event.target.checked)}
            />
            Archive this note
          </label>

          {error && <p className="note-form-error" role="alert">{error}</p>}

          <div className="note-form-actions">
            <button type="submit" disabled={tagBusy}>{saving ? 'Saving...' : note ? 'Save Changes' : 'Create Note'}</button>
            <button type="button" disabled={tagBusy} onClick={onCancel}>Cancel</button>
          </div>
        </fieldset>
      </form>
    </dialog>
  );
}

export default NoteForm;
