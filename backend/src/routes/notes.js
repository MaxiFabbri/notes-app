import { Router } from 'express';
import * as notesController from '../controllers/notesControllers.js';

const notesRouter = Router();

// Paths are relative to /api/notes, configured in server.js.
notesRouter.post('/', notesController.createNote);
notesRouter.get('/', notesController.getNotes);
notesRouter.get('/:id', notesController.getNote);
notesRouter.put('/:id', notesController.updateNote);
notesRouter.delete('/:id', notesController.deleteNote);

export default notesRouter;
