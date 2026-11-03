import { noteTagsModel, tagsModel } from '../models/index.js';

async function addTagToNote(noteId, tagId, { transaction } = {}) {
  // Ignore an existing pair, including when two requests arrive together.
  await noteTagsModel.bulkCreate([{ noteId, tagId }], {
    ignoreDuplicates: true,
    transaction,
  });
}

async function removeTagFromNote(noteId, tagId, { transaction } = {}) {
  return await noteTagsModel.destroy({ where: { noteId, tagId }, transaction });
}

async function getNoteTags(noteId, { transaction } = {}) {
  return await tagsModel.findAll({
    include: [{
      association: 'notes',
      attributes: [],
      through: { attributes: [] },
      where: { id: noteId },
    }],
    order: [['name', 'ASC'], ['id', 'ASC']],
    transaction,
  });
}

export { addTagToNote, removeTagFromNote, getNoteTags };
