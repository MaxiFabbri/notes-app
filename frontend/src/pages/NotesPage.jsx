import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { getNotes } from '../api/notesApi.js';
import { getTags } from '../api/tagsApi.js';
import NoteList from '../components/NoteList.jsx';
import NoteForm from '../components/NoteForm.jsx';
import TagManager from '../components/TagManager.jsx';
import './NotesPage.css';

function NotesPage() {
  const [filterArchived, setFilterArchived] = useState(false);
  const [filterTagId, setFilterTagId] = useState('');
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadCount, setReloadCount] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [showTagManager, setShowTagManager] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [tags, setTags] = useState([]);
  const [tagsLoading, setTagsLoading] = useState(true);
  const [tagsError, setTagsError] = useState('');
  const [tagsReloadCount, setTagsReloadCount] = useState(0);

  useEffect(() => {
    // Ignore results from an old request if the filter changes or we leave the page.
    let ignore = false;

    async function loadNotes() {
      try {
        const data = await getNotes({ isArchived: filterArchived, tagId: filterTagId });
        if (!ignore) setNotes(data);
      } catch (requestError) {
        if (!ignore) {
          setError(requestError.response?.data?.error || 'Could not load notes. Check that the backend is running.');
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadNotes();
    return () => {
      ignore = true;
    };
  }, [filterArchived, filterTagId, reloadCount]);

  function changeStatus(event) {
    setLoading(true);
    setError('');
    setNotes([]);
    setFilterArchived(event.target.value === 'true');
  }

  function changeTag(event) {
    setLoading(true);
    setError('');
    setNotes([]);
    setFilterTagId(event.target.value);
  }

  function reloadNotes() {
    setLoading(true);
    setError('');
    setNotes([]);
    setReloadCount(count => count + 1);
  }

  useEffect(() => {
    let ignore = false;
    async function loadTags() {
      try {
        const data = await getTags();
        if (!ignore) setTags(data);
      } catch (requestError) {
        if (!ignore) setTagsError(requestError.response?.data?.error || 'Could not load categories.');
      } finally {
        if (!ignore) setTagsLoading(false);
      }
    }
    loadTags();
    return () => { ignore = true; };
  }, [tagsReloadCount]);

  function reloadTags() {
    setTagsLoading(true);
    setTagsError('');
    setTagsReloadCount(count => count + 1);
  }

  function handleTagCreated(tag) {
    setTags(current => [...current.filter(item => item.id !== tag.id), tag]);
  }

  function openNewNote() {
    setEditingNote(null);
    setShowForm(true);
  }

  function openEditNote(note) {
    setEditingNote(note);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    reloadTags();
    reloadNotes();
  }

  function handleNoteSaved() {
    toast.success(editingNote ? 'Note updated successfully.' : 'Note created successfully.');
    reloadTags();
    setShowForm(false);
    reloadNotes();
  }

  function handleArchiveChanged(isArchived) {
    toast.success(isArchived ? 'Note archived successfully.' : 'Note unarchived successfully.');
    reloadNotes();
  }

  function handleNoteDeleted() {
    toast.success('Note deleted successfully.');
    reloadTags();
    reloadNotes();
  }

  function openTagManager() {
    reloadTags();
    setShowTagManager(true);
  }

  function handleTagDeleted(id) {
    setTags(current => current.filter(tag => tag.id !== id));
    if (filterTagId === id) {
      setFilterTagId('');
      reloadNotes();
    }
    reloadTags();
    toast.success('Category deleted successfully.');
  }

  return (
    <main className="notes-container">
      <header className="notes-header">
        <h1>Notes</h1>
        <div className="notes-actions">
          <button type="button" className="notes-add" onClick={openNewNote}>
            <span aria-hidden="true">+</span> Add Note
          </button>
          <button type="button" onClick={openTagManager}>Manage categories</button>
        </div>
      </header>

      {showTagManager && (
        <TagManager
          tags={tags}
          loading={tagsLoading}
          loadError={tagsError}
          onReload={reloadTags}
          onTagDeleted={handleTagDeleted}
          onClose={() => setShowTagManager(false)}
        />
      )}

      {showForm && (
        <NoteForm
          key={editingNote?.id || 'new'}
          note={editingNote}
          onNoteSaved={handleNoteSaved}
          onCancel={closeForm}
          availableTags={tags}
          onTagCreated={handleTagCreated}
          tagsLoading={tagsLoading}
          tagsError={tagsError}
          onReloadTags={reloadTags}
        />
      )}

      <div className="notes-filters" role="group" aria-label="Filter notes">
        <div className="notes-filter-field">
          <label htmlFor="notes-status">Show</label>
          <select id="notes-status" value={String(filterArchived)} onChange={changeStatus}>
            <option value="false">Active</option>
            <option value="true">Archived</option>
          </select>
        </div>
        <div className="notes-filter-field">
          <label htmlFor="notes-tag">Category</label>
          <select id="notes-tag" value={filterTagId} onChange={changeTag} disabled={tagsLoading || Boolean(tagsError)}>
            <option value="">{tagsLoading ? 'Loading categories...' : 'All categories'}</option>
            {[...tags].sort((a, b) => a.name.localeCompare(b.name)).map(tag => (
              <option key={tag.id} value={tag.id}>{tag.name}</option>
            ))}
          </select>
        </div>
      </div>

      {tagsError && (
        <div className="notes-error" role="alert">
          <p>{tagsError}</p>
          <button type="button" onClick={reloadTags} disabled={tagsLoading}>Reload categories</button>
          {filterTagId && <button type="button" onClick={() => { setFilterTagId(''); reloadNotes(); }}>Clear category filter</button>}
        </div>
      )}

      {loading && <p className="notes-message" role="status">Loading notes...</p>}

      {!loading && error && (
        <div className="notes-error" role="alert">
          <p>{error}</p>
          <button type="button" onClick={reloadNotes}>Try again</button>
        </div>
      )}

      {!loading && !error && notes.length === 0 && (
        <p className="notes-message">
          {filterTagId
            ? 'No notes match the selected status and category.'
            : filterArchived ? 'No archived notes yet.' : 'No active notes yet.'}
        </p>
      )}

      {!loading && !error && notes.length > 0 && (
        <NoteList
          notes={notes}
          onEdit={openEditNote}
          onNoteDeleted={handleNoteDeleted}
          onArchiveChanged={handleArchiveChanged}
          label={filterArchived ? 'Archived notes' : 'Active notes'}
        />
      )}
    </main>
  );
}

export default NotesPage;
