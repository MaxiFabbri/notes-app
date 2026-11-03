import { Router } from 'express';
import * as controller from '../controllers/notesTagsControllers.js';

const notesTagsRouter = Router();

// Mounted at /api/notes. These routes operate on links, not on the tag itself.
notesTagsRouter.get('/:noteId/tags', controller.getNoteTags);
notesTagsRouter.post('/:noteId/tags/:tagId', controller.addTagToNote);
notesTagsRouter.delete('/:noteId/tags/:tagId', controller.removeTagFromNote);

export default notesTagsRouter;
