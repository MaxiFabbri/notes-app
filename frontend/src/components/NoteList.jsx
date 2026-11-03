import Note from './Note.jsx';
import './NoteList.css';

// Receive the list from the page and render one Note for each record.
function NoteList({ notes, label = 'Notes', onEdit, onNoteDeleted, onArchiveChanged }) {
  return (
    <section className="notes-list" aria-label={label}>
      {notes.map(note => <Note key={note.id} note={note} onEdit={onEdit} onNoteDeleted={onNoteDeleted} onArchiveChanged={onArchiveChanged} />)}
    </section>
  );
}

export default NoteList;
