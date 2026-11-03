import {
  createNoteService,
  getNotesService,
  getSomeNotesService,
  getNoteService,
  updateNoteService,
  deleteNoteService,
} from '../services/notesService.js';

// Translate service errors into HTTP responses without exposing database details.
function sendErrorResponse(error, res) {
  if (error.code === 'INVALID_INPUT') {
    return res.status(400).json({ error: error.message });
  }
  if (error.code === 'NOTE_NOT_FOUND') {
    return res.status(404).json({ error: error.message });
  }

  console.error('Unexpected notes error:', error.name);
  return res.status(500).json({ error: 'Internal server error' });
}

async function createNote(req, res) {
  try {
    const note = await createNoteService(req.body);
    return res.status(201).json(note);
  } catch (error) {
    return sendErrorResponse(error, res);
  }
}

async function getNotes(req, res) {
  try {
    // Forward query values unchanged: parsing and validation belong to the service.
    const notes = Object.keys(req.query).length === 0
      ? await getNotesService()
      : await getSomeNotesService(req.query);
    return res.status(200).json(notes);
  } catch (error) {
    return sendErrorResponse(error, res);
  }
}

async function getNote(req, res) {
  try {
    const note = await getNoteService(req.params.id);
    return res.status(200).json(note);
  } catch (error) {
    return sendErrorResponse(error, res);
  }
}

async function updateNote(req, res) {
  try {
    const note = await updateNoteService(req.params.id, req.body);
    return res.status(200).json(note);
  } catch (error) {
    return sendErrorResponse(error, res);
  }
}

async function deleteNote(req, res) {
  try {
    const note = await deleteNoteService(req.params.id);
    return res.status(200).json(note);
  } catch (error) {
    return sendErrorResponse(error, res);
  }
}

export { createNote, getNotes, getNote, updateNote, deleteNote };
