import { Op } from 'sequelize';
import { notesModel, tagsModel, noteTagsModel } from '../models/index.js';

// Include tag data without exposing the intermediate table in the result.
const tagsInclude = {
  model: tagsModel,
  as: 'tags',
  through: { attributes: [] },
};
const noteFields = ['title', 'content', 'isArchived'];

async function createNote(data, { transaction } = {}) {
  const noteData = Object.fromEntries(
    noteFields.filter(field => Object.hasOwn(data, field)).map(field => [field, data[field]])
  );
  return await notesModel.create(noteData, { transaction });
}

async function getAllNotes({ transaction } = {}) {
  return await getSomeNotes({}, { transaction });
}

// The service will provide a Sequelize filter, e.g. { isArchived: false }.
async function getSomeNotes(filter, { transaction, tagId } = {}) {
  const where = { ...filter };
  if (tagId !== undefined) {
    // Filter matching notes first, then include ALL their tags in the response.
    const links = await noteTagsModel.findAll({
      where: { tagId }, attributes: ['noteId'], raw: true, transaction,
    });
    where.id = { [Op.in]: links.map(link => link.noteId) };
  }
  return await notesModel.findAll({
    where,
    include: [tagsInclude],
    order: [['createdAt', 'DESC'], ['id', 'ASC']],
    transaction,
  });
}

async function getNoteById(id, { transaction } = {}) {
  return await notesModel.findByPk(id, {
    include: [tagsInclude],
    transaction,
  });
}

async function updateNote(id, data, { transaction } = {}) {
  const note = await getNoteById(id, { transaction });
  if (!note) return null;

  // Only note fields can change; IDs and timestamps are managed by Sequelize.
  return await note.update(data, { fields: noteFields, transaction });
}

async function deleteNote(id, { transaction } = {}) {
  const note = await getNoteById(id, { transaction });
  if (!note) return null;

  await note.destroy({ transaction });
  return note;
}

export { createNote, getAllNotes, getSomeNotes, getNoteById, updateNote, deleteNote };
