import {
  getNoteTagsService,
  addTagToNoteService,
  removeTagFromNoteService,
} from '../services/notesTagsService.js';

function sendErrorResponse(error, res) {
  if (error.code === 'INVALID_INPUT') {
    return res.status(400).json({ error: error.message });
  }
  if (['NOTE_NOT_FOUND', 'TAG_NOT_FOUND', 'RELATION_TARGET_NOT_FOUND'].includes(error.code)) {
    return res.status(404).json({ error: error.message });
  }
  console.error('Unexpected note tags error:', error.name);
  return res.status(500).json({ error: 'Internal server error' });
}

async function getNoteTags(req, res) {
  try {
    return res.status(200).json(await getNoteTagsService(req.params.noteId));
  } catch (error) {
    return sendErrorResponse(error, res);
  }
}

async function addTagToNote(req, res) {
  try {
    const note = await addTagToNoteService(req.params.noteId, req.params.tagId);
    return res.status(200).json(note);
  } catch (error) {
    return sendErrorResponse(error, res);
  }
}

async function removeTagFromNote(req, res) {
  try {
    const note = await removeTagFromNoteService(req.params.noteId, req.params.tagId);
    return res.status(200).json(note);
  } catch (error) {
    return sendErrorResponse(error, res);
  }
}

export { getNoteTags, addTagToNote, removeTagFromNote };
