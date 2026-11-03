import { useEffect, useRef, useState } from 'react';
import { deleteTag } from '../api/tagsApi.js';
import ConfirmDialog from './ConfirmDialog.jsx';
import './TagManager.css';

function TagManager({ tags, loading, loadError, onReload, onTagDeleted, onClose }) {
  const dialogRef = useRef(null);
  const submittingRef = useRef(false);
  const [selectedTag, setSelectedTag] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const dialog = dialogRef.current;
    dialog.showModal();
    return () => dialog.close();
  }, []);

  function handleClose(event) {
    event.preventDefault();
    if (!submittingRef.current) onClose();
  }

  async function handleDelete() {
    if (!selectedTag || submittingRef.current) return;
    submittingRef.current = true;
    setDeleting(true);
    setError('');
    let deleted = false;
    try {
      await deleteTag(selectedTag.id);
      deleted = true;
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'Could not delete category. Please try again.');
      if ([409, 404].includes(requestError.response?.status)) {
        // Refresh if the tag was assigned or removed after this list was loaded.
        setSelectedTag(null);
        onReload();
      }
    } finally {
      submittingRef.current = false;
      setDeleting(false);
    }
    if (deleted) {
      setSelectedTag(null);
      onTagDeleted(selectedTag.id);
    }
  }

  return (
    <dialog ref={dialogRef} className="tag-manager" aria-labelledby="tag-manager-title" onCancel={handleClose}>
      <h2 id="tag-manager-title">Manage categories</h2>
      <p className="tag-manager-help">Only unused categories can be deleted. Archived notes also count as usage.</p>
      {loading && <p role="status">Loading categories...</p>}
      {loadError && <div className="tag-manager-error" role="alert"><p>{loadError}</p><button type="button" onClick={onReload} disabled={loading}>Try again</button></div>}
      {!selectedTag && error && <p className="tag-manager-error" role="alert">{error}</p>}
      {!loading && !loadError && tags.length === 0 && <p>No categories available. Create one from a note form.</p>}
      {!loading && !loadError && tags.length > 0 && (
        <ul className="tag-manager-list">
          {[...tags].sort((a, b) => a.name.localeCompare(b.name)).map(tag => (
            <li key={tag.id}>
              <div className="tag-manager-details">
                <strong>{tag.name}</strong>
                <span>{tag.notesCount === 0 ? 'Unused' : `${tag.notesCount} note${tag.notesCount === 1 ? '' : 's'}`}</span>
              </div>
              <button type="button" className="tag-manager-delete" disabled={tag.notesCount !== 0 || deleting}
                aria-label={`Delete category ${tag.name}`}
                title={tag.notesCount === 0 ? 'Delete unused category' : 'Categories assigned to notes cannot be deleted'}
                onClick={() => { setError(''); setSelectedTag(tag); }}>Delete</button>
            </li>
          ))}
        </ul>
      )}
      <div className="tag-manager-actions"><button type="button" disabled={deleting} onClick={onClose}>Close</button></div>
      {selectedTag && (
        <ConfirmDialog
          title="Delete category?"
          message={`Delete “${selectedTag.name}”? This action cannot be undone.`}
          confirmLabel="Delete category"
          pending={deleting}
          error={error}
          onConfirm={handleDelete}
          onCancel={() => { setSelectedTag(null); setError(''); }}
        />
      )}
    </dialog>
  );
}

export default TagManager;
