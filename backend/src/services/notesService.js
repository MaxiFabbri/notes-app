import {
  createNote,
  getAllNotes,
  getSomeNotes,
  getNoteById,
  updateNote,
  deleteNote,
} from '../dao/notesDao.js';

function serviceError(message, code = 'INVALID_INPUT') {
  const error = new Error(message);
  error.code = code;
  return error;
}

function validateId(id) {
  if (typeof id !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
    throw serviceError('Note ID must be a valid UUID');
  }
}

function validateNoteData(data, { partial = false } = {}) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw serviceError('Note data must be an object');
  }
  const fields = ['title', 'content', 'isArchived'];
  if (Object.keys(data).some(key => !fields.includes(key))) {
    throw serviceError('Only title, content and isArchived can be provided');
  }
  if (partial && Object.keys(data).length === 0) {
    throw serviceError('Provide at least one field to update');
  }
  if (!partial || Object.hasOwn(data, 'content')) {
    if (typeof data.content !== 'string' || !data.content.trim()) {
      throw serviceError('Content must be a non-empty string');
    }
  }
  if (Object.hasOwn(data, 'title') && data.title !== null) {
    if (typeof data.title !== 'string' || data.title.length > 255) {
      throw serviceError('Title must be a string of at most 255 characters, or null');
    }
  }
  if (Object.hasOwn(data, 'isArchived') && typeof data.isArchived !== 'boolean') {
    throw serviceError('isArchived must be a boolean');
  }
}

async function createNoteService(noteData, options = {}) {
  validateNoteData(noteData);
  return await createNote(noteData, options);
}

async function getNotesService(options = {}) {
  return await getAllNotes(options);
}

async function getSomeNotesService(filter = {}, options = {}) {
  if (!filter || typeof filter !== 'object' || Array.isArray(filter)) {
    throw serviceError('Filters must be an object');
  }
  if (Object.keys(filter).some(key => !['isArchived', 'tagId'].includes(key))) {
    throw serviceError('Only isArchived and tagId filters are supported');
  }
  const where = {};
  if (Object.hasOwn(filter, 'isArchived')) {
    const value = filter.isArchived;
    if (![true, false, 'true', 'false'].includes(value)) {
      throw serviceError('isArchived filter must be true or false');
    }
    // HTTP query parameters arrive as strings; the DAO receives a boolean.
    where.isArchived = value === true || value === 'true';
  }
  if (Object.hasOwn(filter, 'tagId')) {
    validateId(filter.tagId);
  }
  return await getSomeNotes(where, { ...options, tagId: filter.tagId });
}

async function getNoteService(id, options = {}) {
  validateId(id);
  const note = await getNoteById(id, options);
  if (!note) throw serviceError('Note not found', 'NOTE_NOT_FOUND');
  return note;
}

async function updateNoteService(id, data, options = {}) {
  validateId(id);
  validateNoteData(data, { partial: true });
  const note = await updateNote(id, data, options);
  if (!note) throw serviceError('Note not found', 'NOTE_NOT_FOUND');
  return note;
}

async function deleteNoteService(id, options = {}) {
  validateId(id);
  const note = await deleteNote(id, options);
  if (!note) throw serviceError('Note not found', 'NOTE_NOT_FOUND');
  return note;
}

export {
  createNoteService,
  getNotesService,
  getSomeNotesService,
  getNoteService,
  updateNoteService,
  deleteNoteService,
};
