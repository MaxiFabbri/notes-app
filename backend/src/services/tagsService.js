import { sequelize } from '../utils/dbConnect.util.js';
import { createTag, getAllTags, getTagById, deleteTag, countTagNotes, updateTag } from '../dao/tagsDao.js';

function serviceError(message, code = 'INVALID_INPUT') {
  const error = new Error(message);
  error.code = code;
  return error;
}

function validateId(id) {
  if (typeof id !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
    throw serviceError('Tag ID must be a valid UUID');
  }
}

function validateTagData(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw serviceError('Tag data must be an object');
  }
  if (Object.keys(data).some(key => key !== 'name')) {
    throw serviceError('Only name can be provided');
  }
  if (typeof data.name !== 'string' || !data.name.trim() || data.name.trim().length > 255) {
    throw serviceError('Name must contain between 1 and 255 characters');
  }

}

async function createTagService(data, options = {}) {
  validateTagData(data);
  try {
    // Preserve display capitalization, but remove surrounding whitespace.
    return await createTag({ name: data.name.trim() }, options);
  } catch (error) {
    // The database also prevents duplicates from simultaneous requests.
    if (error.name === 'SequelizeUniqueConstraintError') {
      throw serviceError('A tag with this name already exists', 'TAG_ALREADY_EXISTS');
    }
    throw error;
  }
}

async function getTagsService(options = {}) {
  return await getAllTags(options);
}

async function getTagService(id, options = {}) {
  validateId(id);
  const tag = await getTagById(id, options);
  if (!tag) throw serviceError('Tag not found', 'TAG_NOT_FOUND');
  return tag;
}

async function deleteTagService(id, options = {}) {
  validateId(id);

  async function deleteUnusedTag(transaction) {
    // Lock the tag until commit so a simultaneous assignment cannot bypass the check.
    const tag = await getTagById(id, { transaction, lock: transaction.LOCK.UPDATE });
    if (!tag) throw serviceError('Tag not found', 'TAG_NOT_FOUND');
    if (await countTagNotes(id, { transaction }) > 0) {
      throw serviceError('Tags assigned to notes cannot be deleted', 'TAG_IN_USE');
    }
    return await deleteTag(id, { transaction });
  }

  if (options.transaction) return await deleteUnusedTag(options.transaction);
  return await sequelize.transaction(deleteUnusedTag);
}

async function updateTagService(id, data) {
  validateId(id);
  validateTagData(data);
  try {
    return await sequelize.transaction(async transaction => {
      // FOR UPDATE keeps assignment/deletion from racing with this check.
      const tag = await getTagById(id, { transaction, lock: transaction.LOCK.UPDATE });
      if (!tag) throw serviceError('Tag not found', 'TAG_NOT_FOUND');
      if (await countTagNotes(id, { transaction }) > 0) {
        throw serviceError('Tags assigned to notes cannot be edited', 'TAG_IN_USE');
      }
      return await updateTag(id, { name: data.name.trim() }, { transaction });
    });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      throw serviceError('A tag with this name already exists', 'TAG_ALREADY_EXISTS');
    }
    throw error;
  }
}

export { createTagService, getTagsService, getTagService, deleteTagService, updateTagService };
