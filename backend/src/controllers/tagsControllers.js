import {
  createTagService,
  getTagsService,
  getTagService,
  deleteTagService,
  updateTagService,
} from '../services/tagsService.js';

function sendErrorResponse(error, res) {
  if (error.code === 'INVALID_INPUT') {
    return res.status(400).json({ error: error.message });
  }
  if (error.code === 'TAG_NOT_FOUND') {
    return res.status(404).json({ error: error.message });
  }
  if (['TAG_ALREADY_EXISTS', 'TAG_IN_USE'].includes(error.code)) {
    return res.status(409).json({ error: error.message });
  }
  console.error('Unexpected tags error:', error.name);
  return res.status(500).json({ error: 'Internal server error' });
}

async function createTag(req, res) {
  try {
    const tag = await createTagService(req.body);
    return res.status(201).json(tag);
  } catch (error) {
    return sendErrorResponse(error, res);
  }
}

async function getTags(req, res) {
  try {
    const tags = await getTagsService();
    return res.status(200).json(tags);
  } catch (error) {
    return sendErrorResponse(error, res);
  }
}

async function getTag(req, res) {
  try {
    const tag = await getTagService(req.params.id);
    return res.status(200).json(tag);
  } catch (error) {
    return sendErrorResponse(error, res);
  }
}

async function deleteTag(req, res) {
  try {
    const tag = await deleteTagService(req.params.id);
    return res.status(200).json(tag);
  } catch (error) {
    return sendErrorResponse(error, res);
  }
}

async function updateTag(req, res) {
  try {
    const tag = await updateTagService(req.params.id, req.body);
    return res.status(200).json(tag);
  } catch (error) {
    return sendErrorResponse(error, res);
  }
}

export { createTag, getTags, getTag, deleteTag, updateTag };
