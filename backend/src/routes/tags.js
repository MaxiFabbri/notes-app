import { Router } from 'express';
import * as tagsController from '../controllers/tagsControllers.js';

const tagsRouter = Router();

// Paths are relative to /api/tags, configured in server.js.
tagsRouter.post('/', tagsController.createTag);
tagsRouter.get('/', tagsController.getTags);
tagsRouter.get('/:id', tagsController.getTag);
tagsRouter.delete('/:id', tagsController.deleteTag);
tagsRouter.put('/:id', tagsController.updateTag);

export default tagsRouter;
