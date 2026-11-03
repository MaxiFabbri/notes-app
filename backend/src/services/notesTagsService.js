import { sequelize } from '../utils/dbConnect.util.js';
import { getNoteService } from './notesService.js';
import { getTagService } from './tagsService.js';
import { getNoteById } from '../dao/notesDao.js';
import { addTagToNote, removeTagFromNote, getNoteTags } from '../dao/notesTagsDao.js';

async function getNoteTagsService(noteId) {
  await getNoteService(noteId);
  return await getNoteTags(noteId);
}

async function changeNoteTag(noteId, tagId, operation) {
  try {
    return await sequelize.transaction(async transaction => {
      const options = { transaction };
      // These services validate UUIDs and check that both records exist.
      await getNoteService(noteId, options);
      await getTagService(tagId, options);
      await operation(noteId, tagId, options);
      // Return the note with all its tags so the frontend can refresh its state.
      return await getNoteById(noteId, options);
    });
  } catch (error) {
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      const missing = new Error('Note or tag no longer exists');
      missing.code = 'RELATION_TARGET_NOT_FOUND';
      throw missing;
    }
    throw error;
  }
}

async function addTagToNoteService(noteId, tagId) {
  return await changeNoteTag(noteId, tagId, addTagToNote);
}

async function removeTagFromNoteService(noteId, tagId) {
  return await changeNoteTag(noteId, tagId, removeTagFromNote);
}

export { getNoteTagsService, addTagToNoteService, removeTagFromNoteService };
