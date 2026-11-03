import { literal } from 'sequelize';
import { tagsModel, noteTagsModel } from '../models/index.js';

async function createTag(data, { transaction } = {}) {
  // Accept only the name; Sequelize generates the UUID and timestamps.
  return await tagsModel.create({ name: data.name }, { transaction });
}

async function getAllTags({ transaction } = {}) {
  return await tagsModel.findAll({
    attributes: {
      include: [[literal(`(
        SELECT COUNT(*)::integer
        FROM note_tags AS links
        WHERE links."tagId" = "Tag".id
      )`), 'notesCount']],
    },
    order: [['name', 'ASC'], ['id', 'ASC']],
    transaction,
  });
}

async function getTagById(id, { transaction, lock } = {}) {
  return await tagsModel.findByPk(id, { transaction, lock });
}

async function getTagByName(name, { transaction } = {}) {
  return await tagsModel.findOne({ where: { name }, transaction });
}

async function deleteTag(id, { transaction } = {}) {
  const tag = await getTagById(id, { transaction });
  if (!tag) return null;

  // The service checks usage under a row lock before calling this operation.
  await tag.destroy({ transaction });
  return tag;
}

async function countTagNotes(id, { transaction } = {}) {
  return await noteTagsModel.count({ where: { tagId: id }, transaction });
}

async function updateTag(id, data, { transaction } = {}) {
  const tag = await getTagById(id, { transaction });
  if (!tag) return null;
  return await tag.update({ name: data.name }, { fields: ['name'], transaction });
}

export { createTag, getAllTags, getTagById, getTagByName, deleteTag, countTagNotes, updateTag };
