import { useState } from 'react';
import { createTag } from '../api/tagsApi.js';
import './TagSelector.css';

function TagSelector({ availableTags, selectedTags, onChange, onTagCreated, loading, loadError, onReload, onBusyChange }) {
  const [search, setSearch] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const name = search.trim();
  const normalized = name.toLowerCase();
  const matchingTags = availableTags.filter(tag =>
    tag.name.toLowerCase().includes(normalized) && !selectedTags.some(selected => selected.id === tag.id)
  );
  const nameExists = [...availableTags, ...selectedTags].some(tag => tag.name.toLowerCase() === normalized);

  function selectTag(tag) {
    onChange([...selectedTags, tag]);
    setSearch('');
    setError('');
  }

  async function handleCreate() {
    if (!name || creating) return;
    setCreating(true);
    onBusyChange(true);
    setError('');
    try {
      const tag = await createTag(name);
      onTagCreated(tag);
      selectTag(tag);
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'Could not create category. Try again.');
      if (requestError.response?.status === 409) onReload();
    } finally {
      setCreating(false);
      onBusyChange(false);
    }
  }

  return (
    <div className="tag-selector">
      <label htmlFor="tag-search">Categories</label>
      <input id="tag-search" type="text" value={search} maxLength={255}
        onChange={event => { setSearch(event.target.value); setError(''); }}
        placeholder="Search or create a category..." disabled={creating}
        onKeyDown={event => { if (event.key === 'Enter') event.preventDefault(); }} />
      {selectedTags.length > 0 && (
        <ul className="tag-selector-selected" aria-label="Selected categories">
          {selectedTags.map(tag => (
            <li key={tag.id}>{tag.name}
              <button type="button" disabled={creating} aria-label={`Remove ${tag.name}`}
                onClick={() => onChange(selectedTags.filter(item => item.id !== tag.id))}>×</button>
            </li>
          ))}
        </ul>
      )}
      {loading && <p role="status">Loading categories...</p>}
      {loadError && <div role="alert"><p>{loadError}</p><button type="button" onClick={onReload} disabled={loading || creating}>Reload categories</button></div>}
      {!loading && !loadError && (
        <>
          <ul className="tag-selector-options" aria-label="Available categories">
            {matchingTags.map(tag => <li key={tag.id}><button type="button" disabled={creating} onClick={() => selectTag(tag)}>{tag.name}</button></li>)}
          </ul>
          {!name && matchingTags.length === 0 && <p>No more categories available. Type a name to create one.</p>}
          {name && !nameExists && <button type="button" disabled={creating} onClick={handleCreate}>{creating ? 'Creating category...' : `Create category “${name}”`}</button>}
        </>
      )}
      {error && <p className="note-form-error" role="alert">{error}</p>}
    </div>
  );
}
export default TagSelector;
